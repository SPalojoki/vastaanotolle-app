import type { RichAnswer, RichQuestion, RichSubmission } from './index'

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
