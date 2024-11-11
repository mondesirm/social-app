import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import AuthRoute from './routes/AuthRoute.js'
import ChatRoute from './routes/ChatRoute.js'
import RoomRoute from './routes/RoomRoute.js'
import UserRoute from './routes/UserRoute.js'
import UploadRoute from './routes/UploadRoute.js'
import MessageRoute from './routes/MessageRoute.js'

const app = express()

// Middlewares
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

// Serve images inside public folder
app.use(express.static('public'))
app.use('/images', express.static('images'))
app.use('/scripts', express.static('scripts'))

dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => app.listen(process.env.SERVER_PORT, () => console.log(`Listening on port ${process.env.SERVER_PORT}.`)))
	.catch((err) => console.log(`${err}\nFailed to connect to MongoDB.`))

// Assign routes
app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/room', RoomRoute)
app.use('/message', MessageRoute)

module.exports = app;