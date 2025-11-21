import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Planet1 from '../assets/beachplanet.png';
import Planet2 from '../assets/treasureplanet.png';
import Planet3 from '../assets/fairyplanet.png';
import Planet5 from '../assets/heroplanet2.png';
import Planet6 from '../assets/castle4.png';

export default function PlanetPage() {
  const { planetId } = useParams();

  const planets = [
    { 
      name: "Syntax Shores", 
      image: Planet1,
      desc: "Learn the basics of Java. Begin with syntax, variables, print functions and data types used.",
      games:[{ name: "Bug Hunt Bay", desc: "Fix simple syntax errors in Java code and help the robot to collect bugs on the beach." },
        { name: "Message in a Bottle", desc: "Use correct code syntax to send a message across the ocean." },
        { name: "Sandcastle Variables", desc: "Declare variables to build stronger sandcastles." }
      ]
    },
    { 
      name: "Variable Valley", 
      image: Planet3,
      desc: "Master variables, operators and expressions through fun challenges.",
      games: ["Potion Mix-up", "Enchanted Math Garden","Talk to the Troll"] 
    },
    { 
      name: "Treasure Island", 
      image: Planet2,
      desc: "Explore loops with treasures, cannons and whirlpools!",
      games: ["Treasure Loop","Cannon Countdown","Escape the Whirlpool"] 
    },
    { 
      name: "Choices Multiverse", 
      image: Planet5,
      desc: "Learn if-else conditions by exploring powerful choices across realities.",
      games: ["Hero's Dilemma", "Power Selector","Multiverse Maze"] 
    },
    { 
      name: "Castle of Challenges", 
      image: Planet6,
      desc: "Tackle advanced logic puzzles inside the castle.",
      games: ["Drawbridge Logic", "Knight's Quest","Armory Sort"] 
    }
  ];

  const planet = planets[planetId];

  const [typedText, setTypedText] = useState("");
  const fullText = `Welcome to ${planet.name}!`;

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(typingInterval);
    }, 70);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center pt-32 text-white relative overflow-hidden">

      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at 30% 30%, #2B0B5A 0%, #1A0C3F 60%),
                       linear-gradient(135deg, #2F2F6F 0%, #6B6CD9 70%, #A44EFF 100%)`,
        }}
      />

        
      {/* ⭐ Planet that flew in */}
      <motion.img
        src={planet.image}
        layoutId={`planet-${planetId}`}
        className="absolute top-6 left-6 w-20 h-20"
      />

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-center tracking-wide drop-shadow-2xl min-h-[70px]"
      >
        {typedText}
        <span className="animate-pulse">|</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-6 text-xl text-center max-w-3xl text-white/90"
      >
        {planet.desc}
      </motion.p>

      <div className="mt-16 mb-10 w-2/3 flex flex-col gap-6">
        {planet.games.map((game, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 1 + i * 0.2,
            }}
            className="w-full p-6 bg-gradient-to-r from-purple-500/50 to-pink-400/40 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 text-left text-2xl font-semibold opacity-40"
          >
            <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
            <p className="text-lg text-white/80">{game.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
