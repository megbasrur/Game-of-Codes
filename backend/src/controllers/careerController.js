import { getFeatureFlags } from "../utils/featureFlags.js";

export function getCareerResult(req, res) {
  res.json({ careerResult: req.user.careerResult || null });
}

export async function saveCareerResult(req, res) {
  const features = getFeatureFlags(req.user);
  if (!features.careerGuidance) {
    return res.status(403).json({ message: "Career guidance is not available for this user." });
  }
  const {
    career,
    matchPercent,
    hollandCode,
    recommendedPath = [],
    riasecScores: bodyRiasec,
    runnerUpCareers: bodyRunners,
  } = req.body || {};
  if (!career || !hollandCode) {
    return res.status(400).json({ message: "career and hollandCode are required" });
  }
  const dims = ["R", "I", "A", "S", "E", "C"];
  let riasecScores;
  if (bodyRiasec && typeof bodyRiasec === "object") {
    riasecScores = {};
    for (const d of dims) {
      const n = Number(bodyRiasec[d]);
      if (!Number.isNaN(n)) riasecScores[d] = n;
    }
    if (Object.keys(riasecScores).length === 0) riasecScores = undefined;
  }
  let runnerUpCareers;
  if (Array.isArray(bodyRunners)) {
    runnerUpCareers = bodyRunners
      .slice(0, 8)
      .map((r) => ({
        career: String(r?.career || ""),
        matchPercent: Math.min(100, Math.max(0, Number(r?.matchPercent) || 0)),
      }))
      .filter((r) => r.career);
    if (runnerUpCareers.length === 0) runnerUpCareers = undefined;
  }
  req.user.careerResult = {
    career: String(career),
    matchPercent: Number(matchPercent) || 0,
    hollandCode: String(hollandCode),
    recommendedPath: Array.isArray(recommendedPath) ? recommendedPath.map(String) : [],
    completedAt: new Date(),
    ...(riasecScores ? { riasecScores } : {}),
    ...(runnerUpCareers ? { runnerUpCareers } : {}),
  };
  await req.user.save();
  res.json({ message: "Career result saved", careerResult: req.user.careerResult });
}
