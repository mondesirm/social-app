import dotenv from 'dotenv'
import mongoose from 'mongoose'

import Chat from './Chat.js'
import Room from './Room.js'
import User from './User.js'
import Brand from './Brand.js'
import Message from './Message.js'
import Appointment from './Appointment.js'

dotenv.config()

mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	console.log(`Connected to MongoDB database: ${process.env.DB_NAME}.`)
})

export default mongoose

export { Chat, Room, User, Brand, Message, Appointment }