import { Router } from 'express'
import * as Room from '../controllers/RoomController.js'

export default new Router()
	.get('/', Room.all)
	.get('/:id', Room.one)
	.post('/', Room.create)
	// .put('/:id', Room.update)
	.delete('/:id', Room.remove)