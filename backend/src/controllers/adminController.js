import User from "../models/User.js";
import { safeUser } from "../utils/featureFlags.js";

export async function listUsers(_req, res) {
  const users = await User.find({}).lean();
  res.json({
    users: users.map((u) => safeUser({ ...u, _id: u._id })),
  });
}
