import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useRegisterGameStarted } from "../hooks/useRegisterGameStarted";

const HERO_GAME_ID = "heroes-dilemma";
const HERO_POINTS = 50;

export default function HerosDillema() {
  const navigate = useNavigate();
  const { planetId } = useParams();
  useRegisterGameStarted(HERO_GAME_ID);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [scene, setScene] = useState(0);
  const [animateHero, setAnimateHero] = useState(false);
  const [score, setScore] = useState(0);
  const progressSubmittedRef = useRef(false);

  const story = [
    {
      title: "Chapter 1: Chaos Begins",
      problem: "A villain suddenly attacks the city!",
      condition: "enemyNear == true",
      answer: "ATTACK",
    },
    {
      title: "Chapter 2: Save the Innocent",
      problem: "A civilian is about to get hurt!",
      condition: "civilianInDanger == true",
      answer: "SAVE",
    },
    {
      title: "Chapter 3: Tough Choice",
      problem: "Both villain and civilian are present!",
      condition: "enemyNear && civilianInDanger",
      answer: "SAVE",
    },
    {
      title: "Chapter 4: Smart Attack",
      problem: "Villain is weak and hero is strong",
      condition: "enemyWeak && heroHealth > 70",
      answer: "ATTACK",
    },
    {
      title: "Chapter 5: Peace Returns",
      problem: "No threats detected",
      condition: "enemyNear == false",
      answer: "PATROL",
    },
  ];

  const current = story[scene];

  useEffect(() => {
    if (!output.startsWith("🎉") || progressSubmittedRef.current) return;
    progressSubmittedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        await apiRequest(`/progress/${HERO_GAME_ID}/complete`, {
          method: "POST",
          body: JSON.stringify({ score: HERO_POINTS, completed: true }),
        });
      } catch {
        if (!cancelled) progressSubmittedRef.current = false;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [output]);

  const exitGame = () => {
    navigate(`/planet/${planetId ?? "3"}`);
  };

  const runCode = () => {
    const hasIf = code.includes("if");
    const hasElse = code.includes("else");
    const correct = code.includes(current.answer);

    if (hasIf && hasElse && correct) {
      const newScore = score + 10;
      setScore(newScore);
      setOutput(`✅ Correct! You chose to ${current.answer}.`);
      setAnimateHero(true);

      setTimeout(() => {
        setAnimateHero(false);
        if (scene < story.length - 1) {
          setScene((s) => s + 1);
          setCode("");
          setOutput("");
        } else {
          setOutput(`🎉 You saved the city! Final Score: ${newScore}`);
        }
      }, 2500);
    } else {
      setOutput("❌ Wrong decision. Use if-else and the right action (ATTACK, SAVE, or PATROL).");
    }
  };

  const resetGame = () => {
    progressSubmittedRef.current = false;
    setScene(0);
    setCode("");
    setOutput("");
    setScore(0);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#1A0C3F] via-[#2F2F6F] to-[#1A0C3F] text-white p-4 md:p-8 flex flex-col items-center">
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/20 bg-black/40 p-6 shadow-2xl">
        <button
          type="button"
          className="absolute top-4 right-4 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold hover:bg-red-700"
          onClick={exitGame}
        >
          Exit
        </button>

        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 pr-20">Hero&apos;s Dilemma</h1>
        <p className="text-purple-200 text-sm mb-4">Practice Java-style if-else and pick the right action each chapter.</p>

        <div className="text-amber-200 text-sm mb-4">⭐ Score: {score}</div>

        <h2 className="text-lg font-bold text-pink-200 mb-3">{current.title}</h2>

        <div className="rounded-xl bg-amber-100/95 text-gray-900 p-4 mb-3 text-left text-sm">
          <p className="font-medium">{current.problem}</p>
          <p className="mt-2">
            <strong>Condition:</strong> <code className="bg-white/80 px-1 rounded">{current.condition}</code>
          </p>
        </div>

        <div className="rounded-xl bg-sky-100/90 text-gray-900 p-3 mb-3 text-left text-xs md:text-sm">
          <p>
            Use <code className="bg-white/70 px-1 rounded">if</code> and{" "}
            <code className="bg-white/70 px-1 rounded">else</code>. Actions:{" "}
            <strong>ATTACK / SAVE / PATROL</strong> inside <code className="bg-white/70 px-1 rounded">System.out.println(&quot;...&quot;);</code>
          </p>
        </div>

        <div className="rounded-xl bg-emerald-100/90 text-gray-900 p-3 mb-4 text-left text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap font-mono">{`if (enemyNear == true) {
    System.out.println("ATTACK");
} else {
    System.out.println("PATROL");
}`}</pre>
        </div>

        <textarea
          className="w-full h-40 rounded-lg border border-white/20 bg-gray-900/90 p-3 font-mono text-sm text-green-300 placeholder:text-gray-500"
          placeholder="// Write your Java-style code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold hover:bg-orange-500"
            onClick={runCode}
          >
            Execute
          </button>
          <button
            type="button"
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-bold hover:bg-gray-500"
            onClick={resetGame}
          >
            Restart
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-black/80 p-3 text-left font-mono text-sm text-lime-300 min-h-[3rem]">
          {output || "Console output will appear here…"}
        </div>

        <div className="relative mt-6 h-32 rounded-xl bg-gradient-to-b from-gray-900 to-black overflow-hidden border border-white/10">
          {animateHero && (
            <div className="heroes-dilemma-hero-dash absolute bottom-3 left-2 text-4xl">🦸</div>
          )}
          <div className="absolute bottom-3 right-6 text-4xl">🦹</div>
        </div>
      </div>

      <style>{`
        @keyframes heroesDilemmaDash {
          from { transform: translateX(0); }
          to { transform: translateX(220px); }
        }
        .heroes-dilemma-hero-dash {
          animation: heroesDilemmaDash 2.5s linear forwards;
        }
      `}</style>
    </div>
  );
}
