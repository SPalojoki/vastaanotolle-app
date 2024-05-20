import { Scanner } from '@yudiel/react-qr-scanner'
import axios from 'axios'
import { useState } from 'react'
import { RichQuestion, RichSubmission } from '../types'
import { isRichSubmission } from '../types/guards'

const ScanQR = ({
  setSubmission,
}: {
  setSubmission: React.Dispatch<
    React.SetStateAction<RichSubmission | undefined>
  >
}) => {
  const decodeOnServer = async (encodedAnswers: string) => {
    try {
      const { data } = await axios.post('/api/doctor/decode', {
        encodedAnswers,
      })
      if (isRichSubmission(data)) {
        setSubmission(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='grid h-full grid-cols-1 grid-rows-2 text-center md:grid-cols-2 md:grid-rows-1 md:items-center'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <h1 className='text-4xl font-bold'>Ready to scan</h1>
        <p>Read the QR code to review patient answers.</p>
      </div>
      <div className='flex justify-center'>
        <div className='flex h-64 w-64 items-center justify-center rounded-lg border-2 border-indigo-800 bg-white p-4 shadow-lg'>
          <Scanner
            onResult={(text) => decodeOnServer(text)}
            onError={(error) => console.error(error?.message)}
            components={{ tracker: true, audio: false }}
            enabled={true}
          />
        </div>
      </div>
    </div>
  )
}

const QuestionCard = ({
  question,
  index,
}: {
  question: RichQuestion
  index: number
}) => {
  return (
    <div className='mb-4 overflow-hidden rounded-lg bg-indigo-500 shadow-md'>
      <div className='flex items-center bg-indigo-600 p-4'>
        <p className='mr-4 font-bold text-white'>{index + 1}</p>
        <div className='text-white'>{question.text}</div>
      </div>
      <div className='bg-indigo-300 p-4'>
        {question.answer.value.map((answer, answerIndex) => (
          <p key={answerIndex} className='mb-2 rounded-lg bg-indigo-200 p-2'>
            {answer}
          </p>
        ))}
      </div>
    </div>
  )
}

const ReviewAnswers = ({
  submission,
  setSubmission,
}: {
  submission: RichSubmission
  setSubmission: React.Dispatch<
    React.SetStateAction<RichSubmission | undefined>
  >
}) => {
  return (
    <div className='grid h-full grid-rows-[auto_1fr]'>
      <div className='mt-4'>
        <p>Patient form submission</p>
        <h2 className='text-2xl font-bold'>{submission.formTitle}</h2>
      </div>
      <div className='mt-4 flex flex-col gap-4'>
        {submission.questions.map((question, index) => (
          <QuestionCard key={question.id} question={question} index={index} />
        ))}
      </div>
    </div>
  )
}

const ViewForm = () => {
  const [submission, setSubmission] = useState<RichSubmission | undefined>(
    undefined,
  )

  return (
    <div className='h-full'>
      {submission ? (
        <>
          <ReviewAnswers
            submission={submission}
            setSubmission={setSubmission}
          />
        </>
      ) : (
        <>
          <ScanQR setSubmission={setSubmission} />
        </>
      )}
    </div>
  )
}

export default ViewForm
