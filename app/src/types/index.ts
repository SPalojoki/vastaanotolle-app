import { z } from 'zod'

const isValidISODate = (date: string) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
  return isoDateRegex.test(date)
}

const isoDateString = z.string().refine(isValidISODate, {
  message: 'Invalid ISO date format',
})

export const FormListingSchema = z.object({
  id: z.number(),
  translations: z.array(
    z.object({
      language: z.string(),
      title: z.string(),
    }),
  ),
  accessCode: z.string(),
  published: z.boolean(),
  createdAt: isoDateString,
  updatedAt: isoDateString,
})

export const FormListingArraySchema = z.array(FormListingSchema)

export type FormListing = z.infer<typeof FormListingSchema>

export const LanguagesEnumSchema = z.enum(['FI', 'SE'])

export type LanguagesEnum = z.infer<typeof LanguagesEnumSchema>

export const FormTranslationSchema = z.object({
  language: LanguagesEnumSchema,
  title: z.string(),
})

export const QandAnsTranslationSchema = z.object({
  language: LanguagesEnumSchema,
  text: z.string(),
  reportText: z.string(),
})

export const OptionSchema = z.object({
  translations: z.array(QandAnsTranslationSchema),
  id: z.number(), // Used for react key
})

export const ChoiceQuestionSchema = z.object({
  translations: z.array(QandAnsTranslationSchema),
  type: z.enum(['MULTIPLE_CHOICE', 'TEXT']),
  answerCount: z.number(),
  options: z.array(OptionSchema),
  id: z.number(), // Used for react key
})

export const TextQuestionSchema = z.object({
  translations: z.array(QandAnsTranslationSchema),
  type: z.literal('TEXT'),
  id: z.number(), // Used for react key
})

export const QuestionSchema = z.union([
  ChoiceQuestionSchema,
  TextQuestionSchema,
])

export const FormSchema = z.object({
  questions: z.array(QuestionSchema),
  translations: z.array(FormTranslationSchema),
})

export type Form = z.infer<typeof FormSchema>
export type Question = z.infer<typeof QuestionSchema>

export interface Option {
  text: string
  reportText: string
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

export type RichAnswer = {
  value: string[]
  reportText: string
}

export type RichQuestion = {
  id: number
  text: string
  answer: RichAnswer
}

export type RichSubmission = {
  formId: number
  formTitle: string
  questions: RichQuestion[]
}
