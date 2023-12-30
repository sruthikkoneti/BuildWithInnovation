import mongoose from "mongoose";

const UserSchema=new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
          },
          email: {
            type: String,
            unique: true,
            sparse: true // Allows null values or empty strings, making uniqueness validation optional
          },
          phone_number: {
            type: String,
            unique: true,
            sparse: true // Allows null values or empty strings, making uniqueness validation optional
          },
          profile_image: String,
          password: {
            type: String,
            required: true
          },
          role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
          }
    }
)

const User=mongoose.model("User",UserSchema)
export default User