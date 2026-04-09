import Progress from "../models/Progress.js";
import User from "../models/User.js";

export async function leaderboardTop(limit = 10) {
  const rows = await Progress.aggregate([
    { $group: { _id: "$userId", score: { $sum: "$bestScore" } } },
    { $sort: { score: -1 } },
    { $limit: limit },
  ]);
  const userIds = rows.map((r) => r._id);
  const users = await User.find({ _id: { $in: userIds } }).lean();
  const byId = new Map(users.map((u) => [String(u._id), u]));
  return rows.map((r) => {
    const id = String(r._id);
    return {
      userId: id,
      name: byId.get(id)?.name || "Unknown",
      score: r.score,
    };
  });
}
