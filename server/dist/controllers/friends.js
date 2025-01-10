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
exports.sendFriendRequest = sendFriendRequest;
exports.getReceivedRequests = getReceivedRequests;
exports.getSentRequests = getSentRequests;
exports.handleRequest = handleRequest;
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
            const friends = yield client_1.default.friend.findMany({
                where: {
                    OR: [
                        {
                            userId: id,
                        },
                        {
                            friendId: id,
                        },
                    ],
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    friend: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            const friendList = friends.map((relation) => {
                return {
                    id: relation.id,
                    friend: relation.userId === id ? relation.friend : relation.user,
                };
            });
            res.status(200).json({
                success: true,
                data: friendList,
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
function sendFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const senderId = req.userId;
            if (!senderId) {
                console.log("User not authorized.");
                res.status(401).json({
                    success: false,
                    message: "User not authorized.",
                });
                return;
            }
            const { id: receiverId } = req.body;
            if (senderId === receiverId) {
                console.log("Self friend requests not allowed.");
                res.status(400).json({
                    success: false,
                    message: "Self friend requests not allowed.",
                });
                return;
            }
            const receiver = yield client_1.default.user.findFirst({
                where: {
                    id: receiverId,
                },
            });
            if (!receiver) {
                console.log("User not found with that id.");
                res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
                return;
            }
            const pending = yield client_1.default.friendRequest.findFirst({
                where: {
                    OR: [
                        {
                            receiverId,
                            senderId,
                        },
                        {
                            receiverId: senderId,
                            senderId: receiverId,
                        },
                    ],
                },
            });
            if (pending) {
                console.log("Pending friend request.");
                res.status(400).json({
                    success: false,
                    message: "Pending frined request.",
                });
                return;
            }
            yield client_1.default.friendRequest.create({
                data: {
                    sender: {
                        connect: { id: senderId },
                    },
                    receiver: {
                        connect: { id: receiverId },
                    },
                },
            });
            res.status(201).json({
                success: true,
                message: "Friend request sent successfully.",
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
function getReceivedRequests(req, res) {
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
            const requests = yield client_1.default.friendRequest.findMany({
                where: {
                    receiverId: id,
                },
            });
            res.status(200).json({
                success: true,
                data: requests,
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
function getSentRequests(req, res) {
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
            const requests = yield client_1.default.friendRequest.findMany({
                where: {
                    senderId: id,
                },
            });
            res.status(200).json({
                success: true,
                data: requests,
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
function handleRequest(req, res) {
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
            const { friendRequestId } = req.params;
            const { response } = req.body;
            if (!response || (response !== "ACCEPT" && response !== "REJECT")) {
                console.log("Invalid response");
                res.status(400).json({
                    success: false,
                    message: "Invalid Response.",
                });
                return;
            }
            const friendRequest = yield client_1.default.friendRequest.findFirst({
                where: {
                    id: friendRequestId,
                },
            });
            if (!friendRequest) {
                console.log("No friend request fount.");
                res.status(400).json({
                    success: false,
                    message: "No friend request.",
                });
                return;
            }
            if (response === "ACCEPT") {
                yield client_1.default.friend.create({
                    data: {
                        user: {
                            connect: { id },
                        },
                        friend: {
                            connect: { id: friendRequest.senderId },
                        },
                    },
                });
                yield client_1.default.friendRequest.delete({
                    where: {
                        id: friendRequest.id,
                    },
                });
                console.log("Friend request accepted.");
                res.status(201).json({
                    success: true,
                    message: "Friend request accepted.",
                });
                return;
            }
            yield client_1.default.friendRequest.delete({
                where: {
                    id: friendRequest.id,
                },
            });
            console.log("Request removed.");
            res.status(200).json({
                success: true,
                message: "Request removed successfully.",
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
