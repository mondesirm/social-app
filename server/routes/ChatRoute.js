import { Router } from 'express'
import * as Chat from '../controllers/ChatController.js'

export default new Router()
	.post('/', Chat.create)
	.get('/:id', Chat.of)
	.post('/remove', Chat.remove)
	.get('/find/:self/:other', Chat.find)