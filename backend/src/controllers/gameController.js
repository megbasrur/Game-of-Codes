import Game from "../models/Game.js";

export async function listGames(_req, res) {
  res.json({ games: await Game.find({ isActive: true }).lean() });
}

export async function createGame(req, res) {
  const { id, title, planetId = "0", difficulty = "beginner", points = 30 } = req.body || {};
  if (!id || !title) return res.status(400).json({ message: "id and title are required" });
  const existing = await Game.findOne({ id: String(id) });
  if (existing) return res.status(409).json({ message: "Game id already exists" });
  const game = await Game.create({
    id: String(id),
    title: String(title),
    planetId: String(planetId),
    difficulty: String(difficulty),
    points: Number(points) || 30,
    isActive: true,
  });
  return res.status(201).json({ game });
}
