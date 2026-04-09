import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Trophy, Target, Gamepad2 } from "lucide-react";
import { apiRequest } from "../lib/api";
import AppHeader from "./AppHeader";

export default function SummaryPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    totalScore: 0,
    completedGames: 0,
  });
  const [inProgressCount, setInProgressCount] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const progress = await apiRequest("/progress/me");
        if (!active) return;
        const rows = progress.progress || [];
        setSummary(
          progress.summary || { totalScore: 0, completedGames: 0 }
        );
        const started = rows.filter((r) => !r.completed).length;
        setInProgressCount(started);
      } catch {
        navigate("/login");
      }
    };
    load();
    const t = setInterval(load, 7000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [navigate]);

  return (
    <div className="w-screen min-h-screen relative overflow-hidden p-8">
      <div
        className="absolute w-full h-full top-0 left-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, #2B0B5A 0%, #1A0C3F 60%), 
                       linear-gradient(135deg, #2F2F6F 0%, #6B6CD9 70%, #A44EFF 100%)`,
        }}
      />
      <div className="absolute w-3/5 h-3/5 top-10 left-20 bg-purple-500/50 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute w-2/5 h-2/5 bottom-10 right-10 bg-pink-500/40 rounded-full filter blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <AppHeader />

        <div className="mb-8 flex justify-center">
          <div className="bg-gradient-to-r border-2 from-purple-700 to-pink-500 rounded-lg p-4 flex items-center justify-between w-full max-w-6xl shadow-lg animate-pulse">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-yellow-300 shrink-0" />
              <span className="text-white font-bold text-xl md:text-2xl">
                You reached Level 3! Keep playing to unlock more rewards
              </span>
            </div>
            <Trophy className="w-10 h-10 text-yellow-300 shrink-0" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-black/40 border border-white/20 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-pink-300" />
              <h2 className="text-lg font-bold">Total score</h2>
            </div>
            <p className="text-4xl font-extrabold text-white font-mono">
              {summary.totalScore ?? 0}
            </p>
            <p className="text-sm text-purple-200/80 mt-2">
              Points earned across all games.
            </p>
          </div>

          <div className="bg-black/40 border border-white/20 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-green-300" />
              <h2 className="text-lg font-bold">Games completed</h2>
            </div>
            <p className="text-4xl font-extrabold text-white font-mono">
              {summary.completedGames ?? 0}
            </p>
            <p className="text-sm text-purple-200/80 mt-2">
              Finished with a completion flag on the server.
            </p>
          </div>

          <div className="bg-black/40 border border-white/20 rounded-2xl p-6 text-white sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <Gamepad2 className="w-8 h-8 text-amber-300" />
              <h2 className="text-lg font-bold">In progress</h2>
            </div>
            <p className="text-4xl font-extrabold text-white font-mono">
              {inProgressCount}
            </p>
            <p className="text-sm text-purple-200/80 mt-2">
              Games you have started but not marked complete yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
