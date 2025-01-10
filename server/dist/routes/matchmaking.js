"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const matchmaking_1 = require("../controllers/matchmaking");
const router = express_1.default.Router();
router.post("/start", auth_1.verifyToken, matchmaking_1.startMatchmaking);
exports.default = router;
