import type {
  Form,
  Option,
  TextQuestion,
  ChoiceQuestion,
  ChoiceQuestionWithAnswer,
  TextQuestionWithAnswer,
  Question,
  AnswerFormItems,
  FormItems,
  QuestionWithAnswer,
} from './index'

function isValidISODate(dateString: string): boolean {
  const isoDatePattern =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?Z$/
  return isoDatePattern.test(dateString)
}

export const isForm = (obj: any): obj is Form => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.accessCode === 'string' &&
    typeof obj.published === 'boolean' &&
    typeof obj.createdAt === 'string' &&
    isValidISODate(obj.createdAt) &&
    typeof obj.updatedAt === 'string' &&
    isValidISODate(obj.updatedAt)
  )
}

export const isFormArray = (arr: any[]): arr is Form[] => {
  return arr.every(isForm)
}

export const isOption = (obj: any): obj is Option =>
  typeof obj === 'object' &&
  obj !== null &&
  typeof obj.text === 'string' &&
  typeof obj.id === 'number'

export const isTextQuestion = (obj: any): obj is TextQuestion =>
  typeof obj === 'object' &&
  obj !== null &&
  typeof obj.text === 'string' &&
  typeof obj.id === 'number' &&
  obj.type === 'TEXT'

export const isChoiceQuestion = (obj: any): obj is ChoiceQuestion =>
  typeof obj === 'object' &&
  obj !== null &&
  typeof obj.text === 'string' &&
  typeof obj.id === 'number' &&
  (obj.type === 'MULTIPLE_CHOICE' || obj.type === 'RADIO') &&
  Array.isArray(obj.options) &&
  obj.options.every(isOption)

export const isQuestion = (obj: any): obj is Question =>
  isTextQuestion(obj) || isChoiceQuestion(obj)

export const isChoiceQuestionWithAnswer = (
  obj: any,
): obj is ChoiceQuestionWithAnswer =>
  obj.answer.every((id: any) => typeof id === 'number') &&
  Array.isArray(obj.answer) &&
  isChoiceQuestion(obj)

export const isTextQuestionWithAnswer = (
  obj: any,
): obj is TextQuestionWithAnswer =>
  typeof obj.answer === 'string' && isTextQuestion(obj)

export const isQuestionWithAnswer = (obj: any): obj is QuestionWithAnswer =>
  isTextQuestionWithAnswer(obj) || isChoiceQuestionWithAnswer(obj)

export const isFormItems = (obj: any): obj is FormItems =>
  typeof obj === 'object' &&
  obj !== null &&
  typeof obj.title === 'string' &&
  typeof obj.id === 'number' &&
  Array.isArray(obj.questions) &&
  obj.questions.every(isQuestion)

export const isAnswerFormItems = (obj: any): obj is AnswerFormItems =>
  typeof obj === 'object' &&
  obj !== null &&
  typeof obj.title === 'string' &&
  typeof obj.id === 'number' &&
  Array.isArray(obj.questions) &&
  obj.questions.every(isQuestionWithAnswer)
