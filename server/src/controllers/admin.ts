import express from 'express'
import prisma from '../db/prismaClient'
import { validatePayload } from '../middleware/validationMiddleware'
import {
	type formSubmission,
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
	const forms = await prisma.form.findMany({
		where: {
			isRemoved: false,
		},
		include: {
			translations: true,
		},
	})

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
			translations: true,
			questions: {
				include: {
					options: {
						include: {
							translations: true,
						},
					},
					translations: true,
				},
			},
		},
	})

	if (!form) {
		return res.status(404).json({ error: 'Form not found' })
	}

	return res.status(200).json(form)
})


const addForm = async (formSubmission: formSubmission, accessCode: string) => {
	const newForm = await prisma.form.create({
		data: {
			accessCode: accessCode,
			published: true,
			translations: {
				create: formSubmission.translations.map((translation) => ({
					language: translation.language,
					title: translation.title,
				}),
				),
			},
			questions: {
				create: formSubmission.questions.map((question) => ({
					type: question.type,
					answerCount: question.answerCount,
					translations: {
						create: question.translations.map((translation) => ({
							language: translation.language,
							text: translation.text,
							reportText: translation.reportText,
						}),
						),
					},
					options: question.type === 'MULTIPLE_CHOICE' ? {
						create: question.options?.map((option) => ({
							translations: {
								create: option.translations.map((translation) => ({
									language: translation.language,
									text: translation.text,
									reportText: translation.reportText,
								}),
								),
							},
						}),
						)} : undefined,
				}))
			},
		},
	})

	return newForm
}


adminRouter.post(
	'/form',
	validatePayload(formSubmissionSchema),
	async (req, res) => {
		// TODO: Figure out if there are better ways to type this
		const formSubmission = (req as ValidatedRequest<formSubmission>)
			.validatedBody

		const accessCode = await generateAccessCode(4)
		const newForm = await addForm(formSubmission, accessCode)

		return res.status(200).json(newForm)
	},
)

adminRouter.delete('/form/:id', async (req, res) => {
	const formId = Number.parseInt(req.params.id)
	
	try {
		if (Number.isNaN(formId)) {
			return res.status(400).json({ error: 'Invalid ID' })
		}
	
		const form = await prisma.form.findUnique({
			where: {
				id: formId,
			},
		})
	
		await prisma.$transaction([
			prisma.formTranslation.deleteMany({ where: { formId } }),
			prisma.questionTranslation.deleteMany({ where: { question: { formId } } }),
			prisma.optionTranslation.deleteMany({ where: { option: { question: { formId } } } }),
			prisma.option.deleteMany({ where: { question: { formId } } }),
			prisma.question.deleteMany({ where: { formId } }),
			prisma.form.delete({ where: { id: formId } }),
		]);
	
		return res.status(200).json(form)

	} catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'An error occurred while deleting the form' })
	}
})

adminRouter.put(
  '/form/:id',
  validatePayload(formSubmissionSchema),
  async (req, res) => {
		const formId = Number.parseInt(req.params.id)
		const formSubmission = (req as ValidatedRequest<formSubmission>).validatedBody

		if (Number.isNaN(formId)) {
			return res.status(400).json({ error: 'Invalid ID' })
		}

		try {
			const updatedForm = await prisma.form.update({
				where: {
					id: formId,
				},
				data: {
					isRemoved: true,
				}
			})
			if (!updatedForm) {
				return res.status(404).json({ error: 'Form not found' })
			}
			const newForm = await addForm(formSubmission, updatedForm.accessCode)
			res.status(200).json(newForm)
		} catch (e) {
			console.dir(e, { depth: null })
			return res.status(500).json({ error: 'Error updating form' })
		}

		}

		
);


export default adminRouter
