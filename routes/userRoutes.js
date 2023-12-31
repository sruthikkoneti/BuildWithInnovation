import express from "express"
import { auth } from "../middleware/auth.js"
import { updateUpload } from "../middleware/updateUpload.js"
import { deleteAccount, getUserDetails, updateUserProfile } from "../controllers/userController.js"

const router = express.Router()

router.patch("/update",[auth,updateUpload],updateUserProfile)
router.delete("/delete",auth,deleteAccount)
router.get("/get",auth,getUserDetails)

export default router