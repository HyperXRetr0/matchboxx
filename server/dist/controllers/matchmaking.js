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
exports.startMatchmaking = startMatchmaking;
const client_1 = __importDefault(require("../PrismaClient/client"));
const utils_1 = require("../utils/utils");
function startMatchmaking(req, res) {
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
            const currentUser = yield client_1.default.user.findUnique({
                where: { id },
                include: {
                    skillsProficient: true,
                    skillsToLearn: true,
                },
            });
            if (!currentUser) {
                res.status(401).json({
                    success: false,
                    message: "User not authorized.",
                });
                return;
            }
            const otherUsers = yield Promise.all(Array.from(utils_1.clients).map((_a) => __awaiter(this, [_a], void 0, function* ([key, val]) {
                return yield client_1.default.user.findFirst({
                    where: {
                        id: key,
                        NOT: {
                            id,
                        },
                    },
                    include: {
                        skillsProficient: true,
                        skillsToLearn: true,
                    },
                });
            }))).then((results) => results.filter((user) => !!user));
            if (!otherUsers.length) {
                res.status(404).json({
                    success: false,
                    message: "No other users found",
                });
                return;
            }
            const matchedUserIds = otherUsers.reduce((acc, user) => {
                const userId = user.id;
                const userProficientSkills = user.skillsProficient.map((skill) => skill.id);
                const userSkillsToLearn = user.skillsToLearn.map((skill) => skill.id);
                const learnSkillsMatch = (0, utils_1.hasIntersection)(currentUser.skillsToLearn.map((s) => s.id), userProficientSkills);
                const proficientSkillsMatch = (0, utils_1.hasIntersection)(currentUser.skillsProficient.map((s) => s.id), userSkillsToLearn);
                if (learnSkillsMatch || proficientSkillsMatch) {
                    acc.push(userId);
                }
                return acc;
            }, []);
            matchedUserIds.push("RandomId");
            res.status(200).json({
                success: true,
                data: matchedUserIds,
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
