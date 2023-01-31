import dotenv from 'dotenv'
import { Server } from 'socket.io'

dotenv.config()

// Create socket server accepting requests ONLY from the client host
const io = new Server(process.env.SOCKET_PORT, { cors: { origin: process.env.CLIENT_HOST.slice(0, -1) } })
// Bot information
const bot = { _id: 'bot', firstName: 'Moto', lastName: 'Bot', username: 'MotoBot' }
// Users currently online
let onlineUsers = []

// io.of('/chat').on
io.on('connection', socket => {
	// When user logs in
	socket.on('add-user', _id => {
		// onlineUsers = []
		// Push user if not added previously
		if (!onlineUsers.find(u => u._id === _id)) onlineUsers.push({ _id, socket: socket.id })

		// Send all online users
		io.emit('get-users', onlineUsers)
	})

	// When page is refreshed
	socket.on('disconnect', () => {
		// Remove user from online users
		onlineUsers = onlineUsers.filter(u => u.socket !== socket.id)

		// Send all online users
		io.emit('get-users', onlineUsers)
	})

	// When user logs out
	socket.on('logout', () => {
		// Remove user from online users
		onlineUsers = onlineUsers.filter(u => u.socket !== socket.id)

		// Send all online users
		io.emit('get-users', onlineUsers)
	})

	// Send message to a specific user
	socket.on('send-message', data => {
		const { receivers } = data
		// const users = receivers.map(r => onlineUsers.find(u => u._id === r._id))
		// console.log('Sending data from socket to:', receivers.map(r => r._id), data)

		// Send message to all receivers (a chat member or several room members)
		for (const receiver of receivers) {
			const user = onlineUsers.find(u => u._id === receiver._id)
			console.log('Sending data from socket to:', receiver._id, data)

			if (user) io.to(user.socket).emit('receive-message', data)
		}
	})

	// Separate start event (unused)
	socket.on('start-bot', data => {
		console.log('start-bot', 'hello')
		const user = onlineUsers.find(u => u._id === data._id)
		const message = { sender: { ...bot, step: 'hello' }, text: `Hello ${data?.firstName}, I am @MotoBot. How can I help you?` }

		const actions = [
			{ label: 'Say hello', step: 'hello' },
			{ label: 'End Conversation', step: 'stop'}
		]

		if (user) io.to(user.socket).emit('receive-from-bot', { message, actions })
	})

	// When user sends a message to the bot
	socket.on('send-to-bot', data => {
		const { sender, text } = data
		console.log('send-to-bot', text)
		const user = onlineUsers.find(u => u._id === sender._id)
		var actions = [] // Available actions for the user
		var message = null // Message to be sent to the user

		switch (text) {
			case 'start':
				actions = [
					{ label: 'Say hello', step: 'hello' },
					{ label: 'End Conversation', step: 'stop'}
				]

				message = { sender: { ...bot, step: 'hello' }, text: `Hello ${sender?.firstName}, I am MotoBot. How can I help you?` }
				break;
			
			case 'hello':
				actions = [
					{ label: 'Say hello', step: 'hello' },
					{ label: 'End Conversation', step: 'stop' }
				]

				message = { sender: { ...bot, step: 'hello' }, text: 'Hello.' }
				break;

			case 'stop':
				actions = [{ label: 'Start Over', step: 'start' }]
				message = { sender: { ...bot, step: 'stop' }, text: 'Thank you for using MotoBot. Have a nice day!' }
				break;

			default:
				actions = [
					{ label: 'Say hello', step: 'hello' },
					{ label: 'End Conversation', step: 'stop' }
				]

				message = { sender: { ...bot, step: 'invalid' }, text: 'Sorry, I did not understand.' }
				break;
		}

		console.log(text, message.text)
		// Send data back to the user
		if (user) io.to(user.socket).emit('receive-from-bot', { actions, message })
	})
})