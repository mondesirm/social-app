import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/mongo/User.js'

export const one = async (req, res) => {
	const id = req.params.id

	try {
		const user = await User.findById(id)

		if (user) {
			//! TODO remove
			/* eslint-disable no-unused-vars */
			const { password, ...rest } = user._doc

			res.status(200).json(rest)
		} else {
			res.status(404).json('No such User')
		}
	} catch (err) { res.status(500).json(err) }
}

export const friends = async (req, res) => {
	// const { id } = req.params.id

	try {
		// const user = await User.findById(id)

		let users = await User.find({ username: 'john@gmail.com' })

		// users = users.map((user) => {
		// 	const { password, ...rest } = user._doc
		// 	return rest
		// })
		res.status(200).json(users)
	} catch (err) { res.status(500).json(err) }
}

export const all = async (req, res) => {
	try {
		let users = await User.find()
		users = users.map(user => {
			const { password, ...rest } = user._doc
			return rest
		})
		res.status(200).json(users)
	} catch (err) { res.status(500).json(err) }
}

export const update = async (req, res) => {
	const id = req.params.id
	// console.log("Data Received", req.body)
	const { _id, /* currentUserAdmin, */ password } = req.body

	if (id === _id) {
		try {
			// if we also have to update password then password will be bcrypted again
			if (password) {
				const salt = await bcrypt.genSalt(10)
				req.body.password = await bcrypt.hash(password, salt)
			}
			// have to change this
			const user = await User.findByIdAndUpdate(id, req.body, { new: true })
			const token = jwt.sign(
				{ username: user.username, id: user._id },
				process.env.JWT_KEY,
				{ expiresIn: '1h' }
			)
			// console.log({user, token})
			res.status(200).json({ user, token })
		} catch (err) { res.status(500).json(err) }
	} else res.status(403).json({ message: 'You can only update your own account.' })
}

export const remove = async (req, res) => {
	const id = req.params.id

	const { currentUserId, currentUserAdmin } = req.body

	if (currentUserId == id || currentUserAdmin) {
		try {
			await User.findByIdAndDelete(id)
			res.status(200).json('User Deleted Successfully!')
		} catch (err) {
			res.status(500).json(err)
		}
	} else { res.status(403).json('Access Denied!') }
}

export const follow = async (req, res) => {
	const id = req.params.id
	const { _id } = req.body
	console.log(id, _id)
	if (_id == id) res.status(403).json('Action Forbidden')
	else {
		try {
			const user = await User.findById(_id)
			const toUser = await User.findById(id)

			if (!user.following.includes(id)) {
				await user.updateOne({ $push: { following: id } })
				await toUser.updateOne({ $push: { followers: _id } })

				const token = jwt.sign(
					{ username: user.username, id: user._id },
					process.env.JWT_KEY,
					{ expiresIn: '1h' }
				)
				res.status(200).json({ user, token })
			} else res.status(403).json('You are already following this user.')
		} catch (err) { res.status(500).json(err) }
	}
}

export const unfollow = async (req, res) => {
	const id = req.params.id
	const { _id } = req.body

	if (_id === id) res.status(403).json('Action Forbidden')
	else {
		try {
			const user = await User.findById(_id)
			const toUser = await User.findById(id)

			if (user.following.includes(id)) {
				await user.updateOne({ $pull: { following: id } })
				await toUser.updateOne({ $pull: { followers: _id } })

				const token = jwt.sign(
					{ username: user.username, id: user._id },
					process.env.JWT_KEY,
					{ expiresIn: '1h' }
				)
				res.status(200).json({ user, token })
			} else res.status(403).json('You are not following this user.')
		} catch (err) { res.status(500).json(err) }
	}
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