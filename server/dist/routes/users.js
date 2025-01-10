"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get("/", users_1.getAllUsers);
router.put("/profile", auth_1.verifyToken, users_1.updateUser);
router.put("/skills", auth_1.verifyToken, users_1.updateUserSkills);
router.get("/skills", auth_1.verifyToken, users_1.getUserSkills);
router.delete("/skills", auth_1.verifyToken, users_1.deleteUserSkill);
router.get("/:id", users_1.getUserById);
exports.default = router;
