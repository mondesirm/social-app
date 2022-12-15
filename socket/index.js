import { Server } from 'socket.io'

const io = new Server(process.env.SOCKET_PORT, { cors: { origin: process.env.CLIENT_HOST } })
let activeUsers = []

// io.of('/chat').on
io.on('connection', socket => {
	// Add new User
	socket.on('new-user-add', newUserId => {
		// If user is not added previously
		if (!activeUsers.some(user => user.userId === newUserId)) {
			activeUsers.push({ userId: newUserId, socketId: socket.id })
			console.log('New User Connected', activeUsers)
		}

		// Send all active users to new user
		io.emit('get-users', activeUsers)
	})

	socket.on('disconnect', () => {
		// Remove user from active users
		activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
		console.log('User Disconnected', activeUsers)
		// Send all active users to all users
		io.emit('get-users', activeUsers)
	})

	// Send message to a specific user
	socket.on('send-message', data => {
		const { receiverId } = data
		const user = activeUsers.find(user => user.userId === receiverId)
		console.log('Sending from socket to:', receiverId)
		console.log('Data: ', data)

		if (user) io.to(user.socketId).emit('receive-message', data)
	})
})