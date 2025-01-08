"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const friendRequests_1 = require("../controllers/friendRequests");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/", auth_1.verifyToken, friendRequests_1.sendFriendRequest);
router.get("/incoming", auth_1.verifyToken, friendRequests_1.getReceivedRequests);
router.get("/outgoing", auth_1.verifyToken, friendRequests_1.getSentRequests);
router.post("/handle-request", auth_1.verifyToken, friendRequests_1.handleRequest);
exports.default = router;
