import { Chat, Message, User } from '../models/index.js'

export const create = async (req, res) => {
	try {
		const self = await User.findById(req.body.self).populate('chats').populate('rooms').populate('following').populate('followers')
		const other = await User.findById(req.body.other)

		if (!self || !other) return res.status(404).json({ message: 'User not found.' })

		if (!other.following.includes(self._id) && !other.followers.includes(self._id))
			return res.status(403).json({ message: 'You are not mutuals with this user.' })

		// const chat = await Chat.findOne({ members: { $all: [self, other] } })
		const chat = self.chats.find(c => c.members.includes(other._id))

		if (chat) return res.status(200).json(self)

		const newChat = new Chat({ members: [self, other] })
		self.chats.push(newChat)
		other.chats.push(newChat)

		await newChat.populate('members', '-password -token -__v')
		await newChat.populate('messages')

		await newChat.save()
		await self.save()
		await other.save()

		res.status(200).json(newChat)
	} catch (err) {
		console.log(err)
		res.status(500).json(err)
	}
}

export const of = async (req, res) => {
	try {
		const chats = await Chat.find({ members: { $in: [req.params.id] } }).populate('members', '-password -token -__v')
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