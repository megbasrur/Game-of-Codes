import React from 'react';
import { Play, User, Home, Award, Star, Trophy, Zap, ChevronRight } from 'lucide-react';
import Mario from '../assets/mario.png';
import Captain from '../assets/captain.png';
import Darth from '../assets/darth.png';
import Robot from '../assets/robot.png';

// Example language images
import JavaIcon from '../assets/java.png';
import PythonIcon from '../assets/python.png';
import HTMLIcon from '../assets/html.png';
import CSSIcon from '../assets/css.png';
import MLIcon from '../assets/ml.png';
import FlaskIcon from '../assets/flask.png';
import JSIcon from '../assets/js.png';

import { useNavigate } from 'react-router-dom';

export default function GamingLearningPlatform() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem("accessToken");

    fetch("https://game-of-codes.onrender.com/gameofcodes/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Logout response:", data);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);
        localStorage.removeItem("accessToken");
        navigate("/");
      });
  };

  const skillLevels = [
    {
      id: 1,
      level: 'Beginner',
      character: Mario,
      skills: [
        { name: 'Java', path: '/java', image: JavaIcon },
        { name: 'Python', path: '/landing', image: PythonIcon },
      ],
      colors: 'from-purple-800 via-indigo-700 to-pink-500',
      groupImage: Mario,
    },
    {
      id: 2,
      level: 'Intermediate',
      character: Captain,
      skills: [
        { name: 'HTML', path: '/landing', image: HTMLIcon },
        { name: 'CSS', path: '/landing', image: CSSIcon },
        { name: 'JS', path: '/landing', image: JSIcon },
      ],
      colors: 'from-purple-800 via-indigo-700 to-pink-500',
      groupImage: Captain,
    },
    {
      id: 3,
      level: 'Advanced',
      character: Darth,
      skills: [
        { name: 'ML', path: '/landing', image: MLIcon },
        { name: 'Flask', path: '/landing', image: FlaskIcon },
      ],
      colors: 'from-purple-800 via-indigo-700 to-pink-500',
      groupImage: Darth,
    }
  ];

  return (
    <div className="w-screen min-h-screen relative overflow-hidden p-8">
      {/* Galaxy Background */}
      <div
        className="absolute w-full h-full top-0 left-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, #2B0B5A 0%, #1A0C3F 60%), 
                       linear-gradient(135deg, #2F2F6F 0%, #6B6CD9 70%, #A44EFF 100%)`,
        }}
      ></div>

      {/* Soft Nebula / Glow Shapes */}
      <div className="absolute w-3/5 h-3/5 top-10 left-20 bg-purple-500/50 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute w-2/5 h-2/5 bottom-10 right-10 bg-pink-500/40 rounded-full filter blur-3xl animate-pulse"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 bg-black rounded-3xl backdrop-blur-sm border-b border-white/70 mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-medium text-xl">UserName</span>
        </div>
        <nav className="flex items-center space-x-8">
          <button className="text-white hover:text-purple-300 flex items-center gap-2">
            <Home className="w-6 h-6" /> Home
          </button>
          <button className="text-white hover:text-purple-300 flex items-center gap-2">
            <Award className="w-6 h-6" /> Leaderboard
          </button>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-6 bg-purple-600 rounded-full relative">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
          </div>
          <img src={Robot} alt="Robot" className="w-10 h-10" />
        </div>
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Achievement Banner */}
      <div className="mb-8 flex justify-center">
        <div className="bg-gradient-to-r border-2 from-purple-700 to-pink-500 rounded-lg p-4 flex items-center justify-between w-full max-w-6xl shadow-lg animate-pulse">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-300" />
            <span className="text-white font-bold text-2xl">
              You reached Level 3! Click to see rewards
            </span>
          </div>
          <Trophy className="w-10 h-10 text-yellow-300" />
        </div>
      </div>

      {/* ── CAREER ROADMAP QUIZ BANNER ─────────────────────────── */}
      <div className="relative z-10 mb-10 max-w-6xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl border border-purple-500/40 shadow-2xl shadow-purple-900/50 cursor-pointer group"
          onClick={() => navigate('/career-quiz')}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(88,28,135,0.85) 0%, rgba(109,40,217,0.7) 40%, rgba(219,39,119,0.6) 100%)',
            }}
          />
          {/* Animated glow orb */}
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -bottom-6 left-12 w-36 h-36 bg-purple-500/25 rounded-full blur-2xl pointer-events-none" />

          {/* Starfield dots */}
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.3,
                animation: `twinkle ${2 + Math.random() * 3}s ${Math.random() * 2}s ease-in-out infinite`,
              }}
            />
          ))}

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7">
            {/* Left: icon + text */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-700/50 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold tracking-widest text-purple-300 font-mono uppercase">New Feature</span>
                  <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full font-mono">ML-Powered</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                  Discover Your Career Path
                </h3>
                <p className="text-purple-200/70 text-sm mt-1 max-w-md leading-relaxed">
                  Take a 25-question RIASEC assessment. Our AI matches you to the perfect tech career and tells you exactly which course to start first.
                </p>
              </div>
            </div>

            {/* Right: stats + CTA */}
            <div className="flex flex-col items-center md:items-end gap-4 flex-shrink-0">
              <div className="flex gap-3">
                {[["25","Questions"],["15","Careers"],["4","Courses"]].map(([val, lbl]) => (
                  <div key={lbl} className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-center backdrop-blur-sm">
                    <div className="text-lg font-extrabold text-white font-mono leading-none">{val}</div>
                    <div className="text-xs text-purple-300/70 mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 bg-white text-purple-900 font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-purple-50 transition-all group-hover:scale-105 duration-200 text-sm whitespace-nowrap">
                Start Assessment
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ── END CAREER ROADMAP QUIZ BANNER ─────────────────────── */}

      {/* Skill Level Rows */}
      <div className="space-y-12 relative z-10">
        {skillLevels.map((level) => (
          <div key={level.id} className="flex items-start gap-6">

            {/* Level Div */}
            <div
              className={`relative w-15 h-70 bg-black rounded-4xl flex items-center border-1 border-gray-400 justify-center text-white font-bold shadow-lg`}
            >
              <span className="transform -rotate-90 text-3xl translate-y-4 -translate-x-1">{level.level}</span>
              <img
                src={level.character}
                alt={level.level}
                className="w-12 h-12 absolute top-3 right-1 rounded-full shadow"
              />
            </div>

            {/* Skill Cards */}
            <div className="flex gap-6 flex-wrap">
              {level.skills.map((skill, index) => (
                <div
                  key={index}
                  className="w-sm h-70 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                  onClick={() => navigate(skill.path)}
                >
                  {/* Top Half - Custom Image */}
                  <div className="w-full h-1/2 flex items-center justify-center">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                  </div>

                  {/* Bottom Half - Info */}
                  <div className="w-full h-1/2 flex flex-col items-center justify-center space-y-2 p-3">
                    <span className="text-white font-bold text-xl">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-yellow-300 bg-gray-700 px-2 py-1 rounded-full">Level 3</span>
                      <span className="text-sm text-green-300 bg-gray-700 px-2 py-1 rounded-full">150 pts</span>
                    </div>
                    <div className="mt-2">
                      <button className="bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg">
                        <Play className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.5; }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
    </div>
  );
}
