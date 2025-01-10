import express from "express";
import { WebSocketServer } from "ws";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/users";
import skillRoutes from "./routes/skills";
import friendsRoutes from "./routes/friends";
import matchmakingRoutes from "./routes/matchmaking";
import authRoutes from "./routes/auth";
import { clients } from "./utils/utils";
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);
app.use(cookieParser());
const server = app.listen(process.env.PORT, () => {
  console.log("App is listening...");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket, req) => {
  const userId = req.url?.split("?id=")[1];
  if (!userId) return;
  clients.set(userId, socket);
  socket.on("close", () => {
    clients.delete(userId);
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/skills", skillRoutes);
app.use("/api/v1/friends", friendsRoutes);
app.use("/api/v1/matchmaking", matchmakingRoutes);
