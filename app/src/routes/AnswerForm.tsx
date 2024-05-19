import { useLocation, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  AnswerFormItems,
  FormItems,
  Option,
  QuestionWithAnswer,
} from '../types'
import { isAnswerFormItems, isFormItems } from '../types/guards'
import PatientButton from '../components/PatientButton'
import { MdArrowForward, MdArrowBack, MdCheck, MdQrCode2 } from 'react-icons/md'

const TextAnswerField = ({
  value,
  onChange,
}: {
  value: string
  onChange: (answer: string) => void
}) => {
  return (
    <textarea
      className='h-60 w-full rounded-lg border-l-4 border-indigo-300 bg-indigo-200 p-2 transition-all focus:border-indigo-500 focus:outline-none'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Type your answer here...'
    />
  )
}

const ChoiceQuestionOptions = ({
  options,
  answers,
  type,
  updateAnswers,
}: {
  options: Option[]
  answers: number[]
  type: 'MULTIPLE_CHOICE' | 'RADIO'
  updateAnswers: (updated: number[]) => void
}) => {
  const updateAnswer = (id: number) => {
    if (type === 'RADIO') {
      updateAnswers([id])
    } else {
      if (answers.includes(id)) {
        updateAnswers(answers.filter((answer) => answer !== id))
      } else {
        updateAnswers([...answers, id])
      }
    }
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
          <p>{option.text}</p>
        </div>
      ))}
      <p className='text-center font-thin'>
        {type === 'RADIO'
          ? 'You can select only one option.'
          : 'You can select multiple options.'}
      </p>
    </div>
  )
}

const AnswerQuestion = ({
  question,
  updateAnswer,
}: {
  question: QuestionWithAnswer
  updateAnswer: (answer: QuestionWithAnswer) => void
}) => {
  return (
    <div className='grid grid-rows-[1fr_4fr_2fr] items-center'>
      <h2 className='self-end text-3xl font-bold'>{question.text}</h2>
      <div>
        {question.type === 'TEXT' ? (
          <TextAnswerField
            value={question.answer}
            onChange={(answer: string) => updateAnswer({ ...question, answer })}
          />
        ) : (
          <ChoiceQuestionOptions
            type={question.type}
            options={question.options}
            answers={question.answer}
            updateAnswers={(updated: number[]) =>
              updateAnswer({ ...question, answer: updated })
            }
          />
        )}
      </div>
    </div>
  )
}

const AnswerForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { code } = useParams()
  const [formData, setFormData] = useState<AnswerFormItems | undefined>(
    undefined,
  )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1)

  // TODO: Centralize fetching logics outside the components
  useEffect(() => {
    const initFormData = async () => {
      let fetchedData: FormItems

      if (location.state?.data || isFormItems(location.state?.data)) {
        fetchedData = location.state.data
      } else {
        try {
          const response = await axios.get('api/form/' + code)
          const data = response.data
          if (isFormItems(data)) {
            fetchedData = data
          } else {
            throw new Error('Invalid data')
          }
        } catch (e) {
          console.error(e)
          return
        }
      }
      const modifiedData = {
        ...fetchedData,
        questions: fetchedData.questions.map((question) => ({
          ...question,
          answer: question.type === 'TEXT' ? '' : [],
        })),
      }

      if (isAnswerFormItems(modifiedData)) {
        setFormData(modifiedData)
        console.log(modifiedData)
      } else {
        console.error('Invalid data')
      }
    }
    initFormData()
  }, [])

  // TODO: Implement the logic for checking if the user can proceed to the next question
  const canProceed = () => {
    return true
  }

  const updateChoiceQuestionAnswer = (
    questionId: number,
    updatedQuestion: QuestionWithAnswer,
  ) => {
    if (!formData) return

    const isMatchingType = (
      question: typeof updatedQuestion,
      updatedType: string,
    ) => {
      return question.id === questionId && question.type === updatedType
    }

    const updatedFormData: AnswerFormItems = {
      ...formData,
      questions: formData.questions.map((question) => {
        if (isMatchingType(question, updatedQuestion.type)) {
          return updatedQuestion
        }
        return question
      }),
    }

    setFormData(updatedFormData)
  }

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
                updateAnswer={(updatedAnswer: QuestionWithAnswer) =>
                  updateChoiceQuestionAnswer(
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
                  disabled={!canProceed()}
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
              <p className='text-2xl font-bold'>{formData.title}</p>
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
