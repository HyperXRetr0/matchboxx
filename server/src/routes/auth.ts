import express from "express";
import { createUser, getCurrentUser, signin } from "../controllers/auth";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", signin);
router.get("/me", verifyToken, getCurrentUser);

export default router;
