"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../PrismaClient/client"));
const SKILLS = [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "Express.js",
    "Django",
    "Flask",
    "Java",
    "Spring Boot",
    "C++",
    "C#",
    "Go",
    "Rust",
    "Kotlin",
    "Swift",
    "Android Development",
    "iOS Development",
    "Machine Learning",
    "Data Analysis",
    "Artificial Intelligence",
    "DevOps",
    "AWS",
    "Azure",
    "Google Cloud Platform",
    "Docker",
    "Kubernetes",
    "Blockchain",
    "Solidity",
    "Cybersecurity",
    "UI/UX Design",
    "Figma",
    "Adobe XD",
    "Project Management",
    "Agile Methodologies",
    "Scrum",
    "Git",
    "GitHub",
    "Version Control",
    "Testing",
    "Jest",
    "Cypress",
    "Selenium",
    "Game Development",
    "Unity",
    "Unreal Engine",
    "3D Modeling",
    "Blender",
    "Photoshop",
    "Illustrator",
    "Video Editing",
    "Premiere Pro",
    "After Effects",
];
function seedSkills() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client_1.default.skill.createMany({
            data: SKILLS.map((name) => ({ name })),
        });
        console.log("Skills Added to database.");
    });
}
seedSkills();
