"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/signup", users_1.createUser);
router.post("/signin", users_1.signin);
router.get("/", users_1.getAllUsers);
router.get("/profile", auth_1.verifyToken, users_1.getCurrentUser);
router.put("/skills", auth_1.verifyToken, users_1.updateUserSkills);
router.put("/", auth_1.verifyToken, users_1.updateUser);
router.get("/:id", users_1.getUserById);
exports.default = router;
