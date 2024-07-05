import express from 'express';
import { getUser, updateUserAvatar } from '../controllers/userController';
import upload from '../middleware/upload';

const router = express.Router();

router.get('/:id', getUser);
router.post('/:id/avatar', upload.single('avatar'), updateUserAvatar);

export default router;
