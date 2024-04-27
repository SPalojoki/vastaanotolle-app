import express from 'express'
import prisma from '../db/prismaClient'
import { validatePayload } from '../middleware/validationMiddleware'
import {
	type FormSubmission,
	formSubmissionSchema,
	type ValidatedRequest,
} from '../types'

const adminRouter = express.Router()

// TODO Move this somewhere else? Consider rewriting altogether
const generateAccessCode = async (length: number): Promise<string> => {
	const forms = await prisma.form.findMany({
		select: { accessCode: true },
	})
	const generatedCodes = forms.map((form) => form.accessCode)

	let newCode = ''
	do {
		newCode = ''
		for (let i = 0; i < length; i++) {
			newCode += Math.floor(Math.random() * 10)
		}
	} while (generatedCodes.includes(newCode))

	return newCode
}

adminRouter.get('/forms', async (_req, res) => {
	const forms = await prisma.form.findMany()

	return res.status(200).json(forms)
})

adminRouter.get('/form/:id', async (req, res) => {
	const id = Number.parseInt(req.params.id)

	// TODO: Consider using a middleware to validate the ID
	if (Number.isNaN(id)) {
		return res.status(400).json({ error: 'Invalid ID' })
	}

	const form = await prisma.form.findUnique({
		where: {
			id,
		},
		include: {
			questions: {
				include: {
					options: true,
				},
			},
		},
	})

	if (!form) {
		return res.status(404).json({ error: 'Form not found' })
	}

	return res.status(200).json(form)
})

adminRouter.post(
	'/form',
	validatePayload(formSubmissionSchema),
	async (req, res) => {
		// TODO: Figure out if there are better ways to type this
		const formSubmission = (req as ValidatedRequest<FormSubmission>)
			.validatedBody

		const accessCode = await generateAccessCode(4)

		const newForm = await prisma.form.create({
			data: {
				title: formSubmission.title,
				accessCode: accessCode,
				questions: {
					create: formSubmission.questions.map((question) => ({
						text: question.text,
						type: question.type,
						options: {
							create:
								question.options && question.type !== 'TEXT'
									? question.options.map((option) => ({
											text: option.text,
										}))
									: [],
						},
					})),
				},
			},
		})

		return res.status(200).json(newForm)
	},
)

export default adminRouter
