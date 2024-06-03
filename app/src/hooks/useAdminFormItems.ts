import { useState } from 'react'
import type { Form, LanguagesEnum, Question } from '../types'

const generateId = () => Math.floor(Math.random() * 1000000)

const useAdminFormItems = () => {
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
    setFormItems,
  }
}

export default useAdminFormItems

type UseAdminFormItems = ReturnType<typeof useAdminFormItems>

export type { UseAdminFormItems }
