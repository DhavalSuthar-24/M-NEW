import express from "express"
import { verifyUser } from "../utils/verifyUser.js";
import { updateUser,deleteUser,signOut,getUsers ,getUser} from "../controllers/user.controllers.js";
const router = express.Router()


router.put('/update/:userId',verifyUser,updateUser);
router.delete('/delete/:userId',verifyUser,deleteUser);
router.post("/signout",signOut)
router.get("/getusers",verifyUser,getUsers);
router.get("/:userId",getUser)
// router.delete("deleteusers",verifyUser,)

export default router