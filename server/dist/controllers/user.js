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
exports.createUser = createUser;
exports.signin = signin;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
const client_1 = __importDefault(require("../PrismaClient/client"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, firstName, lastName } = req.body;
            const user = yield client_1.default.user.findFirst({
                where: {
                    email,
                },
            });
            if (user) {
                console.log("Email already in use.");
                res.status(409).json({
                    success: false,
                    message: "Email already in use.",
                });
                return;
            }
            const saltRounds = process.env.SALT;
            if (!saltRounds || isNaN(Number(saltRounds))) {
                throw new Error("Invalid SALT environment variable.");
            }
            const salt = yield bcryptjs_1.default.genSalt(Number(saltRounds));
            const hash = yield bcryptjs_1.default.hash(password, salt);
            yield client_1.default.user.create({
                data: {
                    email,
                    password: hash,
                    firstName,
                    lastName,
                },
            });
            console.log("User created successfully.");
            res.status(201).json({
                success: true,
                message: "User sign up successful",
            });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
            return;
        }
    });
}
function signin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            let user = yield client_1.default.user.findFirst({
                where: {
                    email,
                },
            });
            if (!user) {
                console.log("Invalid Credentials.");
                res.status(401).json({
                    sucess: false,
                    message: "Invalid Credentials.",
                });
                return;
            }
            const verify = yield bcryptjs_1.default.compare(password, user.password);
            if (!verify) {
                console.log("Invalid Credentials.");
                res.status(401).json({
                    sucess: false,
                    message: "Invalid Credentials.",
                });
                return;
            }
            const jwt_secret = process.env.JWT_SECRET;
            console.log(jwt_secret);
            if (!jwt_secret) {
                throw new Error("Invalid JWT SECRET environment variable.");
            }
            const token = jsonwebtoken_1.default.sign({
                userId: user.id,
            }, jwt_secret);
            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.production === "production",
            });
            res.status(200).json({
                success: true,
                message: "User sign in successful.",
            });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
            return;
        }
    });
}
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
function updateUser(req, res) {
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
            yield client_1.default.user.update({
                where: { id },
                data: {
                    skillsProficient: {
                        connect: skillsProficient.map((skillId) => ({ id: skillId })),
                    },
                    skillsToLearn: {
                        connect: skillsToLearn.map((skillId) => ({ id: skillId })),
                    },
                },
            });
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
