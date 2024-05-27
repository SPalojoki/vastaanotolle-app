import type {
  Option,
  TextQuestion,
  ChoiceQuestion,
  ChoiceQuestionWithAnswer,
  TextQuestionWithAnswer,
  Question,
  AnswerFormItems,
  FormItems,
  QuestionWithAnswer,
  RichAnswer,
  RichQuestion,
  RichSubmission,
} from './index'

export const isOption = (obj: any): obj is Option =>
  typeof obj === 'object' &&
  obj !== null &&
  typeof obj.text === 'string' &&
  typeof obj.reportText === 'string' &&
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

export const isRichAnswer = (obj: any): obj is RichAnswer =>
  obj !== null &&
  typeof obj === 'object' &&
  Array.isArray(obj.value) &&
  obj.value.every((item: any) => typeof item === 'string') &&
  typeof obj.reportText === 'string'

export const isRichQuestion = (obj: any): obj is RichQuestion =>
  obj !== null &&
  typeof obj === 'object' &&
  typeof obj.id === 'number' &&
  typeof obj.text === 'string' &&
  isRichAnswer(obj.answer)

export const isRichSubmission = (obj: any): obj is RichSubmission =>
  obj !== null &&
  typeof obj === 'object' &&
  typeof obj.formId === 'number' &&
  typeof obj.formTitle === 'string' &&
  Array.isArray(obj.questions) &&
  obj.questions.every(isRichQuestion)
