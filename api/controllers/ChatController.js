import { Chat, Message, User, Appointment } from '../models/index.js'

export const bot = async (req, res) => {
	const { _id, data, date } = req.body

	try {
		const customer = await User.findById(_id).populate('chats').populate('rooms').populate('following').populate('followers')
		if (!customer) return res.status(404).json({ message: 'User not found.' })

		const appointment = new Appointment({ customer, data, date })

		await appointment.populate('customer', '-password')
		await appointment.save()

		res.status(200).json(appointment)
	} catch (err) { res.status(500).json(err) }
}

export const create = async (req, res) => {
	try {
		const self = await User.findById(req.body.self).populate('chats').populate('rooms').populate('following').populate('followers')
		const other = await User.findById(req.body.other)

		if (!self || !other) return res.status(404).json({ message: 'User not found.' })
		if (!other.following.includes(self._id) && !other.followers.includes(self._id)) return res.status(403).json({ message: 'You are not mutuals with this user.' })

		// const chat = await Chat.findOne({ members: { $all: [self, other] } })
		const chat = self.chats.find(c => c.members.includes(other._id))
		if (chat) return res.status(200).json(self)

		const newChat = new Chat({ members: [self._id, other._id] })
		self.chats.push(newChat)
		other.chats.push(newChat)

		await newChat.populate('members', '-password')
		await newChat.populate('messages')

		await newChat.save()
		await self.save()
		await other.save()

		res.status(200).json(self.chats)
	} catch (err) { res.status(500).json(err) }
}

export const one = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.id).populate('members', '-password')
		if (!chat) return res.status(404).json({ message: 'Chat not found.' })
		res.status(200).json(chat)
	} catch (err) { res.status(500).json(err) }
}

export const of = async (req, res) => {
	try {
		const chats = await Chat.find({ members: { $in: [req.params.id] } }).populate('members', '-password')
		res.status(200).json(chats)
	} catch (err) { res.status(500).json(err) }
}

export const remove = async (req, res) => {
	try {
		const chat = await Chat.findOne({ members: { $all: [req.body.self, req.body.other] } })

		if (!chat) return res.status(200).json({ message: 'Chat does not exist.' })

		const messages = await Message.find({ chat })

		messages.forEach(async message => await message.delete())

		await chat.remove()
		res.status(200).json({ message: 'Chat removed.' })
	} catch (err) { res.status(500).json(err) }
}

export const find = async (req, res) => {
	try {
		const chat = await Chat.findOne({ members: { $all: [req.params.self, req.params.other] } }).populate('members', '-password')
		res.status(200).json(chat)
	} catch (err) { res.status(500).json(err) }
}