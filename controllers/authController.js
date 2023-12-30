import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const Register = async (req, res, next) => {
    try {
        const { name, email, phone_number, password, role } = req.body;
        const profile_image = req.filePath ? req.filePath : null;
        
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
        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (ex) {
        next(ex);
    }
}

export const Login=async(req,res)=>{
    const { emailOrPhone, password } = req.body;

    try {
      let user;
      if (!emailOrPhone || !password) {
        return res.status(400).json({ success: false, message: 'Email or phone number and password are required.' });
      }
  
      if (emailOrPhone.includes('@')) {
        user = await User.findOne({ email: emailOrPhone });
      } else {
        user = await User.findOne({ phone_number: emailOrPhone });
      }
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid password.' });
      }
  
      const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {expiresIn: 60*60});

      return res.status(200).json({ token, user_id: user._id });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to login.' });
    }
}

