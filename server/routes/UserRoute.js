import express from 'express'
import { deleteUser, sendFriendRequest, cancelFriendRequest, followUser, unfollowUser, getAllUsers, getUser, updateUser, getUserFriends } from '../controllers/UserController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js';

const router = express.Router()

router.get('/:id', getUser);
router.get('/:id/friends', getUserFriends);
router.get('/',getAllUsers)
router.put('/:id',authMiddleWare, updateUser)
router.delete('/:id',authMiddleWare, deleteUser)
router.put('/:id/follow',authMiddleWare, followUser)
router.put('/:id/unfollow',authMiddleWare, unfollowUser)

export default router