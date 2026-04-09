import { getFeatureFlags, safeUser } from "../utils/featureFlags.js";

export function getMe(req, res) {
  res.json({ user: safeUser(req.user) });
}

export function getFeatures(req, res) {
  res.json({ features: getFeatureFlags(req.user) });
}
