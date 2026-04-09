import User from "../models/User.js";
import Session from "../models/Session.js";
import { verifyToken } from "../services/authService.js";

export async function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const payload = verifyToken(token);
    const activeSession = await Session.findOne({ token });
    if (!activeSession) return res.status(401).json({ message: "Session expired" });
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Invalid token user" });
    req.user = user;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
