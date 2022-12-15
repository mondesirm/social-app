import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import User from '../models/mongo/User.js'
import mongoose, { User } from '../models/mongo/index.js'

export const register = async (req, res) => {
	const salt = await bcrypt.genSalt(10)
	const { username, password } = req.body
	req.body.password = await bcrypt.hash(password, salt)
	const newUser = new User(req.body)

	try {
		const oldUser = await User.findOne({ username })

		if (oldUser) return res.status(400).json({ message: `User ${username} already exists.` })

		newUser.isOnline = true
		const user = await newUser.save()
		const token = jwt.sign(
			{ username: user.username, id: user._id },
			process.env.JWT_KEY,
			{ expiresIn: '1h' }
		)
		res.status(200).json({ user, token })
	} catch (err) { res.status(500).json(err) }
}

export const login = async (req, res) => {
	const { identifier, password } = req.body
	// console.log('Credentials:', identifier, password)
	// console.log('Before Try:', mongoose.connection.readyState ? 'True' : 'False')

	try {
		// console.log('After Try:', mongoose.connection.readyState ? 'True' : 'False')
		const user = await User.findOne({ username: identifier }).populate('rooms').populate('followers').populate('following')

		if (user) {
			const validity = await bcrypt.compare(password, user.password)

			if (!validity) res.status(400).json({ message: 'Wrong password.' })
			else {
				const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_KEY, { expiresIn: '1h' })
				// res.status(200).json({ user, token })
				user.isOnline = true
				user.token = token
				res.status(200).json(user)
			}
		} else res.status(404).json({ message: `User ${identifier} not found.` })
	} catch (err) {
		// console.log(err.message)
		res.status(500).json(err)
	}
}

export const logout = async (req, res) => {
	const id = req.body._id

	try {
		const user = await User.findById(id)

		if (!user) return res.status(400).json({ message: `Logged user not found.` })

		user.isOnline = false
		await user.save()
		res.status(200).json({ message: 'User logged out.' })
	} catch (err) { res.status(500).json(err) }
}