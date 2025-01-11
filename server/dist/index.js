"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const skills_1 = __importDefault(require("./routes/skills"));
const friends_1 = __importDefault(require("./routes/friends"));
const matchmaking_1 = __importDefault(require("./routes/matchmaking"));
const auth_1 = __importDefault(require("./routes/auth"));
const utils_1 = require("./utils/utils");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
const server = app.listen(process.env.PORT, () => {
    console.log("App is listening...");
});
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (socket, req) => {
    var _a;
    const userId = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("?id=")[1];
    if (!userId)
        return;
    utils_1.clients.set(userId, socket);
    socket.on("message", (data) => {
        const parsedMessage = JSON.parse(data.toString());
        const { type, payload } = parsedMessage;
        const { recipientId, message } = payload;
        const recipientSocket = utils_1.clients.get(recipientId);
        if (!recipientSocket) {
            console.log("User not disconnected!");
            return;
        }
        switch (type) {
            case "chat":
                recipientSocket.send(JSON.stringify({ senderId: recipientId, message }));
                break;
            case "notify":
                socket.send(JSON.stringify({ sender: server, message: "Match Found..." }));
                recipientSocket.send(JSON.stringify({ sender: server, message: "Match Found..." }));
            default:
                console.log("Unknown message type");
        }
    });
    socket.on("close", () => {
        utils_1.clients.delete(userId);
    });
});
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/users", users_1.default);
app.use("/api/v1/skills", skills_1.default);
app.use("/api/v1/friends", friends_1.default);
app.use("/api/v1/matchmaking", matchmaking_1.default);
