import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Session from "../models/Session.js";
import { createToken } from "../services/authService.js";
import { safeUser } from "../utils/featureFlags.js";

export async function signup(req, res) {
  const { name, email, password, age, role } = req.body || {};
  if (!name || !email || !password || !age) {
    return res.status(400).json({ message: "name, email, password, age are required" });
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ message: "Email already exists" });
  const parsedAge = Number(age);
  if (Number.isNaN(parsedAge) || parsedAge < 5 || parsedAge > 120) {
    return res.status(400).json({ message: "Invalid age" });
  }
  const normalizedRole = ["Student", "Parent", "Admin"].includes(role) ? role : "Student";
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    age: parsedAge,
    role: normalizedRole,
  });
  return res.status(201).json({ message: "Signup successful", user: safeUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || "").toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (!user.passwordHash) {
    return res.status(401).json({ message: "Account password is not set. Please sign up again." });
  }
  const ok = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = createToken(user);
  await Session.create({ token, userId: user._id });
  return res.json({ token, user: safeUser(user) });
}

export async function logout(req, res) {
  await Session.deleteOne({ token: req.token });
  return res.json({ message: "Logged out" });
}
