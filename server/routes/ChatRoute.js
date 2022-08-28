import express from 'express'
import { createChat, removeChat, findChat, userChats } from '../controllers/ChatController.js';
const router = express.Router()

router.post('/', createChat);
router.post('/remove', removeChat);
router.get('/:userId', userChats);
router.get('/find/:firstId/:secondId', findChat);

export default router