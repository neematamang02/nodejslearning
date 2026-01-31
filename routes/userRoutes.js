import express from "express";
import { getUser, register, secretData } from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", getUser);
router.post("/register", register);
router.get("/secret", auth, secretData);

export default router;
