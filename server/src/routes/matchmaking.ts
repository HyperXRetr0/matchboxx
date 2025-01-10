import express from "express";
import { verifyToken } from "../middlewares/auth";
import { startMatchmaking } from "../controllers/matchmaking";
const router = express.Router();

router.post("/start", verifyToken, startMatchmaking);

export default router;
