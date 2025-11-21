import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Planet1 from '../assets/beachplanet.png';
import Planet2 from '../assets/treasureplanet.png';
import Planet3 from '../assets/fairyplanet.png';
import Planet5 from '../assets/heroplanet2.png';
import Planet6 from '../assets/castle4.png';

export default function LanguagePage({ name, description }) {

  const orbitImages = [Planet1, Planet2, Planet3, Planet5, Planet6];
  const orbitRadius = 265;
  const orbitDuration = "20s";
  const navigate = useNavigate();

  const numberOfStars = 100;
  const stars = Array.from({ length: numberOfStars }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 2 + 1}s`,
  }));

  const handlePlanetClick = (index) => {
    navigate(`/planet/${index}`);
  };

  return (
    <div className="w-screen min-h-screen relative overflow-hidden">
      {/* Galaxy Background - NO CHANGE */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, #2B0B5A 0%, #1A0C3F 60%), 
                       linear-gradient(135deg, #2F2F6F 0%, #6B6CD9 70%, #A44EFF 100%)`,
        }}
      ></div>

      {/* Nebula / Glow Shapes - NO CHANGE */}
      <div className="absolute w-3/5 h-3/5 top-10 left-20 bg-purple-500/50 rounded-full filter blur-3xl animate-pulse opacity-80"></div>
      <div className="absolute w-2/5 h-2/5 bottom-10 right-10 bg-pink-500/40 rounded-full filter blur-3xl animate-pulse opacity-80 animation-delay-2s"></div>
      
      {/* 🚀 NEW: Twinkling Stars Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map(star => (
          <div
            key={star.id}
            className="twinkling-star" // CSS class defined below
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration,
            }}
          ></div>
        ))}
      </div>
      
      {/* Neon Orbit Path (Static, behind planets) - NO CHANGE */}
      <div 
        className="absolute flex items-center justify-center z-0"
        style={{
          width: `${orbitRadius * 2}px`, // Diameter
          height: `${orbitRadius * 2}px`, // Diameter
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Center it perfectly
          borderRadius: '50%',
          border: '1px solid rgba(139, 92, 246, 0.4)', // Subtle purple border
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.6)', // Glowing effect
          pointerEvents: 'none', // Make it non-interactive
        }}
      ></div>

      {/* Centered Language Name - NO CHANGE */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-white mt-70">
        <h1 className="text-5xl font-bold">{name}</h1>
        <p className="text-md text-pink-300 mt-4 w-90 text-center">{description}</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        {orbitImages.map((img, index) => {
          const angle = (360 / orbitImages.length) * index;
          const animationName = `spin-slow-${index}`;

          return (
            <motion.img
              key={index}
              src={img}
              layoutId={`planet-${index}`}
              className="absolute cursor-pointer w-55 h-45"
              onClick={() => handlePlanetClick(index)}
              style={{
                transform: `rotate(${angle}deg) translateX(${orbitRadius}px) rotate(-${angle}deg)`,
                animation: `${animationName} ${orbitDuration} linear infinite`,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{
    layout: { duration: 1.7, ease: "easeInOut" },  // ⭐ slower click animation
  }}
            />
          );
        })}
      </div>

      <style>
        {`
          ${orbitImages
            .map((_, index) => {
              const angle = (360 / orbitImages.length) * index;
              return `
                @keyframes spin-slow-${index} {
                  0% { transform: rotate(${angle}deg) translateX(${orbitRadius}px) rotate(-${angle}deg); }
                  100% { transform: rotate(${angle + 360}deg) translateX(${orbitRadius}px) rotate(-${angle + 360}deg); }
                }
              `;
            })
            .join("")}

          @keyframes twinkle {
            0%, 100% { opacity: 0.2; box-shadow: 0 0 3px #fff; }
            50% { opacity: 1; box-shadow: 0 0 8px #fff; }
          }

          .twinkling-star {
            position: absolute;
            background: #ffffff;
            border-radius: 50%;
            opacity: 0.2;
            animation-name: twinkle;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
