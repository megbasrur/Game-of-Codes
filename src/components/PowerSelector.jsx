import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useRegisterGameStarted } from "../hooks/useRegisterGameStarted";

const POWER_GAME_ID = "power-selector";
const POWER_POINTS = 50;

export default function PowerSelector() {
  const navigate = useNavigate();
  const { planetId } = useParams();
  useRegisterGameStarted(POWER_GAME_ID);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [animate, setAnimate] = useState(false);
  const progressSubmittedRef = useRef(false);

  const levels = [
    {
      title: "Level 1: Fire Enemy",
      enemy: "Enemy is weak to fire",
      condition: "enemyType == 'fire'",
      answer: "FIRE",
    },
    {
      title: "Level 2: Electric Enemy",
      enemy: "Enemy is fast AND electric",
      condition: "enemyFast && enemyElectric",
      answer: "SHIELD",
    },
    {
      title: "Level 3: Ice vs Fire",
      enemy: "Enemy is ice OR water type",
      condition: "enemyIce || enemyWater",
      answer: "FIRE",
    },
    {
      title: "Level 4: Smart Choice",
      enemy: "Enemy is strong AND slow",
      condition: "enemyStrong && enemySlow",
      answer: "SPEED",
    },
    {
      title: "Final Level",
      enemy: "Enemy is strong OR fast",
      condition: "enemyStrong || enemyFast",
      answer: "SHIELD",
    },
  ];

  const current = levels[level];

  useEffect(() => {
    if (!output.startsWith("🎉") || progressSubmittedRef.current) return;
    progressSubmittedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        await apiRequest(`/progress/${POWER_GAME_ID}/complete`, {
          method: "POST",
          body: JSON.stringify({ score: POWER_POINTS, completed: true }),
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
      setOutput(`✅ Correct! Power used: ${current.answer}`);
      setAnimate(true);

      setTimeout(() => {
        setAnimate(false);
        if (level < levels.length - 1) {
          setLevel((l) => l + 1);
          setCode("");
          setOutput("");
        } else {
          setOutput(`🎉 All enemies defeated! Final score: ${newScore}`);
        }
      }, 2500);
    } else {
      setOutput("❌ Wrong power! Use if-else and the correct compound logic.");
    }
  };

  const resetGame = () => {
    progressSubmittedRef.current = false;
    setLevel(0);
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

        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 pr-20">
          Power Selector
        </h1>
        <p className="text-purple-200 text-sm mb-4">
          Use Java-style if-else with <code className="text-purple-100">&amp;&amp;</code> and{" "}
          <code className="text-purple-100">||</code> to pick FIRE, SHIELD, or SPEED.
        </p>

        <div className="text-amber-200 text-sm mb-4">⭐ Score: {score}</div>

        <h2 className="text-lg font-bold text-pink-200 mb-3">{current.title}</h2>

        <div className="rounded-xl bg-amber-100/95 text-gray-900 p-4 mb-3 text-left text-sm">
          <p className="font-medium">{current.enemy}</p>
          <p className="mt-2">
            <strong>Condition:</strong>{" "}
            <code className="bg-white/80 px-1 rounded">{current.condition}</code>
          </p>
        </div>

        <div className="rounded-xl bg-sky-100/90 text-gray-900 p-3 mb-3 text-left text-xs md:text-sm">
          <p>
            Use <code className="bg-white/70 px-1 rounded">if</code> and{" "}
            <code className="bg-white/70 px-1 rounded">else</code>. Print{" "}
            <strong>FIRE / SHIELD / SPEED</strong> with{" "}
            <code className="bg-white/70 px-1 rounded">System.out.println(&quot;...&quot;);</code>
          </p>
        </div>

        <div className="rounded-xl bg-emerald-100/90 text-gray-900 p-3 mb-4 text-left text-xs overflow-x-auto">
          <p className="font-semibold mb-2">Logical operators</p>
          <p>
            <code className="bg-white/70 px-1 rounded">&amp;&amp;</code> (AND) — both true
          </p>
          <p>
            <code className="bg-white/70 px-1 rounded">||</code> (OR) — at least one true
          </p>
          <pre className="whitespace-pre-wrap font-mono mt-2">{`if (age > 18 && hasID) {
    System.out.println("Allowed");
} else {
    System.out.println("Not allowed");
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
            Use power
          </button>
          <button
            type="button"
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-bold hover:bg-gray-500"
            onClick={resetGame}
          >
            Restart
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-black/80 p-3 text-left font-mono text-sm text-lime-300 min-h-[3rem] whitespace-pre-wrap">
          {output || "Console output will appear here…"}
        </div>

        <div className="relative mt-6 h-32 rounded-xl bg-gradient-to-b from-gray-900 to-black overflow-hidden border border-white/10">
          {animate && (
            <div className="power-selector-burst absolute bottom-3 left-2 text-4xl">💥</div>
          )}
          <div className="absolute bottom-3 right-6 text-4xl">👾</div>
        </div>
      </div>

      <style>{`
        @keyframes powerSelectorAttack {
          from { transform: translateX(0); }
          to { transform: translateX(220px); }
        }
        .power-selector-burst {
          animation: powerSelectorAttack 2.5s linear forwards;
        }
      `}</style>
    </div>
  );
}
