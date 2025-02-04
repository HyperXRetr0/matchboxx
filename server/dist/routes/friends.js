"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const friends_1 = require("../controllers/friends");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get("/", auth_1.verifyToken, friends_1.getAllFriends);
router.delete("/:id", auth_1.verifyToken, friends_1.deleteFriend);
// friend requests routes
router.post("/requests", auth_1.verifyToken, friends_1.sendFriendRequest);
router.get("/requests/incoming", auth_1.verifyToken, friends_1.getReceivedRequests);
router.get("/requests/outgoing", auth_1.verifyToken, friends_1.getSentRequests);
router.post("/requests/handle/:id", auth_1.verifyToken, friends_1.handleRequest);
exports.default = router;
