import express from 'express'
import prisma from '../db/prismaClient'

const formRouter = express.Router()

formRouter.get('/:accessCode', async (req, res) => {
	const form = await prisma.form.findUnique({
		where: {
			accessCode: req.params.accessCode,
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
		return res.status(404).json({ error: 'Form not found!' })
	}

	return res.status(200).json(form)
})

export default formRouter
