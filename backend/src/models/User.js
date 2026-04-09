import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    age: { type: Number, required: true },
    role: { type: String, enum: ["Student", "Parent", "Admin"], default: "Student" },
    careerResult: {
      career: { type: String },
      matchPercent: { type: Number },
      hollandCode: { type: String },
      recommendedPath: [{ type: String }],
      completedAt: { type: Date },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
