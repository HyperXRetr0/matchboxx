"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const skills_1 = require("../controllers/skills");
const router = express_1.default.Router();
router.post("/add-skill", skills_1.addSkill);
router.get("/", skills_1.getAllSkills);
router.get("/search", skills_1.searchSkill);
exports.default = router;
