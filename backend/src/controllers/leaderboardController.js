import { leaderboardTop } from "../services/leaderboardService.js";

export async function getLeaderboard(req, res) {
  const limit = Number(req.query.limit || 10);
  res.json({ leaderboard: await leaderboardTop(limit) });
}
