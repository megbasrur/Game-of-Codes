import React, { useEffect, useState } from "react";
import { Trophy, ChevronRight, X } from "lucide-react";
import {
  MODEL,
  DOMAIN_MAP,
  COURSE_INFO,
  RIASEC_COLORS,
  RIASEC_NAMES,
  GameMapRoadmap,
} from "./CareerQuiz.jsx";

const allCourses = ["Python", "Java/C++", "WebDev", "ML"];

function normalizeRoadmapSteps(career) {
  let steps = MODEL.career_roadmap[career];
  if (!Array.isArray(steps) || steps.length === 0) {
    return [
      "Foundation",
      "Core skills",
      "Hands-on practice",
      "Advanced topics",
      "Career ready",
    ];
  }
  const out = [...steps];
  const labels = ["Build on basics", "Deepen skills", "Practice projects", "Advanced work", "Goal"];
  while (out.length < 5) out.push(labels[out.length] || `Step ${out.length + 1}`);
  return out.slice(0, 5);
}

function getCourses(career, recommendedPath) {
  const fromModel = MODEL.career_courses[career];
  if (fromModel) return fromModel;
  const path = Array.isArray(recommendedPath) ? recommendedPath.filter(Boolean) : [];
  return {
    primary: path[0] || "Python",
    secondary: path[1] || "WebDev",
    path: path.length ? path : ["Python", "ML"],
  };
}

/**
 * Full results-style panel (roadmap, courses, RIASEC, alternates) from saved API payload.
 */
export default function CareerSavedResultsDetail({
  careerResult,
  onClose,
  embedPage = false,
}) {
  const [barsReady, setBarsReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!careerResult?.career) return null;

  const career = careerResult.career;
  const pct = Number(careerResult.matchPercent) || 0;
  const code = careerResult.hollandCode || "";
  const recommendedPath = careerResult.recommendedPath || [];
  const courses = getCourses(career, recommendedPath);
  const roadmapSteps = normalizeRoadmapSteps(career);
  const rawScores = careerResult.riasecScores || null;
  const scores =
    rawScores && typeof rawScores === "object"
      ? { R: rawScores.R ?? 0, I: rawScores.I ?? 0, A: rawScores.A ?? 0, S: rawScores.S ?? 0, E: rawScores.E ?? 0, C: rawScores.C ?? 0 }
      : null;
  const maxScore = scores ? Math.max(...Object.values(scores), 1) : 1;
  const runnerUps = Array.isArray(careerResult.runnerUpCareers) ? careerResult.runnerUpCareers : [];

  const card = {
    background: "rgba(20,12,50,0.92)",
    border: "1.5px solid rgba(167,139,250,0.4)",
    boxShadow: "0 4px 24px rgba(124,58,237,0.2)",
  };

  return (
    <div className="relative rounded-2xl border border-purple-500/40 bg-[#0f0828]/95 text-white shadow-2xl overflow-hidden">
      <style>{`
        @keyframes ping {
          0%   { transform: scale(1);   opacity: .5; }
          70%  { transform: scale(1.6); opacity: 0;  }
          100% { transform: scale(1.6); opacity: 0;  }
        }
      `}</style>

      {!embedPage && (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-sm">
          <span className="text-sm font-bold text-purple-200">
            Your assessment — full roadmap
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
            >
              <X className="w-4 h-4" /> Close
            </button>
          )}
        </div>
      )}

      <div
        className={`${
          embedPage ? "max-h-none" : "max-h-[min(85vh,900px)]"
        } overflow-y-auto px-4 py-6`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
              style={{
                background: "rgba(251,191,36,0.12)",
                border: "1px solid rgba(251,191,36,0.35)",
              }}
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold font-mono tracking-widest uppercase">
                Saved career match
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Results</h2>
            <p className="text-gray-300 text-sm mt-2">Same view as when you finished the assessment</p>
          </div>

          <div
            className="relative rounded-3xl p-7 mb-5 overflow-hidden shadow-2xl"
            style={{
              background: "rgba(30,14,70,0.96)",
              border: "1.5px solid rgba(167,139,250,0.6)",
              boxShadow: "0 8px 40px rgba(124,58,237,0.4)",
            }}
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="text-xs font-bold tracking-widest text-purple-300 font-mono mb-2 uppercase">
              # 1 Match · ML Prediction
            </div>
            <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">{career}</div>
            <div className="text-sm text-gray-300 mb-5">{DOMAIN_MAP[career] || "Tech"}</div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-extrabold text-green-400 font-mono">{pct}%</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: barsReady ? `${pct}%` : "0%",
                    background: "linear-gradient(90deg,#7c3aed,#34d399)",
                  }}
                />
              </div>
            </div>
            <div className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-widest">Your Holland Code</div>
            <div className="text-3xl font-extrabold tracking-[6px] font-mono bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
              {code}
            </div>
          </div>

          <div className="mb-5">
            <GameMapRoadmap steps={roadmapSteps} career={career} />
          </div>

          <div className="rounded-2xl overflow-hidden mb-5 shadow-xl" style={card}>
            <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(167,139,250,0.2)" }}>
              <div className="text-xs font-bold text-green-400 font-mono tracking-widest uppercase mb-1">
                Start Next on the Platform
              </div>
              <div className="text-xl font-bold text-white">{COURSE_INFO[courses.primary]?.name}</div>
            </div>
            <div className="px-6 py-4 flex flex-wrap gap-2 items-center">
              {courses.path.map((c, i) => (
                <React.Fragment key={c}>
                  {i > 0 && <ChevronRight className="w-3 h-3 text-gray-500" />}
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold font-mono"
                    style={{
                      background: i === 0 ? "rgba(124,58,237,0.35)" : "rgba(34,197,94,0.15)",
                      border: i === 0 ? "1.5px solid rgba(167,139,250,0.7)" : "1.5px solid rgba(34,197,94,0.4)",
                      color: i === 0 ? "#e9d5ff" : "#86efac",
                    }}
                  >
                    {COURSE_INFO[c]?.name || c}
                  </span>
                </React.Fragment>
              ))}
              {allCourses
                .filter((c) => !courses.path.includes(c))
                .map((c) => (
                  <React.Fragment key={c}>
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold font-mono"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1.5px solid rgba(255,255,255,0.18)",
                        color: "#9ca3af",
                      }}
                    >
                      {COURSE_INFO[c]?.name}
                    </span>
                  </React.Fragment>
                ))}
            </div>
          </div>

          <div className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-3">All Platform Courses</div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {allCourses.map((c) => {
              const isPrimary = c === courses.primary;
              const isSecondary = c === courses.secondary;
              const info = COURSE_INFO[c];
              return (
                <div
                  key={c}
                  className="rounded-2xl p-4 transition-all"
                  style={{
                    background: isPrimary
                      ? "rgba(124,58,237,0.28)"
                      : isSecondary
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(255,255,255,0.06)",
                    border: isPrimary
                      ? "1.5px solid rgba(167,139,250,0.7)"
                      : isSecondary
                        ? "1.5px solid rgba(34,197,94,0.4)"
                        : "1.5px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <div
                    className="text-xs font-bold font-mono tracking-widest rounded-full px-2 py-0.5 inline-block mb-3"
                    style={{
                      background: isPrimary
                        ? "rgba(167,139,250,0.2)"
                        : isSecondary
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(255,255,255,0.07)",
                      color: isPrimary ? "#c4b5fd" : isSecondary ? "#86efac" : "#6b7280",
                    }}
                  >
                    {isPrimary ? "Recommended" : isSecondary ? "Next up" : "Optional"}
                  </div>
                  <div className="text-sm font-bold text-white mb-1">{info.name}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{info.desc}</div>
                </div>
              );
            })}
          </div>

          {scores && (
            <>
              <div className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-3">Your RIASEC Profile</div>
              <div className="rounded-2xl p-6 mb-5 shadow-xl" style={card}>
                <div className="space-y-4">
                  {Object.entries(scores)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dim, val]) => (
                      <div key={dim} className="flex items-center gap-3">
                        <div className="w-6 text-xs font-bold font-mono" style={{ color: RIASEC_COLORS[dim] }}>
                          {dim}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-400 font-mono mb-1">{RIASEC_NAMES[dim]}</div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: barsReady ? `${Math.round((val / maxScore) * 100)}%` : "0%",
                                background: RIASEC_COLORS[dim],
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-6 text-xs font-mono text-gray-400 text-right">{val}</div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {runnerUps.length > 0 && (
            <>
              <div className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-3">Other Strong Matches</div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {runnerUps.map((r, i) => (
                  <div
                    key={`${r.career}-${i}`}
                    className="rounded-2xl p-4 transition-all"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.18)" }}
                  >
                    <div className="text-xs text-gray-400 font-mono mb-1">#{i + 2} match</div>
                    <div className="text-sm font-bold text-white mb-1 leading-tight">{r.career}</div>
                    <div className="text-purple-300 font-mono text-xs mb-2">{r.matchPercent}%</div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${r.matchPercent}%`, background: "rgba(167,139,250,0.6)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!scores && (
            <p className="text-center text-sm text-purple-300/80 mb-4">
              Retake the assessment once to store your full RIASEC chart and alternate matches with this profile.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
