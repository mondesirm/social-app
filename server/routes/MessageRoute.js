import { Router } from 'express'
import * as Message from '../controllers/MessageController.js'

const router = new Router()
	.post('/', Message.create)
	.get('/:id', Message.of)

export default router