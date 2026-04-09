import Game from "../models/Game.js";
import Progress from "../models/Progress.js";
import { emitLeaderboardUpdate } from "../socket/leaderboardSocket.js";

export async function getMyProgress(req, res) {
  const rows = await Progress.find({ userId: req.user._id }).lean();
  const totalScore = rows.reduce((sum, p) => sum + (p.bestScore || 0), 0);
  const completedGames = rows.filter((p) => Boolean(p.completed)).length;
  res.json({
    progress: rows,
    summary: { totalScore, completedGames, totalGamesPlayed: rows.length },
  });
}

export async function completeGame(req, res) {
  const { gameId } = req.params;
  const { score = 0, completed = true } = req.body || {};
  const game = await Game.findOne({ id: gameId, isActive: true });
  if (!game) return res.status(404).json({ message: "Game not found" });
  const existing = await Progress.findOne({ userId: req.user._id, gameId });
  const finalScore = Math.max(Number(score) || 0, game.points);
  if (existing) {
    existing.attempts += 1;
    existing.bestScore = Math.max(existing.bestScore, finalScore);
    existing.completed = Boolean(completed) || existing.completed;
    await existing.save();
  } else {
    await Progress.create({
      userId: req.user._id,
      gameId,
      attempts: 1,
      bestScore: finalScore,
      completed: Boolean(completed),
    });
  }
  await emitLeaderboardUpdate();
  res.json({ message: "Progress updated" });
}
