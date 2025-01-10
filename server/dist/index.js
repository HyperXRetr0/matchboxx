"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const skills_1 = __importDefault(require("./routes/skills"));
const friends_1 = __importDefault(require("./routes/friends"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http:localhost:5173",
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/users", users_1.default);
app.use("/api/v1/skills", skills_1.default);
app.use("/api/v1/friends", friends_1.default);
app.listen(process.env.PORT);
