import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
// import User from '../models/User.js'
import mongoose, { User } from '../models/index.js'

dotenv.config()

export const login = async (req, res) => {
	const { identifier, password } = req.body

	try {
		const user = await User.findOne({ username: identifier }).populate('rooms').populate('following').populate('followers')

		if (!user) return res.status(404).json({ message: `User ${identifier} not found.` })

		const validity = await bcrypt.compare(password, user.password)

		if (!validity) return res.status(400).json({ message: 'Wrong password.' })

		user.isOnline = true
		user.lastSeen = Date.now()
		user.token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
		await user.save()
		res.status(200).json(user)
	} catch (err) { res.status(500).json(err) }
}

export const register = async (req, res) => {
	const salt = await bcrypt.genSalt(10)
	const { username, password } = req.body
	req.body.password = await bcrypt.hash(password, salt)

	try {
		const user = await User.findOne({ username })

		if (oldUser) return res.status(400).json({ message: `User ${username} already exists.` })

		user = new User(req.body)
		user.isOnline = true
		user.lastSeen = Date.now()
		user.token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
		await user.save()
		res.status(200).json(user)
	} catch (err) { res.status(500).json(err) }
}

const format = date => {
	date = new Date(Date.now() - new Date(date).getTime())
	if (date.getTime() < 60000) return `${date.getMinutes()} min ago`
	if (date.getTime() < 3600000) return `${date.getHours()}h ago`
	return date.getDate() - 1 < 1 ? 'yesterday' : `${date.getDate() - 1}d+ ago`
}

export const logout = async (req, res, next, err = null) => {
	const id = req.body._id

	// TODO session expires: logout user or create new token
	if (err) return res.status(401).json({ message: `Session expired ${format(err.expiredAt)}.` })

	// redirect to current route with query params
	let currentRoute = req.originalUrl
	if (err) return res.redirect(`${currentRoute}?logout=${err.expiredAt}.`)

	try {
		const user = await User.findById(id)

		if (!user) return res.status(400).json({ message: 'Logged in user not found.' })

		user.isOnline = false
		user.lastSeen = Date.now() // expiredAt
		user.token = ''
		await user.save()
		res.status(200).json({ message: 'User logged out.' })
	} catch (err) { res.status(500).json(err) }
}