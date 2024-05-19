export interface Form {
  id: number
  title: string
  accessCode: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface LoaderData {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any
}

export interface Option {
  text: string
  id: number
}

interface QuestionBase {
  text: string
  id: number
}
export interface TextQuestion extends QuestionBase {
  type: 'TEXT'
}

export interface ChoiceQuestion extends QuestionBase {
  type: 'MULTIPLE_CHOICE' | 'RADIO'
  options: Option[]
}

export type Question = TextQuestion | ChoiceQuestion

export interface NewFormItems {
  title: string
  questions: Question[]
}
export interface FormItems extends NewFormItems {
  id: number
}

export interface AnswerFormItems extends Omit<FormItems, 'questions'> {
  questions: QuestionWithAnswer[]
}

export interface ChoiceQuestionWithAnswer extends ChoiceQuestion {
  answer: number[]
}

export interface TextQuestionWithAnswer extends TextQuestion {
  answer: string
}

export type QuestionWithAnswer =
  | TextQuestionWithAnswer
  | ChoiceQuestionWithAnswer

export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'RADIO'
