import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import Room from '../models/Room.js'
import User from '../models/User.js'

export const all = async (req, res) => {
	try {
		const users = await User.find().select('-password')
		res.status(200).json(users)
	} catch (err) { res.status(500).json(err) }
}

export const one = async (req, res) => {
	const id = req.params.id

	try {
		const user = await User.findById(id).select('-password').populate('chats').populate('rooms').populate('following').populate('followers')
		if (!user) return res.status(404).json({ message: 'User not found.' })

		res.status(200).json(user)
	} catch (err) { res.status(500).json(err) }
}

export const friends = async (req, res) => {
	const { id } = req.params.id

	try {
		const user = await User.findById(id).select('-password').populate('chats').populate('rooms').populate('following').populate('followers')
		if (!user) return res.status(404).json({ message: 'User not found.' })

		const friends = user.following.filter(other => other.following.includes(user._id))
		res.status(200).json(friends)
	} catch (err) { res.status(500).json(err) }
}

export const update = async (req, res) => {
	const { id } = req.params
	const { _id, username, email } = req.body
	
	try {
		const self = await User.findById(id)
		var user = await User.findById(_id)
		const taken = await User.findOne({ $or: [{ username }, { email }] })

		if (!self) return res.status(404).json({ message: 'Logged in user not found.' })
		if (!user) return res.status(404).json({ message: 'User to update not found.' })
		if (id !== _id && !self.roles.includes('staff') === false) return res.status(403).json({ message: 'You can only update your own account unless you are staff.' })
		if (taken && taken.email != self.email) return res.status(403).json({ message: 'Username or email already taken.' })

		// TODO hash password if submitted
		if (req.body?.password) {
			const salt = await bcrypt.genSalt(10)
			req.body.password = await bcrypt.hash(req.body.password, salt)
		}

		// const user = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password')
		// merge user with req.body
		user = Object.assign(user, req.body)
		user.token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
		user.save()

		if (self._id === user._id) return res.status(200).json(self)
		res.status(200).json(user)
	} catch (err) { res.status(500).json(err) }
}

export const remove = async (req, res) => {
	const { id } = req.params
	const { _id, password } = req.body

	// TODO allow if current user is admin
	if (id !== _id) return res.status(403).json({ message: 'You can only delete your own account.' })

	try {
		const user = await User.findById(id)
		if (!user) return res.status(404).json({ message: 'User not found.' })

		const validPassword = await bcrypt.compare(password, user.password)
		if (!validPassword) return res.status(403).json({ message: 'Invalid password.' })

		await User.findByIdAndDelete(id)
		res.status(200).json({ message: 'User deleted successfully!' })
	} catch (err) { res.status(500).json(err) }
}

export const follow = async (req, res) => {
	const { id } = req.params
	const { _id } = req.body

	if (id === _id) return res.status(403).json({ message: 'You cannot follow yourself.' })

	try {
		const self = await User.findById(id).populate('chats').populate('rooms').populate('following').populate('followers')
		const other = await User.findById(_id)

		if (!self) return res.status(404).json({ message: 'Logged in user not found.' })
		if (!other) return res.status(404).json({ message: 'User to unfollow not found.' })
		if (other.followers.includes(id)) return res.status(403).json({ message: 'You already follow this user.' })

		self.following.push(other)
		other.followers.push(self)

		self.save()
		other.save()

		res.status(200).json(self)
	} catch (err) { res.status(500).json(err) }
}

export const unfollow = async (req, res) => {
	const { id } = req.params
	const { _id } = req.body

	if (id === _id) return res.status(403).json({ message: 'You cannot unfollow yourself.' })

	try {
		const self = await User.findById(id).populate('chats').populate('rooms').populate('following').populate('followers')
		const other = await User.findById(_id)

		if (!self) return res.status(404).json({ message: 'Logged in user not found.' })
		if (!other) return res.status(404).json({ message: 'User to unfollow not found.' })
		if (!other.followers.includes(id)) return res.status(403).json({ message: 'You do not follow this user yet.' })

		self.following = self.following.filter(f => f._id != _id)
		self.followers = self.followers.filter(f => f._id != _id)
		other.following = other.following.filter(f => f._id != id)
		other.followers = other.followers.filter(f => f._id != id)

		self.save()
		other.save()

		res.status(200).json(self)
	} catch (err) { res.status(500).json(err) }
}

export const join = async (req, res) => {
	const { id } = req.params
	const { _id } = req.body

	try {
		const user = await User.findById(id).populate('chats').populate('rooms').populate('following').populate('followers')
		const room = await Room.findById(_id)

		if (!user) return res.status(404).json({ message: 'User not found.' })
		if (!room) return res.status(404).json({ message: 'Room not found.' })
		if (room.members.includes(id)) return res.status(403).json({ message: 'You are already a member of this room.' })

		await user.updateOne({ $push: { rooms: room } })
		await room.updateOne({ $push: { members: user } })

		res.status(200).json(user)
	} catch (err) { res.status(500).json(err) }
}

export const leave = async (req, res) => {
	const { id } = req.params
	const { _id } = req.body

	try {
		const user = await User.findById(id).populate('chats').populate('rooms').populate('following').populate('followers')
		const room = await Room.findById(_id)

		if (!user) return res.status(404).json({ message: 'User not found.' })
		if (!room) return res.status(404).json({ message: 'Room not found.' })
		if (!room.members.includes(id)) return res.status(403).json({ message: 'You are not a member of this room.' })

		user.rooms = user.rooms.filter(room => room._id != _id)
		room.members = room.members.filter(member => member._id != id)

		user.save()
		room.save()

		res.status(200).json(user)
	} catch (err) { res.status(500).json(err) }
}

export const send = async (req, res) => {
	const id = req.params.id
	const { _id } = req.body
	console.log(id, _id)
	if (_id == id) res.status(403).json('Action Forbidden')
	else {
		try {
			const fromUser = await User.findById(id)
			const toUser = await User.findById(_id)

			if (!fromUser.followers.includes(_id)) {
				await fromUser.updateOne({ $push: { following: id } })
				await toUser.updateOne({ $push: { followers: _id } })
				res.status(200).json({ fromUser })
			} else res.status(403).json('You are already friends with this user.')
		} catch (err) { res.status(500).json(err) }
	}
}

export const getFriendRequest = async (req, res) => {
	const { id } = req.params.id

	try {
		const user = await User.findById(id)
		res.status(200).json(user)
	} catch (err) { res.status(500).json(err) }
}

export const cancel = async (req, res) => {
	const id = req.params.id
	const { _id } = req.body

	if (_id === id) res.status(403).json('Action Forbidden')
	else {
		try {
			const user = await User.findById(id)
			const toUser = await User.findById(_id)

			if (user.followers.includes(_id)) {
				await user.updateOne({ $pull: { following: id } })
				await toUser.updateOne({ $pull: { followers: _id } })
				res.status(200).json({ user })
			} else res.status(403).json('You are not following this user.')
		} catch (err) { res.status(500).json(err) }
	}
}

export const deniedFriendRequest = async (req, res) => {
	const id = req.params.id
	const { _id } = req.body

	if (_id === id) res.status(403).json('Action Forbidden')
	else {
		try {
			const user = await User.findById(id)
			const toUser = await User.findById(_id)

			if (user.followers.includes(_id)) {
				await user.updateOne({ $pull: { followers: _id } })
				await toUser.updateOne({ $pull: { following: id } })
				res.status(200).json({ user })
			} else res.status(403).json('You are not following this user.')
		} catch (err) { res.status(500).json(err) }
	}
}