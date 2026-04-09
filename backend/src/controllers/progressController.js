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
  const body = req.body || {};
  const scoreIn = Number(body.score) || 0;
  const completedFlag = body.completed === undefined ? true : Boolean(body.completed);
  const game = await Game.findOne({ id: gameId, isActive: true });
  if (!game) return res.status(404).json({ message: "Game not found" });
  const existing = await Progress.findOne({ userId: req.user._id, gameId });

  const finalScore = completedFlag
    ? Math.max(scoreIn, game.points)
    : Math.max(scoreIn, existing?.bestScore || 0);

  if (existing) {
    if (completedFlag || scoreIn > 0) {
      existing.attempts += 1;
    }
    existing.bestScore = Math.max(existing.bestScore, finalScore);
    existing.completed = completedFlag || existing.completed;
    await existing.save();
  } else {
    await Progress.create({
      userId: req.user._id,
      gameId,
      attempts: 1,
      bestScore: finalScore,
      completed: completedFlag,
    });
  }
  await emitLeaderboardUpdate();
  res.json({ message: "Progress updated" });
}
