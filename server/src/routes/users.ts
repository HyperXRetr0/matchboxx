import express from "express";
import {
  createUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
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
router.put("/", verifyToken, updateUser);
router.get("/:id", getUserById);

export default router;
