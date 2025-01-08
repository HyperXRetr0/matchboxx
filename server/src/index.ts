import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/users";
import skillRoutes from "./routes/skills";
import friendRequestRoutes from "./routes/friendRequests";
import friendsRoutes from "./routes/friends";
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http:localhost:5173",
  })
);
app.use(cookieParser());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/skills", skillRoutes);
app.use("/api/v1/friend-requests", friendRequestRoutes);
app.use("/api/v1/friends", friendsRoutes);
app.listen(process.env.PORT);
