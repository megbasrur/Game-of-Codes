import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    gameId: { type: String, required: true, index: true },
    attempts: { type: Number, default: 1 },
    bestScore: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, gameId: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
