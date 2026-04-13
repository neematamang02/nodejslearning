import express from "express";
import validate from "../middlewares/validatezod.js";
import { loginSchema, registerSchema, otpSchema } from "../validators/authvalidator.js";
import { loginUser, logoutAll, Logoutuser, refreshToken, register, verifyOtp } from "../controllers/authController.js";
import { googleCallback } from "../controllers/googleAuthController.js";
import passport from "passport";

const router = express.Router();

router.post("/register",validate(registerSchema), register); 
router.post("/verify", validate(otpSchema), verifyOtp);
router.post("/login", validate(loginSchema), loginUser);

// Google login start (preferred path)
router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback (preferred path)
router.get("/auth/google/callback",
    passport.authenticate("google", { session: false }),
    googleCallback
);

// Backward-compatible aliases
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
    passport.authenticate("google", { session: false }),
    googleCallback
);
router.post("/refresh", refreshToken);
router.post("/logout", Logoutuser);
router.post("/logoutall", logoutAll);

export default router;