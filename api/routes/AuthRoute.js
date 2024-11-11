import { Router } from 'express'
import * as Auth from '../controllers/AuthController.js'

export default new Router()
	.post('/login', Auth.login)
	.post('/register', Auth.register)
	.post('/logout', Auth.logout)
	.all('*', (req, res) => res.status(405).json({ message: 'Method not allowed.' }))