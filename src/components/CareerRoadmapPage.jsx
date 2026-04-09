import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { apiRequest } from "../lib/api";
import AppHeader from "./AppHeader";
import CareerSavedResultsDetail from "./CareerSavedResultsDetail";

export default function CareerRoadmapPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [careerResult, setCareerResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [me, career] = await Promise.all([
          apiRequest("/users/me"),
          apiRequest("/career-result/me"),
        ]);
        if (!active) return;
        setProfile(me.user);
        setCareerResult(career.careerResult || null);
      } catch {
        navigate("/login");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="w-screen min-h-screen relative overflow-hidden p-8 pb-16">
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

        {loading && (
          <p className="text-white text-center py-12">Loading your roadmap…</p>
        )}

        {!loading && !profile?.features?.careerGuidance && (
          <div className="rounded-3xl border border-purple-500/40 shadow-2xl bg-black/40 p-8 text-white max-w-2xl mx-auto">
            <h1 className="text-2xl font-extrabold mb-2">Parental guidance mode</h1>
            <p className="text-purple-200/80">
              Career roadmap and assessment are hidden for parents and children
              below 12.
            </p>
          </div>
        )}

        {!loading &&
          profile?.features?.careerGuidance &&
          !careerResult?.career && (
            <div className="rounded-3xl border border-white/20 bg-black/40 p-8 text-white text-center max-w-xl mx-auto">
              <h1 className="text-2xl font-extrabold mb-3">No saved results yet</h1>
              <p className="text-purple-200/90 mb-6 text-sm leading-relaxed">
                Take the career quiz once. When you finish, your full roadmap
                and course plan will appear here.

              </p>
              <button
                type="button"
                onClick={() => navigate("/career-quiz")}
                className="inline-flex items-center gap-2 rounded-xl bg-white/95 text-purple-900 font-bold px-6 py-3 text-sm shadow-md hover:bg-white transition-colors"
              >
                Start career assessment
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        {!loading &&
          profile?.features?.careerGuidance &&
          careerResult?.career && (
            <CareerSavedResultsDetail
              careerResult={careerResult}
              embedPage
            />
          )}
      </div>
    </div>
  );
}
