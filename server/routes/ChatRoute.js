import { Router } from 'express'
import * as Chat from '../controllers/ChatController.js'

export default new Router()
	.post('/bot', Chat.bot)
	.post('/', Chat.create)
	// .get('/:id', Chat.one)
	.get('/of/:id', Chat.of)
	.delete('/:id', Chat.remove)
	.get('/find/:self/:other', Chat.find)
	.all('*', (req, res) => res.status(405).json({ message: 'Method not allowed.' }))