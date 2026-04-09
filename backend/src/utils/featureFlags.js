export function getFeatureFlags(user) {
  const isParent = user.role === "Parent";
  const isUnder12 = Number(user.age) < 12;
  return {
    careerGuidance: !isParent && !isUnder12,
    parentalGuidance: isParent || isUnder12,
  };
}

export function safeUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    age: user.age,
    role: user.role,
    features: getFeatureFlags(user),
  };
}
