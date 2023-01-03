import { Router } from 'express'
import * as Message from '../controllers/MessageController.js'

export default new Router()
	.post('/', Message.create)
	.get('/:id', Message.of)
	// .post('/remove', Chat.remove)
	// .get('/find/:self/:other', Chat.find)