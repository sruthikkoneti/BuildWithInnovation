import User from '../models/User.js';


export const updateUserProfile = async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = req.user.user_id;
        if (!name && !req.file) {
            return res.status(400).json({ success: false, message: 'Name or profile image is required for update.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (name) {
            user.name = name;
        }

        if (req.file) {
            const newProfileImagePath = req.filePath;
            user.profile_image = newProfileImagePath;
        }

        await user.save();

        return res.status(200).json({ success: true, message: 'User profile updated successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update user profile.' });
    }
};