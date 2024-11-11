import { Router } from 'express'
import auth from '../middleware/AuthMiddleware.js'
import * as User from '../controllers/UserController.js'

export default new Router()
	.get('/', User.all)
	.get('/:id', User.one)
	.put('/:id', auth, User.update)
	.delete('/:id', auth, User.remove)
	.get('/:id/friends', User.friends)
	.put('/:id/follow', auth, User.follow)
	.put('/:id/unfollow', auth, User.unfollow)
	.put('/:id/send', auth, User.send)
	.put('/:id/join', auth, User.join)
	.put('/:id/leave', auth, User.leave)
	.put('/:id/cancel', auth, User.cancel)
	.all('*', (req, res) => res.status(405).json({ message: 'Method not allowed.' }))