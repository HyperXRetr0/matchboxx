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
exports.getAllFriends = getAllFriends;
exports.deleteFriend = deleteFriend;
const client_1 = __importDefault(require("../PrismaClient/client"));
function getAllFriends(req, res) {
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
            const friends = yield client_1.default.friend.findFirst({
                where: {
                    userId: id,
                },
                select: {
                    id: true,
                    friend: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            res.status(200).json({
                success: true,
                data: friends,
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
function deleteFriend(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            if (!userId) {
                console.log("User not authorized.");
                res.status(401).json({
                    success: false,
                    message: "User not authorized.",
                });
                return;
            }
            const { id } = req.params;
            if (!id) {
                console.log("Invalid user id.");
                res.status(400).json({
                    success: false,
                    message: "Invalid user id.",
                });
                return;
            }
            const friend = yield client_1.default.friend.findFirst({
                where: {
                    id,
                },
            });
            if (!friend) {
                console.log("You are not friends with each other.");
                res.status(400).json({
                    success: false,
                    message: "You are not friends with each other.",
                });
                return;
            }
            yield client_1.default.friend.delete({
                where: {
                    id,
                },
            });
            res.status(200).json({
                success: true,
                message: "Successfully removed user from friendlist.",
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
