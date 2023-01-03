import { Server } from 'socket.io'

const io = new Server(process.env.SOCKET_PORT, { cors: { origin: process.env.CLIENT_HOST.slice(0, -1) } })
let onlineUsers = []

// io.of('/chat').on
io.on('connection', socket => {
	// When user logs in
	socket.on('add-user', _id => {
		// Push user if not added previously
		if (!onlineUsers.some(u => u._id === _id)) onlineUsers.push({ _id, socket: socket.id })

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
		const { receiver } = data
		const user = onlineUsers.find(u => u._id === receiver._id)
		console.log('Sending data from socket to:', receiver._id, data)

		if (user) io.to(user.socket).emit('receive-message', data)
	})
})