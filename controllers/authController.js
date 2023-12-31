import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as fs from "fs";
import path from "path";
import fsExtra from 'fs-extra';

export const Register = async (req, res, next) => {
  try {
    const { name, email, phone_number, password, role } = req.body;
    const profile_image = req.tempFilePath ? req.tempFilePath : null;

    if (!name || !password || !role) {
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
      role
    });

    await newUser.save();
    // Create a directory with user ID after registration
    const userDirectory = `file_uploads/${newUser._id}`;
    fs.mkdirSync(userDirectory, { recursive: true });

    // Move the profile image from temporary folder to the user's folder

    if (profile_image) {
      const newProfileImagePath = path.join(userDirectory, path.basename(profile_image));
      fs.renameSync(profile_image, newProfileImagePath);
      const updatedProfileImagePath=newProfileImagePath.split('\\').join('/')
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

export const Login = async (req, res) => {
  try {
    const { email, password, phone_number } = req.body;

    let user;

    if (email) {
      user = await User.findOne({ email: email });
    } else {
      user = await User.findOne({ phone_number: phone_number });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }
    
    const token = jwt.sign({ user_id: user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

    return res.status(200).json({ token, user_id: user._id});
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to login.' });
  }
}

