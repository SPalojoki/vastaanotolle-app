import type { Request, Response, NextFunction } from 'express'
import { type ZodSchema, ZodError } from 'zod'
import type { ValidatedRequest } from '../types'

export const validatePayload = <T>(schema: ZodSchema<T>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			;(req as ValidatedRequest<T>).validatedBody = schema.parse(req.body)
			next()
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				return res.status(400).json({ message: error.errors })
			}
			res.status(500).json({ message: 'Internal server error' })
		}
	}
}
