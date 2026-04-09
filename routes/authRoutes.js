import express from "express";
import validate from "../middlewares/validatezod.js";
import { loginSchema, registerSchema, otpSchema } from "../validators/authvalidator.js";
import { loginUser, logoutAll, Logoutuser, refreshToken, register, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/register",validate(registerSchema), register); 
router.post("/verify", validate(otpSchema), verifyOtp);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", Logoutuser);
router.post("/logoutall", logoutAll);

export default router;