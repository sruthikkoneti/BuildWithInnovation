import User from '../models/User.js';
import fsExtra from 'fs-extra';
import bcrypt from 'bcrypt';
import * as fs from "fs";
import path from "path";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' });

    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users by role.' });
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, phone_number, password } = req.body;
    const profile_image = req.tempFilePath ? req.tempFilePath : null;

    if (!name || !password) {
      return res.status(400).json({ message: 'Name, password, and role are required.' });
    }
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      name,
      email,
      phone_number,
      profile_image,
      password: hashedPassword,
      role: "admin"
    });

    await newUser.save();
    // Create a directory with user ID after registration
    const userDirectory = `file_uploads/${newUser._id}`;
    fs.mkdirSync(userDirectory, { recursive: true });

    // Move the profile image from temporary folder to the user's folder

    if (profile_image) {
      const newProfileImagePath = path.join(userDirectory, path.basename(profile_image));
      fs.renameSync(profile_image, newProfileImagePath);
      const updatedProfileImagePath = newProfileImagePath.split('\\').join('/')
      newUser.profile_image = updatedProfileImagePath
      await newUser.save();
    }

    if (fs.existsSync('temp_uploads')) {
      fsExtra.remove('temp_uploads');
    }

    return res.status(201).json({ message: 'User registered successfully.' });
    // return res.status(201).json(newUser);
  } catch (ex) {
    next(ex);
  }
}


export const deleteUserById = async (req, res) => {
  try {
    const userIdToDelete = req.params.userID;
    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(userIdToDelete);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const userDirectory = `file_uploads/${userIdToDelete}`;
    await fsExtra.remove(userDirectory);

    return res.status(200).json({ success: true, message: 'User deleted successfully.', deletedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    const usersToDelete = await User.find({ role: 'user' });

    // Delete users and their folders
    for (const user of usersToDelete) {
      const userId = user._id;
      const userFolderPath = `file_uploads/${userId}`;
      await fsExtra.remove(userFolderPath);

      await user.deleteOne();
    }

    return res.status(200).json({ success: true, message: 'Users with role "user" and their folders deleted successfully.', deletedCount: usersToDelete.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete users.' });
  }
};


export const modifyUserDetails = async (req, res) => {
  try {
    const { userID } = req.params; // Assuming userId is sent as a route parameter
    const { name, email, phone_number, password } = req.body;
    // Find the user by ID
    const userToUpdate = await User.findById(userID);

    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Modify user details if provided
    if (name) {
      userToUpdate.name = name;
    }
    if (email) {
      userToUpdate.email = email;
    }
    if (phone_number) {
      userToUpdate.phone_number = phone_number;
    }
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      userToUpdate.password = hashedPassword;
    }
    if (req.file) {
      if (userToUpdate.profile_image) {
        await fsExtra.remove(userToUpdate.profile_image);
      }
      const newProfileImagePath = req.filePath;
      userToUpdate.profile_image = newProfileImagePath;
    }

    // Save the updated user details
    await userToUpdate.save();

    return res.status(200).json({ success: true, message: 'User details updated successfully.', updatedUser: userToUpdate });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user details.' });
  }
};