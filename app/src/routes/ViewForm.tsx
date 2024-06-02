import { Scanner } from '@yudiel/react-qr-scanner'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { RichSubmission, RichQuestion, RichSubmissionSchema } from '../types'
import { useTranslation } from 'react-i18next'

const useSubmission = () => {
  const { i18n } = useTranslation()

  const [submission, setSubmission] = useState<RichSubmission | undefined>(
    undefined,
  )
  const [submissionTranslated, setSubmissionTranslated] = useState<
    RichSubmission | undefined
  >(undefined)

  const processSubmission = async (submissionString: string) => {
    try {
      const response = await axios.post('/api/doctor/decode', {
        submissionString,
      })
      const data = RichSubmissionSchema.parse(response.data)
      setSubmission(data)
    } catch (error) {
      console.error('Failed to fetch submissions.')
    }
  }

  const translateSubmission = async () => {
    if (!submission) {
      throw new Error('Submission is not scanned yet!')
    }

    console.log('original:', submission)
    console.log('Translating submission: ', i18n.language)

    const translatedSubmission = {
      ...submission,
      translations: [
        submission.translations.find(
          (translation) => translation.language === i18n.language,
        ) || submission.translations[0],
      ],
      questions: submission.questions.map((question) => {
        // Verbose syntax needed for correct type inference
        if (question.type === 'MULTIPLE_CHOICE') {
          return {
            ...question,
            answer: question.answer.map((answer) => ({
              ...answer,
              translations: [
                answer.translations.find(
                  (translation) => translation.language === i18n.language,
                ) || answer.translations[0],
              ],
            })),
          }
        } else return question
      }),
    }
    setSubmissionTranslated(translatedSubmission)
    console.log(translatedSubmission)
  }

  useEffect(() => {
    translateSubmission()
  }, [submission, i18n.language])

  return { submission, processSubmission, submissionTranslated }
}

const ScanQR = ({
  processSubmission,
}: {
  processSubmission: (answers: string) => void
}) => {
  // Used to tackle a bug with the scanner component: https://github.com/yudielcurbelo/react-qr-scanner/issues/33
  const [enabled, setEnabled] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    setEnabled(true)
  }, [])

  return (
    <div className='grid h-full grid-cols-1 grid-rows-2 text-center md:grid-cols-2 md:grid-rows-1 md:items-center'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <h1 className='text-4xl font-bold'>{t('readyToScan')}</h1>
        <p>{t('readQR')}</p>
      </div>
      <div className='flex justify-center'>
        <div className='flex h-64 w-64 items-center justify-center rounded-lg border-2 border-indigo-800 bg-white p-4 shadow-lg'>
          <Scanner
            onResult={(res) => {
              setEnabled(false)
              processSubmission(res)
            }}
            options={{ delayBetweenScanSuccess: 5000 }}
            onError={(error) => console.error(error?.message)}
            components={{ tracker: true, audio: false }}
            enabled={enabled}
          />
        </div>
      </div>
    </div>
  )
}

const questionTypeMapping = {
  MULTIPLE_CHOICE: 'multipleChoiceQuestion',
  TEXT: 'textQuestion',
}

const QuestionCard = ({
  question,
  index,
}: {
  question: RichQuestion
  index: number
}) => {
  const { t } = useTranslation()
  return (
    <div className='mb-4 overflow-hidden rounded-lg bg-indigo-500 shadow-md'>
      <div className='grid grid-cols-[auto_1fr_auto] items-center bg-indigo-600 p-4 text-white'>
        <p className='mr-4 font-bold'>{index + 1}</p>
        <p>{question.translations[0].text}</p>
        <p>{t(questionTypeMapping[question.type])}</p>
      </div>
      <div className='bg-indigo-300 p-4'>
        {question.type === 'MULTIPLE_CHOICE' ? (
          <div className='flex flex-wrap gap-2'>
            {question.answer.map((answer, answerIndex) => (
              <p
                key={answerIndex}
                className='rounded-md bg-indigo-200 p-2 shadow-inner'
              >
                {answer.translations[0].text}
              </p>
            ))}
          </div>
        ) : (
          <div>
            <p>{question.answer.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ReviewAnswers = ({
  submissionTranslated,
}: {
  submissionTranslated: RichSubmission
}) => {
  const { t } = useTranslation()
  return (
    <div className='grid h-full grid-cols-[3fr_1fr] grid-rows-[auto_1fr] gap-4'>
      <div className='col-span-2 mt-4'>
        <p>{t('patientFormSubmission')}</p>
        <h2 className='text-2xl font-bold'>
          {submissionTranslated.translations[0].title}
        </h2>
      </div>
      <div className='mtflex flex-col gap-4'>
        {submissionTranslated.questions.map((question, index) => (
          <QuestionCard key={question.id} question={question} index={index} />
        ))}
      </div>
      <div>
        <div className='rounded-lg bg-white p-4 shadow-md'>
          {submissionTranslated.questions.map((question) => (
            <p key={question.id}>
              <strong>{question.translations[0].text}</strong>
              <br />
              {question.translations[0].reportText}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

const ViewForm = () => {
  const { submissionTranslated, processSubmission } = useSubmission()

  return (
    <div className='h-full'>
      {submissionTranslated ? (
        <>
          <ReviewAnswers submissionTranslated={submissionTranslated} />
        </>
      ) : (
        <>
          <ScanQR processSubmission={processSubmission} />
        </>
      )}
    </div>
  )
}

export default ViewForm
