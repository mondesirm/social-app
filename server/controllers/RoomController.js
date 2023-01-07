import { Brand, Room, User } from '../models/index.js'

export const all = async (req, res) => {
	try {
		// TODO do we need to populate the members?
		const rooms = await Room.find().populate('members', '-password').populate('brand')
		res.status(200).json(rooms)
	} catch (err) { res.status(500).json(err) }
}

export const one = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id).populate('members', '-password').populate('brand')
		if (!room) return res.status(404).json({ message: 'Room not found.' })
		res.status(200).json(room)
	} catch (err) { res.status(500).json(err) }
}

export const create = async (req, res) => {
	const newRoom = new Room({ members: [req.body.self, req.body.other] })

	const self = await User.findById(req.body.self)
	const other = await User.findById(req.body.other)

	try {
		if (!self.following.includes(other._id) || !other.following.includes(self._id)) {
			return res.status(200).json({ message: 'Must be friends.' })
		}
		
		const oldRoom = await Room.findOne({ members: { $all: [req.body.self, req.body.other] } })

		if (oldRoom) return res.status(200).json({ message: 'Room already exists.' })

		const room = await newRoom.save()
		res.status(200).json(room)
	} catch (error) { res.status(500).json(error) }
}

export const remove = async (req, res) => {
	try {
		const room = await Room.findOne({ members: { $all: [req.body.self, req.body.other] } })

		if (!room) return res.status(200).json({ message: 'Room does not exist.' })

		const messages = await Message.find({ roomId: room._id })

		messages.forEach(async message => await message.delete())

		await room.remove()
		res.status(200).json({ message: 'Room removed.' })
	} catch (err) { res.status(500).json(err) }
}

export const of = async (req, res) => {
	try {
		const rooms = await Room.find({ members: { $in: [req.params.id] } }).populate('members', '-password').populate('brand')
		res.status(200).json(rooms)
	} catch (err) { res.status(500).json(err) }
}

export const find = async (req, res) => {
	try {
		const room = await Room.findOne({ members: { $all: [req.params.self, req.params.other] } })
		res.status(200).json(room)
	} catch (err) { res.status(500).json(err) }
}