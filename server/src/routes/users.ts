import express from "express";
import {
  createUser,
  deleteUserSkill,
  getAllUsers,
  getCurrentUser,
  getUserById,
  getUserSkills,
  signin,
  updateUser,
  updateUserSkills,
} from "../controllers/users";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", signin);
router.get("/", getAllUsers);
router.get("/me", verifyToken, getCurrentUser);
router.put("/skills", verifyToken, updateUserSkills);
router.get("/skills", verifyToken, getUserSkills);
router.delete("/skills", verifyToken, deleteUserSkill);
router.put("/", verifyToken, updateUser);
router.get("/:id", getUserById);

export default router;
