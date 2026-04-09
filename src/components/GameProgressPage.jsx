import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import AppHeader from "./AppHeader";

export default function GameProgressPage() {
  const navigate = useNavigate();
  const [progressRows, setProgressRows] = useState([]);
  const [gamesMap, setGamesMap] = useState({});

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [progress, games] = await Promise.all([
          apiRequest("/progress/me"),
          apiRequest("/games"),
        ]);
        if (!active) return;
        setProgressRows(progress.progress || []);
        setGamesMap(
          Object.fromEntries((games.games || []).map((g) => [g.id, g.title]))
        );
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

        <div className="bg-black/40 border border-white/20 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Game progress</h1>
          <p className="text-sm text-purple-200/90 mb-6">
            Every game you start or complete is listed here. Scores refresh every few seconds.
          </p>
          {progressRows.length === 0 && (
            <p className="text-sm text-purple-200">No games played yet.</p>
          )}
          {progressRows.map((row) => (
            <div
              key={row.gameId}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-3 mb-2"
            >
              <p className="text-sm font-semibold">
                {gamesMap[row.gameId] || row.gameId}
              </p>
              <p className="text-sm text-purple-200">
                Highest score: {row.bestScore || 0}
                {row.completed ? (
                  <span className="ml-2 text-green-300 text-xs">· Done</span>
                ) : (
                  <span className="ml-2 text-amber-200/90 text-xs">
                    · In progress
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
