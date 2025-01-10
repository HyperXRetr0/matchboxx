import express from "express";
import {
  deleteUserSkill,
  getAllUsers,
  getUserById,
  getUserSkills,
  updateUser,
  updateUserSkills,
} from "../controllers/users";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.get("/", getAllUsers);
router.put("/profile", verifyToken, updateUser);
router.put("/skills", verifyToken, updateUserSkills);
router.get("/skills", verifyToken, getUserSkills);
router.delete("/skills", verifyToken, deleteUserSkill);
router.get("/:id", getUserById);

export default router;
