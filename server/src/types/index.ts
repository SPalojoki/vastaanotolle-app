import { z } from 'zod'
import type { Request } from 'express'

export interface ValidatedRequest<T> extends Request {
	validatedBody: T
}

const languageEnum = z.enum(['FI', 'SE', ])

export const optionSubmissionSchema = z.object({
	translations: z.array(z.object({
		language: languageEnum,
		text: z.string(),
		reportText: z.string(),
	})),
})

export const questionSubmissionSchema = z.object({
	type: z.enum(['MULTIPLE_CHOICE', 'TEXT']),
	answerCount: z.number().optional(), // Only required for MULTIPLE_CHOICE
	options: z.array(optionSubmissionSchema).optional(), // Only required for MULTIPLE_CHOICE
	translations: z.array(z.object({
		language: languageEnum,
		text: z.string(),
		reportText: z.string(),
	})),
})

export const formSubmissionSchema = z.object({
	questions: z.array(questionSubmissionSchema).min(1),
	translations: z.array(z.object({
		language: languageEnum,
		title: z.string(),
	})),
	})

export type FormSubmission = z.infer<typeof formSubmissionSchema>


const compressedAnswerSchema = z.union([z.array(z.number()), z.string()]);

const compressedQuestionSchema = z.object({
  qId: z.number(),
  a: compressedAnswerSchema,
});

export const compressedFormSubmissionSchema = z.object({
  fId: z.number(),
  qs: z.array(compressedQuestionSchema),
});

export type CompressedFormSubmission = z.infer<typeof compressedFormSubmissionSchema>