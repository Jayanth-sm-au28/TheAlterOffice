import { Request, Response } from 'express';
import User from '../models/user';

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if req.file is defined
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ message: 'Avatar updated successfully', avatarUrl: user.avatarUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
