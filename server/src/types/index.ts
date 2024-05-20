import { z } from 'zod'
import type { Request } from 'express'

export interface ValidatedRequest<T> extends Request {
	validatedBody: T
}

// TODO: Check if the schemas should be exported
export const optionSubmissionSchema = z.object({
	text: z.string(),
	reportText: z.string(),
})

export const questionSubmissionSchema = z.object({
	text: z.string().min(1),
	type: z.enum(['MULTIPLE_CHOICE', 'RADIO', 'TEXT']),
	options: z.array(optionSubmissionSchema).optional(), // .array().min(1),
})

export const formSubmissionSchema = z.object({
	title: z.string().min(1),
	questions: z.array(questionSubmissionSchema).min(1),
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