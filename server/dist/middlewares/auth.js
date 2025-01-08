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
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies["auth_token"];
            if (!token) {
                console.log("Authorization token not found in cookies.");
                res.status(401).json({
                    success: false,
                    message: "User not authorized.",
                });
                return;
            }
            const jwt_secret = process.env.JWT_SECRET;
            if (!jwt_secret) {
                throw new Error("Invalid JWT environment variable.");
            }
            const decoded = jsonwebtoken_1.default.verify(token, jwt_secret);
            if (!decoded) {
                console.log("Invalid authorization token.");
                res.status(401).json({
                    success: false,
                    message: "User not authorized.",
                });
                return;
            }
            req.userId = decoded.userId;
            next();
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
