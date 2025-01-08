import express from "express";
import {
  getReceivedRequests,
  getSentRequests,
  handleRequest,
  sendFriendRequest,
} from "../controllers/friendRequests";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.post("/", verifyToken, sendFriendRequest);
router.get("/incoming", verifyToken, getReceivedRequests);
router.get("/outgoing", verifyToken, getSentRequests);
router.post("/handle-request", verifyToken, handleRequest);

export default router;
