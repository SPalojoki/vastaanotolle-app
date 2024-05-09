import { useState, Fragment } from 'react'
import type { NewFormItems, NewQuestion } from '../types'
import {
  MdRadioButtonChecked,
  MdCheckBox,
  MdOutlineShortText,
  MdSave,
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid' // Used as temporary local IDs for react keys and filtering. Final ID generated in backend

const QuestionCard = ({
  details,
  updateQuestion,
  removeQuestion,
}: {
  details: NewQuestion
  updateQuestion: (updated: NewQuestion) => void
  removeQuestion: () => void
}) => {
  const updateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQuestion({ ...details, text: e.target.value })
  }

  const updateOption = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (details.type === 'TEXT') return // Should not be called for TEXT questions
    updateQuestion({
      ...details,
      options: details.options.map((option) =>
        option.id === id ? { ...option, text: e.target.value } : option,
      ),
    })
  }

  const addOption = () => {
    if (details.type === 'TEXT') return // Should not be called for TEXT questions
    updateQuestion({
      ...details,
      options: [...details.options, { text: '', id: uuidv4() }],
    })
  }

  const removeOption = (id: string) => {
    if (details.type === 'TEXT') return // Should not be called for TEXT questions
    updateQuestion({
      ...details,
      options: details.options.filter((option) => option.id !== id),
    })
  }

  const titleMapping = {
    MULTIPLE_CHOICE: 'Multiple choice',
    RADIO: 'Radio button',
    TEXT: 'Free text',
  }

  return (
    <div className='overflow-hidden rounded-lg bg-gray-50 shadow-md'>
      <div className='flex justify-between bg-gray-200'>
        <h3 className='px-6 py-3 text-sm font-bold uppercase'>
          {titleMapping[details.type]}
        </h3>
        <button
          className='px-6 py-3 text-sm text-red-500 hover:text-red-700'
          type='button'
          onClick={removeQuestion}
        >
          Delete question
        </button>
      </div>
      <div className='mx-6 my-3 text-gray-900'>
        <div className='flex items-center gap-3'>
          <label className='font-medium'>Question title</label>
          <input
            className='flex-grow rounded border-2 bg-gray-100 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
            type='text'
            value={details.text}
            onChange={updateTitle}
          />
        </div>
        {details.type === 'MULTIPLE_CHOICE' || details.type === 'RADIO' ? (
          <div className='mt-4'>
            <div className='grid grid-cols-[3fr_6fr_8fr_1fr] items-center gap-2'>
              <label className='col-start-2 text-sm text-gray-700'>Text</label>
              <label className='col-start-3 text-sm text-gray-700'>
                Report text (available later)
              </label>
              {details.options.map((option, index) => (
                <Fragment key={option.id}>
                  <label className='col-start-1 mr-2 justify-self-end'>
                    Option {index + 1}
                  </label>
                  <input
                    className='rounded border-2 bg-gray-100 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
                    type='text'
                    value={option.text}
                    onChange={(e) => {
                      updateOption(option.id, e)
                    }}
                  />
                  <input
                    disabled
                    type='text'
                    className='rounded border-2 bg-gray-100 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
                  />
                  <button
                    className='text-sm text-red-500 disabled:cursor-not-allowed disabled:opacity-50'
                    onClick={() => removeOption(option.id)}
                    disabled={details.options.length <= 2}
                  >
                    Delete
                  </button>
                </Fragment>
              ))}
              <button
                type='button'
                onClick={addOption}
                className='col-start-2 rounded border-2 bg-gray-100 px-4 py-2 leading-tight text-gray-700 transition-all hover:bg-gray-200 hover:shadow-inner'
              >
                New option
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const NewForm = () => {
  const [items, setItems] = useState<NewFormItems>({
    title: '',
    questions: [],
  })
  const navigate = useNavigate()

  const addQuestion = (type: 'MULTIPLE_CHOICE' | 'RADIO' | 'TEXT') => {
    setItems({
      ...items,
      questions: [
        ...items.questions,
        {
          type,
          text: '',
          options: [
            { text: '', id: uuidv4() },
            { text: '', id: uuidv4() },
          ],
          id: uuidv4(),
        },
      ],
    })
  }

  const removeQuestion = (id: string) => {
    setItems({
      ...items,
      questions: items.questions.filter((question) => question.id !== id),
    })
  }

  const updateQuestion = (id: string, updated: NewQuestion) => {
    setItems({
      ...items,
      questions: items.questions.map((question) =>
        question.id === id ? updated : question,
      ),
    })
  }

  const saveForm = () => {
    axios.post('http://localhost:3000/admin/form', items).then(() => {
      navigate('/admin')
    })
  }

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <input
          className='w-full rounded border-2 border-transparent bg-gray-100 py-2 text-4xl font-bold leading-tight text-gray-700 transition-all hover:border-gray-200 hover:px-4 focus:border-gray-200 focus:px-4 focus:outline-none'
          type='text'
          value={items.title}
          onChange={(e) => setItems({ ...items, title: e.target.value })}
          placeholder='Form title'
        />
      </div>
      {items?.questions.map((question) => (
        <QuestionCard
          key={question.id}
          details={question}
          updateQuestion={(updated) => updateQuestion(question.id, updated)}
          removeQuestion={() => removeQuestion(question.id)}
        />
      ))}
      <div className='flex w-full gap-3'>
        <button
          type='button'
          onClick={() => addQuestion('MULTIPLE_CHOICE')}
          className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-inner'
        >
          <MdCheckBox size={24} />
          Add multiple choice question
        </button>
        <button
          type='button'
          onClick={() => addQuestion('RADIO')}
          className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-inner'
        >
          <MdRadioButtonChecked size={24} />
          Add radio question
        </button>
        <button
          type='button'
          onClick={() => addQuestion('TEXT')}
          className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-inner'
        >
          <MdOutlineShortText size={24} />
          Add free text question
        </button>
        <button
          type='button'
          onClick={saveForm}
          className='flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-white shadow-md transition-all hover:bg-green-700 hover:shadow-inner'
        >
          <MdSave size={24} />
          Save form
        </button>
      </div>
    </div>
  )
}

export default NewForm
