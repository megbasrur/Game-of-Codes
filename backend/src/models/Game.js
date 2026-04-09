import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    planetId: { type: String, default: "0" },
    difficulty: { type: String, default: "beginner" },
    points: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
export default Game;
