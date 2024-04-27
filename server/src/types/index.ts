import { z } from 'zod'
import type { Request } from 'express'

export interface ValidatedRequest<T> extends Request {
	validatedBody: T
}

export const optionSubmissionSchema = z.object({
	text: z.string().min(1),
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
