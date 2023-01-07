import { Router } from 'express'
import * as Chat from '../controllers/ChatController.js'

export default new Router()
	.post('/', Chat.create)
	// .get('/:id', Chat.one)
	.get('/of/:id', Chat.of)
	.delete('/:id', Chat.remove)
	.get('/find/:self/:other', Chat.find)