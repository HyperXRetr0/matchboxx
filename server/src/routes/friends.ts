import express from "express";
import { deleteFriend, getAllFriends } from "../controllers/friends";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.get("/", verifyToken, getAllFriends);
router.delete("/:id", verifyToken, deleteFriend);

export default router;
