import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
