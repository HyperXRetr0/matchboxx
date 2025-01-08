"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/signup", user_1.createUser);
router.post("/signin", user_1.signin);
router.get("/", user_1.getAllUsers);
router.get("/:id", user_1.getUserById);
router.put("/", auth_1.verifyToken, user_1.updateUser);
exports.default = router;
