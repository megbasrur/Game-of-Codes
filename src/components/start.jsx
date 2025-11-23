import React from "react";
import Bg from "../assets/bg.png";
import Robot from "../assets/robot.png";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center justify-center">
          {/* Robot */}
          <img
            src={Robot}
            alt="Robot"
            className="w-65 h-65 relative -mb-10 z-0"
          />

          {/* Title */}
          <h1 className="relative z-10 text-8xl md:text-7xl font-bold tracking-widest text-white drop-shadow-lg font-mono text-center">
            Game <span className="text-purple-500">Of</span> Codes
          </h1>

          {/* Buttons */}
          <div className="mt-8 flex gap-6">
            
            {/* Get Started → Signup */}
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 bg-purple-600 text-white font-bold rounded-md shadow-lg hover:bg-purple-700 transition transform hover:scale-105"
            >
              Get Started
            </button>

            {/* Login */}
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-white text-black font-bold rounded-md shadow-lg hover:bg-gray-200 transition transform hover:scale-105"
            >
              Login
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
