import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfileDetails
} from "../controllers/user.controllers.js";
// import { imageGenerator } from "../controllers/dalle.controllers.js"; 
import { authenticateUser } from "../middleware/auth.middleware.js";



const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authenticateUser,logoutUser);

// router.route("/generateimage").post(imageController);


// Update your route to accept userId as a parameter
router.get('/profile/:userId?', authenticateUser, getProfileDetails);
export default router;





