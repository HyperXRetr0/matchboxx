import express from "express";
import { addSkill, getAllSkills, searchSkill } from "../controllers/skills";
const router = express.Router();

router.post("/add-skill", addSkill);
router.get("/", getAllSkills);
router.get("/search", searchSkill);

export default router;
