import express from 'express'
import prisma from '../db/prismaClient'

const adminRouter = express.Router()

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

export default adminRouter
