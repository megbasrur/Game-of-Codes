import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GardenBg from "../assets/garden.png";
import { apiRequest } from "../lib/api";
import { useRegisterGameStarted } from "../hooks/useRegisterGameStarted";

const GARDEN_GAME_ID = "enchanted-math-garden";
const GARDEN_POINTS = 42;

const EnchantedMathGarden = () => {
  const navigate = useNavigate();
  const { planetId } = useParams();
  useRegisterGameStarted(GARDEN_GAME_ID);

  /* ---------------- STATE ---------------- */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [gameComplete, setGameComplete] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const [grownPlants, setGrownPlants] = useState([]);
  const [animatePlant, setAnimatePlant] = useState(null);

  // ⭐ NEW: store flower type per plant
  const [plantFlowers, setPlantFlowers] = useState({});

  const progressSubmittedRef = useRef(false);

  /* ---------------- FLOWERS ---------------- */
  const flowers = ["🌸", "🌷", "🌼", "🌻"];

  const getRandomFlower = () => {
    return flowers[Math.floor(Math.random() * flowers.length)];
  };

  /* ---------------- RANDOM POSITIONS ---------------- */
  const plantPositions = [
    { top: "20%", left: "15%" },
    { top: "60%", left: "20%" },
    { top: "35%", left: "50%" },
    { top: "70%", left: "65%" },
    { top: "25%", left: "75%" },
    { top: "45%", left: "30%" }
  ];

  /* ---------------- PROBLEMS ---------------- */
  const problems = [
    {
      desc: "Calculate total energy after bonus and penalty",
      buggy: "int energy = 40;\nint bonus = 15;\nint penalty = 5;\nint total = ;",
      fixed: "int energy = 40;\nint bonus = 15;\nint penalty = 5;\nint total = energy + bonus - penalty;",
      hint: "Add bonus, subtract penalty"
    },
    {
      desc: "Multiply power with level, then add bonus",
      buggy: "int power = 6;\nint level = 3;\nint bonus = 4;\nint result = ;",
      fixed: "int power = 6;\nint level = 3;\nint bonus = 4;\nint result = power * level + bonus;",
      hint: "Multiply first, then add"
    },
    {
      desc: "Find remaining health after damage and heal",
      buggy: "int health = 90;\nint damage = 35;\nint heal = 10;\nint left = ;",
      fixed: "int health = 90;\nint damage = 35;\nint heal = 10;\nint left = health - damage + heal;",
      hint: "Subtract then add"
    },
    {
      desc: "Divide gold and add bonus coins",
      buggy: "int gold = 120;\nint players = 4;\nint bonus = 3;\nint each = ;",
      fixed: "int gold = 120;\nint players = 4;\nint bonus = 3;\nint each = gold / players + bonus;",
      hint: "Divide first"
    },
    {
      desc: "Apply combo multiplier and subtract defense",
      buggy: "int attack = 8;\nint combo = 5;\nint defense = 6;\nint total = ;",
      fixed: "int attack = 8;\nint combo = 5;\nint defense = 6;\nint total = attack * combo - defense;",
      hint: "Multiply then subtract"
    },
    {
      desc: "Add speed and boost, then double",
      buggy: "int speed = 20;\nint boost = 12;\nint total = ;",
      fixed: "int speed = 20;\nint boost = 12;\nint total = (speed + boost) * 2;",
      hint: "Use brackets"
    }
  ];

  const getCurrent = () => problems[currentIndex];

  /* ---------------- INIT ---------------- */
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
        await apiRequest(`/progress/${GARDEN_GAME_ID}/complete`, {
          method: "POST",
          body: JSON.stringify({ score: GARDEN_POINTS, completed: true }),
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

      // ⭐ assign random flower if not already assigned
      setPlantFlowers((prev) => {
        if (!prev[currentIndex]) {
          return { ...prev, [currentIndex]: getRandomFlower() };
        }
        return prev;
      });

      setGrownPlants((prev) => [...prev, currentIndex]);

      setAnimatePlant(currentIndex);
      setTimeout(() => setAnimatePlant(null), 400);

      setFeedback("🌸 A flower bloomed!");

      setTimeout(() => {
        if (currentIndex < problems.length - 1) {
          setCurrentIndex((i) => i + 1);
          setFeedback("");
        } else {
          setGameComplete(true);
          setFeedback("🌼 Garden complete!");
        }
      }, 1200);
    } else {
      setFeedback("❌ Try again!");
    }
  };

  const resetGame = () => {
    progressSubmittedRef.current = false;
    setCurrentIndex(0);
    setGrownPlants([]);
    setPlantFlowers({});
    setGameComplete(false);
    setUserCode(problems[0].buggy);
    setFeedback("");
  };

  return (
    <>
      {/* 🌸 INSTRUCTIONS */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-green-200 w-[520px] p-8 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">🌿 Enchanted Math Garden</h2>
            <p className="mb-4">
              Solve coding puzzles to grow magical flowers!
            </p>
            <ul className="text-left mb-6">
              <li>• Each correct answer grows one flower 🌸</li>
              <li>• Fix arithmetic and variables</li>
              <li>• Complete all to fill your garden 🌼</li>
            </ul>
            <button
              onClick={() => setShowInstructions(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Start Growing 🌱
            </button>
          </div>
        </div>
      )}

      <div className="h-screen w-screen flex">

        {/* 🌿 LEFT SIDE */}
        <div
          className="w-1/2 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${GardenBg})` }}
        >
          {plantPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{ top: pos.top, left: pos.left }}
            >
              {grownPlants.includes(i) && (
                <div
                  className={`text-4xl transition-all duration-300 ${
                    animatePlant === i ? "scale-125" : "scale-100"
                  }`}
                >
                  {plantFlowers[i] ?? "🌸"}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 💻 RIGHT SIDE */}
        <div className="w-1/2 bg-gray-900 text-white flex flex-col relative">

          <button
            onClick={() => navigate(`/planet/${planetId}`)}
            className="absolute top-4 right-4 bg-red-500 px-4 py-2 rounded"
          >
            Exit
          </button>

          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Enchanted Math Garden</h2>
            {!gameComplete && (
              <div className="mt-2 p-3 bg-green-800/60 rounded">
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
                  className="mt-4 bg-green-600 px-6 py-2 rounded"
                >
                  Grow Flower 🌸
                </button>

                <p className="mt-3">{feedback}</p>
              </>
            ) : (
              <div className="text-center mt-20">
                <div className="text-6xl mb-4">🌸✨</div>
                <h2 className="text-3xl text-green-300">
                  Garden Complete!
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

export default EnchantedMathGarden;