import dotenv from 'dotenv'
dotenv.config()

interface Config {
	port: number
	databaseUrl: string
}

const config: Config = {
	port: Number.parseInt(process.env.PORT || '3000', 10),
	databaseUrl: process.env.POSTGRES_URL || '',
}

if (!config.databaseUrl) {
	console.error(
		'Database URL is unset! Please check the environment variables.',
	)
	process.exit(1)
}

export default config
