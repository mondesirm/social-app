import { Router } from 'express'
import * as Auth from '../controllers/AuthController.js'

const router = new Router()
	.post('/login', Auth.login)
	.post('/register', Auth.register)
	.post('/logout', Auth.logout)

export default router