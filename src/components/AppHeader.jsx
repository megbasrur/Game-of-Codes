import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Home,
  Award,
  BarChart3,
  Route,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import Robot from "../assets/robot.png";
import { apiRequest } from "../lib/api";

function NavButton({ to, label, Icon, active, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(to)}
      className={`text-white hover:text-purple-300 flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap shrink-0 ${
        active ? "text-purple-300 font-semibold" : ""
      }`}
    >
      <Icon className="w-4 h-4 sm:w-[1.125rem] sm:h-[1.125rem] shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    apiRequest("/users/me")
      .then((data) => {
        if (mounted) setProfile(data.user);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // no-op
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const careerOn = profile?.features?.careerGuidance;

  return (
    <header className="relative z-10 flex flex-row flex-nowrap items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black rounded-3xl backdrop-blur-sm border-b border-white/70 mb-10 min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 max-w-[40%] sm:max-w-none">
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <span className="text-white font-medium text-sm sm:text-lg md:text-xl truncate hidden sm:inline max-w-[7rem] md:max-w-none">
          {profile?.name || "User"}
        </span>
      </div>

      <nav
        className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0 justify-center overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Main navigation"
      >
        <NavButton
          to="/landing"
          label="Home"
          Icon={Home}
          active={location.pathname === "/landing"}
          onNavigate={navigate}
        />
        <NavButton
          to="/summary"
          label="Summary"
          Icon={Sparkles}
          active={location.pathname === "/summary"}
          onNavigate={navigate}
        />
        <NavButton
          to="/game-progress"
          label="Progress"
          Icon={BarChart3}
          active={location.pathname === "/game-progress"}
          onNavigate={navigate}
        />
        {careerOn && (
          <>
            <NavButton
              to="/career-quiz"
              label="Quiz"
              Icon={ClipboardList}
              active={location.pathname === "/career-quiz"}
              onNavigate={navigate}
            />
            <NavButton
              to="/career-roadmap"
              label="Roadmap"
              Icon={Route}
              active={location.pathname === "/career-roadmap"}
              onNavigate={navigate}
            />
          </>
        )}
        <NavButton
          to="/leaderboard"
          label="Leaderboard"
          Icon={Award}
          active={location.pathname === "/leaderboard"}
          onNavigate={navigate}
        />
      </nav>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="w-10 h-5 sm:w-12 sm:h-6 bg-purple-600 rounded-full relative hidden sm:block">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform" />
        </div>
        <img src={Robot} alt="" className="w-8 h-8 sm:w-10 sm:h-10 hidden sm:block" />
        <button
          type="button"
          onClick={handleLogout}
          className="text-white bg-red-500 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl hover:bg-red-600 transition text-xs sm:text-sm whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
