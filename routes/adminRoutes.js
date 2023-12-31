import express from "express"
import { auth } from "../middleware/auth.js"
import { isAdmin } from "../middleware/admin.js"
import { getAllUsers } from "../controllers/adminController.js"


const router = express.Router()

router.get("/users",[auth,isAdmin],getAllUsers)

export default router