import express from "express";
import validate from "../middlewares/validatezod.js";
import { loginSchema, registerSchema } from "../validators/authvalidator.js";
import { loginUser, Logoutuser, refreshToken, register } from "../controllers/authController.js";
const router = express.Router();

router.post("/register",validate(registerSchema), register); 
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", Logoutuser);

export default router;