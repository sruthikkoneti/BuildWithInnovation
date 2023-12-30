import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const Register = async (req, res, next) => {
    try {
        const { name, email, phone_number, profile_image, password, role } = req.body;
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
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (ex) {
        next(ex);
    }
}

