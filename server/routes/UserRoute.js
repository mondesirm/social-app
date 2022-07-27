import express from 'express'
import { deleteUser, sendFriendRequest, getAllUsers, getUser, updateUser, getUserFriends } from '../controllers/UserController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js';

const router = express.Router()

router.get('/:id', getUser);
router.get('/:id/friends', getUserFriends);
router.get('/',getAllUsers)
router.put('/:id',authMiddleWare, updateUser)
router.delete('/:id',authMiddleWare, deleteUser)
router.put('/:id/follow',authMiddleWare, sendFriendRequest)
router.put('/:id/unfollow',authMiddleWare, sendFriendRequest)

export default router