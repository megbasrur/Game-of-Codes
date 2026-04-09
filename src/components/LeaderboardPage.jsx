import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Trophy, Medal } from "lucide-react";
import { apiRequest } from "../lib/api";
import AppHeader from "./AppHeader";

function PodiumCard({ rank, row }) {
  const config = {
    1: { height: "h-44", bg: "from-yellow-300 to-yellow-500", icon: <Crown className="w-6 h-6 text-yellow-200" /> },
    2: { height: "h-32", bg: "from-slate-300 to-slate-500", icon: <Medal className="w-6 h-6 text-slate-200" /> },
    3: { height: "h-24", bg: "from-amber-500 to-orange-700", icon: <Trophy className="w-6 h-6 text-amber-100" /> },
  }[rank];

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-white text-center min-h-14">
        <p className="font-bold text-sm">{row?.name || "—"}</p>
        <p className="text-xs text-purple-200">{row?.score ?? 0} pts</p>
      </div>
      <div className={`w-36 ${config.height} rounded-t-2xl bg-gradient-to-b ${config.bg} flex flex-col items-center justify-center shadow-2xl border border-white/30`}>
        {config.icon}
        <p className="font-extrabold text-white text-2xl mt-1">#{rank}</p>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await apiRequest("/leaderboard?limit=50");
        if (active) setRows(data.leaderboard || []);
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

  const first = rows[0];
  const second = rows[1];
  const third = rows[2];
  const rest = rows.slice(3);

  return (
    <div className="min-h-screen w-screen relative overflow-hidden p-6">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, #2B0B5A 0%, #1A0C3F 60%),
                       linear-gradient(135deg, #2F2F6F 0%, #6B6CD9 70%, #A44EFF 100%)`,
        }}
      />
      <div className="absolute w-3/5 h-3/5 top-10 left-20 bg-purple-500/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute w-2/5 h-2/5 bottom-10 right-10 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <AppHeader />
        <h1 className="text-4xl font-extrabold text-white tracking-wide text-center mb-8">
          Galaxy Leaderboard
        </h1>

        <div className="rounded-3xl bg-black/35 border border-white/20 p-8 mb-8">
          <div className="flex items-end justify-center gap-8">
            <PodiumCard rank={2} row={second} />
            <PodiumCard rank={1} row={first} />
            <PodiumCard rank={3} row={third} />
          </div>
        </div>

        <div className="rounded-3xl bg-black/35 border border-white/20 p-6">
          <h2 className="text-white text-2xl font-bold mb-4">Other Players</h2>
          <div className="space-y-2">
            {rest.length === 0 && <p className="text-purple-200">No more players yet.</p>}
            {rest.map((row, index) => (
              <div
                key={row.userId}
                className="flex items-center justify-between bg-white/10 border border-white/15 rounded-xl px-4 py-3"
              >
                <p className="text-white font-semibold">#{index + 4} {row.name}</p>
                <p className="text-purple-200 font-bold">{row.score} pts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
