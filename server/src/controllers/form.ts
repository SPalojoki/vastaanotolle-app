import express from 'express'
import prisma from '../db/prismaClient'

const formRouter = express.Router()

formRouter.get('/:accessCode', async (req, res) => {
	console.log('GET /form/:accessCode')
	const form = await prisma.form.findUnique({
		where: {
			accessCode: req.params.accessCode,
		},
		select: {
			id: true,
			translations: {
				select: {
					language: true,
					title: true,
				},
			},
			questions: {
				select: {
					id: true,
					type: true,
					answerCount: true,
					translations: {
						select: {
							language: true,
							text: true,
							reportText: true,
						},
					},
					options: {
						select: {
							id: true,
							translations: {
								select: {
									language: true,
									text: true,
									reportText: true,
								},
							},
						},
					},
			}
			},
		},
	})

	if (!form) {
		return res.status(404).json({ error: 'Form not found!' })
	}

	return res.status(200).json(form)
})

export default formRouter
