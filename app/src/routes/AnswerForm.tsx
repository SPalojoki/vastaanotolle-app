import { useLocation, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  FetchedForm,
  FetchedFormSchema,
  FetchedFormWithAnswers,
  TextQuestionWithAnswer,
  ChoiceQuestionWithAnswer,
  QuestionWithAnswer,
  Option,
} from '../types'
import PatientButton from '../components/PatientButton'
import { MdArrowForward, MdArrowBack, MdCheck, MdQrCode2 } from 'react-icons/md'

const useForm = () => {
  const location = useLocation()
  const { code } = useParams()
  const [formData, setFormData] = useState<FetchedFormWithAnswers | undefined>(
    undefined,
  )

  // Adds an answer field to the questions in fetched form
  const initAnswers = (fetchedForm: FetchedForm) => {
    const fetchedFormWithAnswers: FetchedFormWithAnswers = {
      ...fetchedForm,
      questions: fetchedForm.questions.map((question) => {
        if (question.type === 'TEXT') {
          return {
            ...question,
            answer: '',
          } as TextQuestionWithAnswer
        } else if (question.type === 'MULTIPLE_CHOICE') {
          return {
            ...question,
            answer: [],
          } as ChoiceQuestionWithAnswer
        } else {
          throw new Error('Invalid question type')
        }
      }),
    }

    return fetchedFormWithAnswers
  }

  const initFormData = async () => {
    try {
      // Checks if the form data is already fetched in the code entry page
      const fetchedForms = FetchedFormSchema.parse(location.state?.data)
      setFormData(initAnswers(fetchedForms))
    } catch {
      const response = await axios.get('/api/form/' + code)
      setFormData(initAnswers(FetchedFormSchema.parse(response.data)))
    }
  }

  const updateAnswer = (
    questionId: number,
    updatedAnswer: string | number[],
  ) => {
    if (!formData) {
      throw new Error('Form is not fetched yet!')
    }

    setFormData({
      ...formData,
      questions: formData.questions.map((question) => {
        if (question.id === questionId) {
          if (question.type === 'TEXT' && typeof updatedAnswer === 'string') {
            return {
              ...question,
              answer: updatedAnswer,
            }
          } else if (
            question.type === 'MULTIPLE_CHOICE' &&
            Array.isArray(updatedAnswer) &&
            updatedAnswer.every((optionId) => typeof optionId === 'number')
          ) {
            return {
              ...question,
              answer: updatedAnswer,
            }
          } else {
            throw new Error('Invalid answer type')
          }
        } else {
          return question
        }
      }),
    })
  }

  useEffect(() => {
    initFormData()
  }, [])

  return { formData, updateAnswer }
}

const TextAnswerField = ({
  value,
  updateAnswer,
}: {
  value: string
  updateAnswer: (answer: string) => void
}) => {
  return (
    <textarea
      className='h-60 w-full rounded-lg border-l-4 border-indigo-300 bg-indigo-200 p-2 transition-all focus:border-indigo-500 focus:outline-none'
      value={value}
      onChange={(e) => updateAnswer(e.target.value)}
      placeholder='Type your answer here...'
    />
  )
}

const ChoiceQuestionOptions = ({
  options,
  answers,
  answerCount,
  updateAnswers,
}: {
  options: Option[]
  answers: number[]
  answerCount: number
  updateAnswers: (updated: number[]) => void
}) => {
  const updateAnswer = (optionId: number) => {
    const newAnswers = new Set(answers)
    if (newAnswers.has(optionId)) {
      newAnswers.delete(optionId)
    } else if (newAnswers.size < answerCount) {
      newAnswers.add(optionId)
    }
    updateAnswers(Array.from(newAnswers))
  }

  // TODO: Fix HTML semantics (for screen readers etc.)
  return (
    <div className='flex flex-col gap-4'>
      {options.map((option, index) => (
        <div
          className={`flex cursor-pointer flex-row items-center gap-4 overflow-hidden rounded-md border-2 bg-indigo-200 transition-all ${answers.includes(option.id) ? 'border-indigo-800 shadow-sm' : ''}`}
          key={option.id}
          onClick={() => updateAnswer(option.id)}
        >
          <p className='w-12 bg-indigo-300 p-4 text-center font-bold'>
            {index + 1}
          </p>
          <p>{option.translations[0].text}</p>
        </div>
      ))}
    </div>
  )
}

const AnswerQuestion = ({
  question,
  updateAnswer,
}: {
  question: QuestionWithAnswer
  updateAnswer: (updatedAnswer: string | number[]) => void
}) => {
  return (
    <div className='grid grid-rows-[1fr_4fr_2fr] items-center'>
      <h2 className='self-end text-3xl font-bold'>
        {question.translations[0].text}
      </h2>
      <div>
        {question.type === 'TEXT' ? (
          <TextAnswerField
            value={question.answer}
            updateAnswer={updateAnswer}
          />
        ) : (
          <ChoiceQuestionOptions
            options={question.options}
            answers={question.answer}
            answerCount={question.answerCount}
            updateAnswers={updateAnswer}
          />
        )}
      </div>
    </div>
  )
}

const AnswerForm = () => {
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1)
  const { formData, updateAnswer } = useForm()

  const encodeAndProceed = () => {
    if (!formData) return

    const compressedPayload = {
      fId: formData.id,
      qs: formData.questions.map((question) => ({
        qId: question.id,
        a: question.answer,
      })),
    }

    navigate(`/generate?data=${btoa(JSON.stringify(compressedPayload))}`)
  }

  return (
    <>
      {formData ? (
        currentQuestionIndex >= 0 ? (
          currentQuestionIndex < formData.questions.length ? (
            <div className='grid h-full grid-rows-[auto_1fr] p-2'>
              <p className='text-center font-thin'>
                Question {currentQuestionIndex + 1} out of
                {' ' + formData.questions.length}
              </p>
              <AnswerQuestion
                question={formData.questions[currentQuestionIndex]}
                updateAnswer={(updatedAnswer: string | number[]) =>
                  updateAnswer(
                    formData.questions[currentQuestionIndex].id,
                    updatedAnswer,
                  )
                }
              />
              <div className='m-8 flex justify-around'>
                <PatientButton
                  onClick={() =>
                    setCurrentQuestionIndex(currentQuestionIndex - 1)
                  }
                >
                  <MdArrowBack />
                </PatientButton>
                <PatientButton
                  onClick={() =>
                    setCurrentQuestionIndex(currentQuestionIndex + 1)
                  }
                >
                  {currentQuestionIndex === formData.questions.length - 1 ? (
                    <MdCheck />
                  ) : (
                    <MdArrowForward />
                  )}
                </PatientButton>
              </div>
            </div>
          ) : (
            <div className='flex h-full flex-col items-center justify-around gap-4'>
              Now, let's review... (available later)
              <div>
                <PatientButton text={'Generate'} onClick={encodeAndProceed}>
                  <MdQrCode2 />
                </PatientButton>
              </div>
            </div>
          )
        ) : (
          <div className='grid h-full grid-rows-[1fr_4fr_2fr] items-center text-center'>
            <p className='font-thin'>Welcome!</p>
            <div>
              <p className='text-2xl font-bold'>
                {formData.translations[0].title}
              </p>
              <p className='text-md mt-2'>
                You will be asked a series of questions to speed up your
                upcoming appointment.
              </p>
            </div>
            <div className='flex justify-center'>
              <PatientButton
                text={'Begin'}
                onClick={() => setCurrentQuestionIndex(0)}
              >
                <MdArrowForward />
              </PatientButton>
            </div>
          </div>
        )
      ) : (
        <div className='text-center'>Loading...</div>
      )}
    </>
  )
}

export default AnswerForm
