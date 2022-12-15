import { Router } from 'express'
import * as Chat from '../controllers/ChatController.js'

const router = new Router()
	.post('/', Chat.create)
	.get('/:id', Chat.of)
	.post('/remove', Chat.remove)
	.get('/find/:self/:other', Chat.find)

export default router