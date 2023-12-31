import express from "express"
import { auth } from "../middleware/auth.js"
import { isAdmin } from "../middleware/admin.js"
import { createAdmin, deleteAllUsers, deleteUserById, getAllUsers } from "../controllers/adminController.js"
import { upload } from "../middleware/fileUpload.js"
import { Login } from "../controllers/authController.js"


const router = express.Router()

router.post("/become-admin",upload,createAdmin)
router.post("/login",Login)
router.get("/users",[auth,isAdmin],getAllUsers)
router.delete("/delete-user/:userID",[auth,isAdmin],deleteUserById)
router.delete("/delete-all-users",[auth,isAdmin],deleteAllUsers)


export default router