import { useState, Fragment } from 'react'
import type { Form, LanguagesEnum, Question } from '../types'
import { MdCheckBox, MdOutlineShortText, MdSave } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Selector from '../components/Dropdown'

const generateId = () => Math.floor(Math.random() * 1000000)

const useFormItems = () => {
  const [formItems, setFormItems] = useState<Form>({
    translations: [
      { language: 'FI', title: '' },
      { language: 'SE', title: '' },
    ],
    questions: [],
  })

  const updateTitle = (language: LanguagesEnum, title: string) => {
    setFormItems({
      ...formItems,
      translations: formItems.translations.map((translation) => {
        if (translation.language === language) {
          return { ...translation, title }
        }
        return translation
      }),
    })
  }

  const addQuestion = (type: 'MULTIPLE_CHOICE' | 'TEXT') => {
    let newQuestion: Question

    if (type === 'MULTIPLE_CHOICE') {
      newQuestion = {
        type,
        translations: [
          { language: 'FI', text: '', reportText: '' },
          { language: 'SE', text: '', reportText: '' },
        ],
        id: generateId(),
        options: [
          {
            translations: [
              { language: 'FI', text: '', reportText: '' },
              { language: 'SE', text: '', reportText: '' },
            ],
            id: generateId(),
          },
          {
            translations: [
              { language: 'FI', text: '', reportText: '' },
              { language: 'SE', text: '', reportText: '' },
            ],
            id: generateId(),
          },
        ],
        answerCount: 1,
      }
    } else {
      newQuestion = {
        type,
        translations: [
          { language: 'FI', text: '', reportText: '' },
          { language: 'SE', text: '', reportText: '' },
        ],
        id: generateId(),
      }
    }

    setFormItems({
      ...formItems,
      questions: [...formItems.questions, newQuestion],
    })
  }

  const removeQuestion = (id: number) => {
    setFormItems({
      ...formItems,
      questions: formItems.questions.filter((question) => question.id !== id),
    })
  }

  const updateQuestion = (
    id: number,
    language: LanguagesEnum,
    field: 'text' | 'reportText' | 'answerCount',
    text: string,
  ) => {
    if (field === 'answerCount' && text !== '') {
      setFormItems({
        ...formItems,
        questions: formItems.questions.map((question) => {
          if (question.id === id) {
            return { ...question, [field]: parseInt(text) }
          }
          return question
        }),
      })
    } else {
      setFormItems({
        ...formItems,
        questions: formItems.questions.map((question) => {
          if (question.id === id) {
            return {
              ...question,
              translations: question.translations.map((translation) => {
                if (translation.language === language) {
                  return { ...translation, [field]: text }
                }
                return translation
              }),
            }
          }
          return question
        }),
      })
    }
  }

  const addOption = (questionId: number) => {
    setFormItems({
      ...formItems,
      questions: formItems.questions.map((question) => {
        if (question.id === questionId && question.type === 'MULTIPLE_CHOICE') {
          return {
            ...question,
            options: [
              ...question.options,
              {
                translations: [
                  { language: 'FI', text: '', reportText: '' },
                  { language: 'SE', text: '', reportText: '' },
                ],
                id: generateId(),
              },
            ],
          }
        }
        return question
      }),
    })
  }

  const removeOption = (questionId: number, optionId: number) => {
    setFormItems({
      ...formItems,
      questions: formItems.questions.map((question) => {
        if (question.id === questionId && question.type === 'MULTIPLE_CHOICE') {
          return {
            ...question,
            options: question.options.filter(
              (option) => option.id !== optionId,
            ),
          }
        }
        return question
      }),
    })
  }

  const updateOption = (
    questionId: number,
    optionId: number,
    language: LanguagesEnum,
    field: 'text' | 'reportText',
    text: string,
  ) => {
    setFormItems({
      ...formItems,
      questions: formItems.questions.map((question) => {
        if (question.id === questionId && question.type === 'MULTIPLE_CHOICE') {
          return {
            ...question,
            options: question.options.map((option) => {
              if (option.id === optionId) {
                return {
                  ...option,
                  translations: option.translations.map((translation) => {
                    if (translation.language === language) {
                      return { ...translation, [field]: text }
                    }
                    return translation
                  }),
                }
              }
              return option
            }),
          }
        }
        return question
      }),
    })
  }

  return {
    formItems,
    updateTitle,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    removeOption,
    updateOption,
  }
}

const QuestionCard = ({
  details,
  editingLanguage,
  updateQuestion,
  removeQuestion,
  addOption,
  removeOption,
  updateOption,
}: {
  details: Question
  editingLanguage: LanguagesEnum
  updateQuestion: (
    field: 'text' | 'reportText' | 'answerCount',
    text: string,
  ) => void
  removeQuestion: () => void
  addOption: () => void
  removeOption: (optionId: number) => void
  updateOption: (
    optionId: number,
    field: 'text' | 'reportText',
    text: string,
  ) => void
}) => {
  const titleMapping = {
    MULTIPLE_CHOICE: 'Choice',
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
        <div className='grid grid-cols-[auto_1fr] items-center gap-2'>
          <label className='font-medium'>Question</label>
          <input
            className='flex-grow rounded border-2 bg-gray-100 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
            type='text'
            value={
              details.translations.find((t) => t.language === editingLanguage)
                ?.text || ''
            }
            onChange={(e) => updateQuestion('text', e.target.value)}
          />
          <label className='font-medium'>Report text</label>
          <input
            className='flex-grow rounded border-2 bg-gray-100 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
            type='text'
            value={
              details.translations.find((t) => t.language === editingLanguage)
                ?.reportText || ''
            }
            onChange={(e) => updateQuestion('reportText', e.target.value)}
          />
        </div>
        {details.type === 'MULTIPLE_CHOICE' && details.options ? (
          <div className='mt-4'>
            <div className='grid grid-cols-[3fr_6fr_8fr_1fr] items-center gap-2'>
              <label className='col-start-2 text-sm text-gray-700'>Text</label>
              <label className='col-start-3 text-sm text-gray-700'>
                Report text
              </label>
              {details.options.map((option, index) => (
                <Fragment key={option.id}>
                  <label className='col-start-1 mr-2 justify-self-end'>
                    Option {index + 1}
                  </label>
                  <input
                    className='rounded border-2 bg-gray-100 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
                    type='text'
                    value={
                      option.translations.find(
                        (t) => t.language === editingLanguage,
                      )?.text || ''
                    }
                    onChange={(e) => {
                      updateOption(option.id, 'text', e.target.value)
                    }}
                  />
                  <input
                    type='text'
                    className='rounded border-2 bg-gray-100 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
                    value={
                      option.translations.find(
                        (t) => t.language === editingLanguage,
                      )?.reportText || ''
                    }
                    onChange={(e) => {
                      updateOption(option.id, 'reportText', e.target.value)
                    }}
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
              <div className='flex items-center gap-2 place-self-end'>
                <label className='text-gray-700'>
                  Allowed selections count
                </label>
                <input
                  type='number'
                  className='rounded border-2 bg-gray-100 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none'
                  value={details.answerCount}
                  onChange={(e) => {
                    updateQuestion('answerCount', e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const NewForm = () => {
  const [editingLanguage, setEditingLanguage] = useState<LanguagesEnum>('FI')
  const {
    formItems,
    updateTitle,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    removeOption,
    updateOption,
  } = useFormItems()

  const navigate = useNavigate()

  const languageOptions = ['FI', 'SE']

  const saveForm = () => {
    axios.post('/api/admin/form', formItems).then(() => {
      navigate('/admin')
    })
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between gap-4'>
        <input
          className='flex-grow rounded border-2 border-transparent bg-gray-100 py-2 text-4xl font-bold leading-tight text-gray-700 transition-all hover:border-gray-200 hover:px-4 focus:border-gray-200 focus:px-4 focus:outline-none'
          type='text'
          value={
            formItems.translations.find((t) => t.language === editingLanguage)
              ?.title || ''
          }
          onChange={(e) => updateTitle(editingLanguage, e.target.value)}
          placeholder='Form title'
        />
        <Selector
          options={languageOptions}
          selected={editingLanguage}
          setSelected={(s) => setEditingLanguage(s as LanguagesEnum)}
          title='Editing language:'
        />
      </div>
      {formItems.questions.map((question) => (
        <QuestionCard
          key={question.id}
          details={question}
          editingLanguage={editingLanguage}
          updateQuestion={(field, text) =>
            updateQuestion(question.id, editingLanguage, field, text)
          }
          removeQuestion={() => removeQuestion(question.id)}
          addOption={() => addOption(question.id)}
          removeOption={(optionId) => removeOption(question.id, optionId)}
          updateOption={(optionId, field, text) =>
            updateOption(question.id, optionId, editingLanguage, field, text)
          }
        />
      ))}
      <div className='flex w-full gap-3'>
        <button
          type='button'
          onClick={() => addQuestion('MULTIPLE_CHOICE')}
          className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-inner'
        >
          <MdCheckBox size={24} />
          Add choice question
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
