import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import TokenExpiredError from 'jsonwebtoken'
import { logout } from '../controllers/AuthController.js'

dotenv.config()

const secret = process.env.JWT_SECRET

export default async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]

		if (token) {
			const decoded = jwt.verify(token, secret)
			req.body.id = decoded?.id
		}

		next()
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			logout(req, res, next, err)
			// res.status(401).json({ message: 'Unauthorized.' })
		}
	}
}