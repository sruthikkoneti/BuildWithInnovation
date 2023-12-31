import User from '../models/User.js';
import fsExtra from 'fs-extra';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' });
    
        return res.status(200).json({ success: true, users });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch users by role.' });
      }
};

