import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { setIo } from "./socket/ioState.js";
import { attachLeaderboardSocket } from "./socket/leaderboardSocket.js";
import { connectAndSeedDatabase } from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import featureRoutes from "./routes/featureRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

setIo(io);
attachLeaderboardSocket(io);

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/career-result", careerRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);

async function bootstrap() {
  const PORT = Number(process.env.PORT || 5001);
  const MONGODB_URI = process.env.MONGODB_URI;
  await connectAndSeedDatabase(MONGODB_URI);
  httpServer.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
