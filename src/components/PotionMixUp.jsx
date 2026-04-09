import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useRegisterGameStarted } from "../hooks/useRegisterGameStarted";

const POTION_GAME_ID = "potion-mix-up";
const POTION_POINTS = 45;

const PotionMixUp = () => {
  const navigate = useNavigate();
  const { planetId } = useParams();
  useRegisterGameStarted(POTION_GAME_ID);

  /* ---------------- STATE ---------------- */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [gameComplete, setGameComplete] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const [potionProgress, setPotionProgress] = useState([0, 0, 0, 0, 0]);

  // ⭐ NEW: animation trigger
  const [animateBeaker, setAnimateBeaker] = useState(null);

  const progressSubmittedRef = useRef(false);

  /* ---------------- POTIONS ---------------- */
  const potions = [
    { name: "Strength", emoji: "🧪" },
    { name: "Wisdom", emoji: "🔮" },
    { name: "Speed", emoji: "⚡" },
    { name: "Healing", emoji: "💚" },
    { name: "Fire", emoji: "🔥" }
  ];

  /* ---------------- QUESTIONS ---------------- */
  const problems = [
    {
      desc: "Store the sum of mana and health in total",
      buggy: "int mana = 10;\nint health = 20;\nint total = ;",
      fixed: "int mana = 10;\nint health = 20;\nint total = mana + health;",
      hint: "Add both variables"
    },
    {
      desc: "Multiply power by 2 and store in result",
      buggy: "int power = 5;\nint result = ;",
      fixed: "int power = 5;\nint result = power * 2;",
      hint: "Use multiplication"
    },

    {
      desc: "Subtract 30 from energy",
      buggy: "int energy = 100;\nint left = ;",
      fixed: "int energy = 100;\nint left = energy - 30;",
      hint: "Use subtraction"
    },
    {
      desc: "Divide gold equally among 2",
      buggy: "int gold = 50;\nint each = ;",
      fixed: "int gold = 50;\nint each = gold / 2;",
      hint: "Use division"
    },

    {
      desc: "Add speed and bonus",
      buggy: "int speed = 20;\nint bonus = 5;\nint total = ;",
      fixed: "int speed = 20;\nint bonus = 5;\nint total = speed + bonus;",
      hint: "Add both"
    },
    {
      desc: "Multiply damage by 3",
      buggy: "int damage = 7;\nint total = ;",
      fixed: "int damage = 7;\nint total = damage * 3;",
      hint: "Multiply"
    },

    {
      desc: "Fix invalid variable name",
      buggy: "int 1health = 100;",
      fixed: "int health1 = 100;",
      hint: "Variable names cannot start with numbers"
    },
    {
      desc: "Fix invalid variable naming",
      buggy: "int user name = 10;",
      fixed: "int userName = 10;",
      hint: "No spaces allowed"
    },

    {
      desc: "Add fire and wind power",
      buggy: "int fire = 10;\nint wind = 5;\nint total = ;",
      fixed: "int fire = 10;\nint wind = 5;\nint total = fire + wind;",
      hint: "Add both"
    },
    {
      desc: "Multiply level by 10",
      buggy: "int level = 3;\nint xp = ;",
      fixed: "int level = 3;\nint xp = level * 10;",
      hint: "Multiply"
    }
  ];

  const getCurrent = () => problems[currentIndex];

  useEffect(() => {
    if (getCurrent()) {
      setUserCode(getCurrent().buggy);
      setShowHint(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!gameComplete || progressSubmittedRef.current) return;
    progressSubmittedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        await apiRequest(`/progress/${POTION_GAME_ID}/complete`, {
          method: "POST",
          body: JSON.stringify({ score: POTION_POINTS, completed: true }),
        });
      } catch {
        if (!cancelled) progressSubmittedRef.current = false;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gameComplete]);

  /* ---------------- CHECK ---------------- */
  const checkCode = () => {
    const normalize = (s) => s.trim().replace(/\s+/g, " ");

    if (normalize(userCode) === normalize(getCurrent().fixed)) {
      const potionIndex = Math.floor(currentIndex / 2);

      setPotionProgress((prev) => {
        const updated = [...prev];
        updated[potionIndex] += 1;

        // ⭐ trigger animation when FULL
        if (updated[potionIndex] === 2) {
          setAnimateBeaker(potionIndex);
          setTimeout(() => setAnimateBeaker(null), 400);
        }

        return updated;
      });

      setFeedback("✨ Potion brewing...");

      setTimeout(() => {
        if (currentIndex < problems.length - 1) {
          setCurrentIndex((i) => i + 1);
          setFeedback("");
        } else {
          setGameComplete(true);
          setFeedback("🧙 All potions complete!");
        }
      }, 1200);
    } else {
      setFeedback("❌ Try again!");
    }
  };

  const resetGame = () => {
    progressSubmittedRef.current = false;
    setCurrentIndex(0);
    setPotionProgress([0, 0, 0, 0, 0]);
    setGameComplete(false);
    setUserCode(problems[0].buggy);
    setFeedback("");
  };

  return (
    <>
      {/* 🧙 INSTRUCTIONS */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-purple-200 w-[520px] p-8 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">🧪 Potion Mix-Up</h2>

            {/* ✅ ADDED DESCRIPTION */}
            <p className="mb-4 font-semibold">
              Welcome to the Fairytale Forest!  
              Learn variables, arithmetic operations, and naming rules by brewing magical potions.
            </p>

            <ul className="text-left mb-6">
              <li>• Each potion needs 2 steps</li>
              <li>• First correct = half filled</li>
              <li>• Second correct = fully brewed ✨</li>
            </ul>

            <button
              onClick={() => setShowInstructions(false)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg"
            >
              Start Brewing ✨
            </button>
          </div>
        </div>
      )}

      <div className="h-screen w-screen flex">

        {/* LEFT SIDE */}
        <div className="w-1/2 bg-gradient-to-b from-purple-900 to-indigo-800 flex items-center justify-center relative">
          <div className="grid grid-cols-3 gap-6">
            {potions.map((p, i) => {
              const count = potionProgress[i] || 0;

              return (
                <div
                  key={i}
                  className={`relative w-24 h-32 border-2 rounded-xl overflow-hidden flex flex-col items-center justify-end transition-transform duration-300
                  ${animateBeaker === i ? "scale-110" : ""}`}
                >
                  {/* Fill */}
                  <div
                    className="absolute bottom-0 left-0 w-full bg-green-400 transition-all duration-500"
                    style={{
                      height:
                        count === 2 ? "100%" :
                        count === 1 ? "50%" : "0%",
                      opacity: count === 0 ? 0 : 0.8
                    }}
                  />

                  {/* Glow only full */}
                  {count === 2 && (
                    <div className="absolute inset-0 shadow-[0_0_25px_#4ade80]" />
                  )}

                  <div className="text-4xl z-10">{p.emoji}</div>
                  <p className="text-white text-sm z-10 mb-2">
                    {p.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 bg-gray-900 text-white flex flex-col relative">

          <button
            onClick={() => navigate(`/planet/${planetId}`)}
            className="absolute top-4 right-4 bg-red-500 px-4 py-2 rounded"
          >
            Exit
          </button>

          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Potion Mix-Up</h2>

            {/* ✅ DESCRIPTION STILL HERE */}
            {!gameComplete && (
              <div className="mt-5 p-3 bg-purple-800/60 rounded">
                🎯 {getCurrent().desc}
              </div>
            )}
          </div>

          <div className="p-4 flex-1">
            {!gameComplete ? (
              <>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-64 bg-gray-800 p-3 text-green-400 font-mono"
                />

                {/* ✅ HINT TAB (UNCHANGED STYLE) */}
                <div className="mt-4 bg-gray-800 p-3 rounded">
                  <h3 className="text-yellow-400">💡 Hint</h3>
                  {showHint ? (
                    <p>{getCurrent().hint}</p>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="bg-yellow-500 px-3 py-1 rounded text-black"
                    >
                      Show Hint
                    </button>
                  )}
                </div>

                <button
                  onClick={checkCode}
                  className="mt-4 bg-blue-600 px-6 py-2 rounded"
                >
                  Brew Potion
                </button>

                <p className="mt-3">{feedback}</p>
              </>
            ) : (
              <div className="text-center mt-20">
                <div className="text-6xl mb-4">🧙‍♀️✨</div>
                <h2 className="text-3xl text-purple-300">
                  Master Alchemist!
                </h2>
                <button
                  onClick={resetGame}
                  className="mt-6 bg-green-600 px-6 py-2 rounded"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PotionMixUp;