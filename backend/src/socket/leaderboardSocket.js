import { getIo } from "./ioState.js";
import { leaderboardTop } from "../services/leaderboardService.js";

export async function emitLeaderboardUpdate() {
  const io = getIo();
  if (!io) return;
  io.emit("leaderboard:update", await leaderboardTop(20));
}

export function attachLeaderboardSocket(io) {
  io.on("connection", async (socket) => {
    socket.emit("leaderboard:update", await leaderboardTop(20));
  });
}
