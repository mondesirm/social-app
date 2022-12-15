import dotenv from 'dotenv'
import mongoose from 'mongoose'

import Chat from './Chat.js'
import User from './User.js'
import Room from './Room.js'
import Message from './Message.js'

dotenv.config()

mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	console.log(`Connected to MongoDB database: ${process.env.DB_NAME}.`)
})

export default mongoose

export { Chat, User, Room, Message }