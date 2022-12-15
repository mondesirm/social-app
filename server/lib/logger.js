const winston = require('winston')

require('winston-mongodb')

const { mongoose } = require('../models/mongo')

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
		new winston.transports.MongoDB({
			db: mongoose.connection,
			collection: 'logs'
		}),
	],
})

// Not production: write logs like `${level}: ${message} JSON.stringify({ ...rest })`
if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.simple()
	}))
}

module.exports = logger