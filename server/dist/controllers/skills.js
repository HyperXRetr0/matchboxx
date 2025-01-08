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
exports.addSkill = addSkill;
exports.getAllSkills = getAllSkills;
exports.searchSkill = searchSkill;
const client_1 = __importDefault(require("../PrismaClient/client"));
function addSkill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name: skillName } = req.body;
            const skill = yield client_1.default.skill.findFirst({
                where: {
                    name: skillName,
                },
            });
            if (skill) {
                console.log("Skill already exists.");
                res.status(400).json({
                    success: false,
                    message: "Skill already exists.",
                });
                return;
            }
            yield client_1.default.skill.create({
                data: {
                    name: skillName,
                },
            });
            res.status(201).json({
                success: true,
                message: "Skill successfully created.",
            });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error.",
            });
            return;
        }
    });
}
function getAllSkills(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const skills = yield client_1.default.skill.findMany({});
            res.status(200).json({
                success: true,
                data: skills,
            });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error.",
            });
            return;
        }
    });
}
function searchSkill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name: skillName } = req.body;
            const skills = yield client_1.default.skill.findMany({
                where: {
                    name: {
                        startsWith: skillName,
                        mode: "insensitive",
                    },
                },
            });
            res.status(200).json({
                success: true,
                data: skills,
            });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error.",
            });
            return;
        }
    });
}
