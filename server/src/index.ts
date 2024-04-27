import express from 'express'
import cors from 'cors'

import config from './utils/config'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
	res.send('Hello World!')
})

app.listen(config.port, () => {
	console.log(`Server running on http://localhost:${config.port}`)
})
