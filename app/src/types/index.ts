export interface Form {
  id: string
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

export interface NewOptions {
  text: string
  id: string
}

interface NewQuestionBase {
  text: string
  id: string
}
export interface TextQuestion extends NewQuestionBase {
  type: 'TEXT'
}

export interface ChoiceQuestion extends NewQuestionBase {
  type: 'MULTIPLE_CHOICE' | 'RADIO'
  options: NewOptions[]
}

export type NewQuestion = TextQuestion | ChoiceQuestion

export interface NewFormItems {
  title: string
  questions: NewQuestion[]
}

export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'RADIO'
