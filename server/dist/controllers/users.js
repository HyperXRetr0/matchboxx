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
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUserSkills = updateUserSkills;
exports.updateUser = updateUser;
exports.getUserSkills = getUserSkills;
exports.deleteUserSkill = deleteUserSkill;
const client_1 = __importDefault(require("../PrismaClient/client"));
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield client_1.default.user.findMany({
                include: {
                    skillsProficient: true,
                    skillsToLearn: true,
                },
            });
            res.status(200).json({
                success: true,
                data: users,
            });
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
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                console.log("User id not found in url parameters.");
                res.status(400).json({
                    success: false,
                    message: "User id not found.",
                });
                return;
            }
            const user = yield client_1.default.user.findFirst({
                where: {
                    id,
                },
            });
            if (!user) {
                console.log("User not found.");
                res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: user,
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
function updateUserSkills(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { skillsProficient, skillsToLearn, } = req.body;
            const id = req.userId;
            const user = yield client_1.default.user.findFirst({
                where: {
                    id,
                },
                include: {
                    skillsProficient: true,
                    skillsToLearn: true,
                },
            });
            if (!user) {
                console.log("User not found.");
                res.status(401).json({
                    success: false,
                    message: "User not authorized.",
                });
                return;
            }
            const data = {};
            if (skillsProficient && (skillsProficient === null || skillsProficient === void 0 ? void 0 : skillsProficient.length) > 0) {
                data.skillsProficient = {
                    connect: skillsProficient.map((skillId) => ({ id: skillId })),
                };
            }
            if (skillsToLearn && (skillsToLearn === null || skillsToLearn === void 0 ? void 0 : skillsToLearn.length) > 0) {
                data.skillsToLearn = {
                    connect: skillsToLearn.map((skillId) => ({ id: skillId })),
                };
            }
            if (Object.keys(data).length > 0) {
                yield client_1.default.user.update({
                    where: { id },
                    data,
                });
            }
            res.status(200).json({
                success: true,
                message: "User updated successfully.",
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
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.userId;
            if (!id) {
                console.log("User not authorized.");
                res.status(401).json({
                    success: false,
                    message: "User not authorized.",
                });
                return;
            }
            const userData = req.body;
            yield client_1.default.user.update({
                where: {
                    id,
                },
                data: Object.assign({}, userData),
            });
            res.status(201).json({
                success: true,
                message: "User updated successfully.",
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
function getUserSkills(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.userId;
            if (!id) {
                console.log("User not authorized.");
                res.status(401).json({
                    success: false,
                    message: "User not authorized.",
                });
                return;
            }
            const skills = yield client_1.default.user.findFirst({
                where: { id },
                select: {
                    skillsProficient: true,
                    skillsToLearn: true,
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
function deleteUserSkill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.userId;
            if (!id) {
                console.log("User not authorized.");
                res.status(401).json({
                    success: false,
                    message: "User not authorized.",
                });
                return;
            }
            const { skillsProficientToRemove, skillsToLearnToRemove, } = req.body;
            if (!skillsProficientToRemove && !skillsToLearnToRemove) {
                console.log("No skill to delete.");
                res.status(400).json({
                    success: false,
                    message: "No skill to delete.",
                });
                return;
            }
            const data = {};
            if (skillsProficientToRemove && (skillsProficientToRemove === null || skillsProficientToRemove === void 0 ? void 0 : skillsProficientToRemove.length) > 0) {
                data.skillsProficient = {
                    disconnect: skillsProficientToRemove.map((skillId) => ({
                        id: skillId,
                    })),
                };
            }
            if (skillsToLearnToRemove && (skillsToLearnToRemove === null || skillsToLearnToRemove === void 0 ? void 0 : skillsToLearnToRemove.length) > 0) {
                data.skillsToLearn = {
                    disconnect: skillsToLearnToRemove.map((skillId) => ({ id: skillId })),
                };
            }
            if (Object.keys(data).length > 0) {
                yield client_1.default.user.update({
                    where: { id },
                    data,
                });
            }
            res.status(200).json({
                success: true,
                message: "Skills deleted successfully.",
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
