import express from "express";
import { deletedata, deleteMyAccount, getMyProfile, getUser, getUserbyid, secretData, testing, updatedata, updateMyProfile } from "../controllers/userController.js";
import protect, { authorize } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Public/General routes
router.get("/", getUser);
router.get("/secret", secretData);

// User routes (authenticated users managing their own data)
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.delete("/me", protect, deleteMyAccount);

// Admin routes (admin managing any user)
router.get("/admin", protect, authorize("admin"), testing);
router.get("/:id", protect, authorize("admin"), getUserbyid);
router.put("/:id", protect, authorize("admin"), updatedata);
router.delete("/:id", protect, authorize("admin"), deletedata);

export default router;
