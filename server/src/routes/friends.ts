import express from "express";
import {
  deleteFriend,
  getAllFriends,
  getReceivedRequests,
  getSentRequests,
  handleRequest,
  sendFriendRequest,
} from "../controllers/friends";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.get("/", verifyToken, getAllFriends);
router.delete("/:id", verifyToken, deleteFriend);

// friend requests routes
router.post("/requests", verifyToken, sendFriendRequest);
router.get("/requests/incoming", verifyToken, getReceivedRequests);
router.get("/requests/outgoing", verifyToken, getSentRequests);
router.post("/requests/handle/:id", verifyToken, handleRequest);

export default router;
