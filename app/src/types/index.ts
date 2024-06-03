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
})

export const FormListingArraySchema = z.array(FormListingSchema)

export type FormListing = z.infer<typeof FormListingSchema>

export const LanguagesEnumSchema = z.enum(['FI', 'SE'])

export type LanguagesEnum = z.infer<typeof LanguagesEnumSchema>

export const FormTranslationSchema = z.object({
  id: z.number().optional(),
  language: LanguagesEnumSchema,
  title: z.string(),
})

export const QandAnsTranslationSchema = z.object({
  id: z.number().optional(),
  language: LanguagesEnumSchema,
  text: z.string(),
  reportText: z.string(),
})

export const OptionSchema = z.object({
  translations: z.array(QandAnsTranslationSchema),
  id: z.number(), // Used for react key
})

export type Option = z.infer<typeof OptionSchema>

export const ChoiceQuestionSchema = z.object({
  translations: z.array(QandAnsTranslationSchema),
  type: z.enum(['MULTIPLE_CHOICE']),
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
  id: z.number().optional(),
  questions: z.array(QuestionSchema),
  translations: z.array(FormTranslationSchema),
})

export type Form = z.infer<typeof FormSchema>
export type Question = z.infer<typeof QuestionSchema>

export const FetchedFormSchema = FormSchema.extend({
  id: z.number(),
})

export type FetchedForm = z.infer<typeof FetchedFormSchema>

export const ChoiceQuestionWithAnswerSchema = ChoiceQuestionSchema.extend({
  answer: z.array(z.number()),
})

export type ChoiceQuestionWithAnswer = z.infer<
  typeof ChoiceQuestionWithAnswerSchema
>

export const TextQuestionWithAnswerSchema = TextQuestionSchema.extend({
  answer: z.string(),
})

export type TextQuestionWithAnswer = z.infer<
  typeof TextQuestionWithAnswerSchema
>

export const QuestionWithAnswerSchema = z.union([
  ChoiceQuestionWithAnswerSchema,
  TextQuestionWithAnswerSchema,
])

export type QuestionWithAnswer = z.infer<typeof QuestionWithAnswerSchema>

export const FetchedFormWithAnswersSchema = FetchedFormSchema.extend({
  questions: z.array(QuestionWithAnswerSchema),
})

export type FetchedFormWithAnswers = z.infer<
  typeof FetchedFormWithAnswersSchema
>

export const RichChoiceAnswerSchema = z.object({
  type: z.literal('MULTIPLE_CHOICE'),
  translations: z.array(QandAnsTranslationSchema),
})

export type RichChoiceAnswer = z.infer<typeof RichChoiceAnswerSchema>

export const RichTextAnswerSchema = z.object({
  type: z.literal('TEXT'),
  text: z.string(),
})

export type RichTextAnswer = z.infer<typeof RichTextAnswerSchema>

export const RichAnswerSchema = z.union([
  RichChoiceAnswerSchema,
  RichTextAnswerSchema,
])

export type RichAnswer = z.infer<typeof RichAnswerSchema>

export const RichTextQuestionSchema = z.object({
  id: z.number(),
  type: z.literal('TEXT'),
  translations: z.array(QandAnsTranslationSchema),
  answer: RichTextAnswerSchema,
})

export type RichTextQuestion = z.infer<typeof RichTextQuestionSchema>

export const RichChoiceQuestionSchema = z.object({
  id: z.number(),
  type: z.literal('MULTIPLE_CHOICE'),
  translations: z.array(QandAnsTranslationSchema),
  answer: z.array(RichChoiceAnswerSchema),
})

export type RichChoiceQuestion = z.infer<typeof RichChoiceQuestionSchema>

export const RichQuestionSchema = z.union([
  RichTextQuestionSchema,
  RichChoiceQuestionSchema,
])

export type RichQuestion = z.infer<typeof RichQuestionSchema>

export const RichSubmissionSchema = z.object({
  translations: z.array(FormTranslationSchema),
  questions: z.array(RichQuestionSchema),
})

export type RichSubmission = z.infer<typeof RichSubmissionSchema>
