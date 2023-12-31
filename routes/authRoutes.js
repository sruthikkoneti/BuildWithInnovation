import express from "express"
import { Login, Register } from "../controllers/authController.js"
import { upload } from "../middleware/fileUpload.js"


const router = express.Router()

router.post("/register",upload,Register)
router.post("/login",Login)



export default router