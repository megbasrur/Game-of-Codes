import { getFeatureFlags } from "../utils/featureFlags.js";

export function getCareerResult(req, res) {
  res.json({ careerResult: req.user.careerResult || null });
}

export async function saveCareerResult(req, res) {
  const features = getFeatureFlags(req.user);
  if (!features.careerGuidance) {
    return res.status(403).json({ message: "Career guidance is not available for this user." });
  }
  const { career, matchPercent, hollandCode, recommendedPath = [] } = req.body || {};
  if (!career || !hollandCode) {
    return res.status(400).json({ message: "career and hollandCode are required" });
  }
  req.user.careerResult = {
    career: String(career),
    matchPercent: Number(matchPercent) || 0,
    hollandCode: String(hollandCode),
    recommendedPath: Array.isArray(recommendedPath) ? recommendedPath.map(String) : [],
    completedAt: new Date(),
  };
  await req.user.save();
  res.json({ message: "Career result saved", careerResult: req.user.careerResult });
}
