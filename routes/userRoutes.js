import express from "express"
import { auth } from "../middleware/auth.js"
import { updateUpload } from "../middleware/updateUpload.js"
import { deleteAccount, updateUserProfile } from "../controllers/userController.js"

const router = express.Router()

router.patch("/update",[auth,updateUpload],updateUserProfile)
router.delete("/delete",auth,deleteAccount)

export default router