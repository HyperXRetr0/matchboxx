import express from "express";
import {
  createUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  signin,
  updateUser,
} from "../controllers/users";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", signin);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/profile", verifyToken, getCurrentUser);
router.put("/", verifyToken, updateUser);

export default router;
