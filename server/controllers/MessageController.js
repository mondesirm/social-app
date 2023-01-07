import Message from '../models/Message.js'

export const create = async (req, res) => {
	const { chat, sender, text } = req.body
	
	try {
		// const chat = await Chat.findById(chat._id)
		// const sender = await User.findById(sender._id)

		// if (!chat) return res.status(404).json({ message: 'Chat does not exist.' })
		// if (!sender) return res.status(404).json({ message: 'Logged in sender does not exist.' })

		const message = new Message({ chat, sender, text })

		await message.populate('chat')
		await message.populate('sender')
		await message.save()

		res.status(200).json(message)
	} catch (err) { res.status(500).json(err) }
}

export const of = async (req, res) => {
	try {
		const messages = await Message.find({ chat: req.params.id }).populate('chat').populate('sender', '-password')
		res.status(200).json(messages)
	} catch (err) { res.status(500).json(err) }
}