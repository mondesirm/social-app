import { Router } from 'express'
import * as Auth from '../controllers/AuthController.js'

export default new Router()
	.post('/login', Auth.login)
	.post('/register', Auth.register)
	.post('/logout', Auth.logout)