import express from 'express'
import cors from 'cors'

import config from './utils/config'

import formRouter from './controllers/form'
import adminRouter from './controllers/admin'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/form', formRouter)
app.use('/admin', adminRouter)

app.listen(config.port, () => {
	console.log(`Backend running on port ${config.port}`)
})
