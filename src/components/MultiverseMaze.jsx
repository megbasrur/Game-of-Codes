import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useRegisterGameStarted } from "../hooks/useRegisterGameStarted";

const MAZE_GAME_ID = "multiverse-maze";
const MAZE_POINTS = 75;

export default function MultiverseMaze() {
  const navigate = useNavigate();
  const { planetId } = useParams();
  useRegisterGameStarted(MAZE_GAME_ID);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [move, setMove] = useState(false);
  const progressSubmittedRef = useRef(false);

  const levels = [
    {
      title: "Maze 1: Entry gate",
      story: "You reach a gate that opens only in stable conditions.",
      condition: "temperature < 50 && oxygenLevel > 60",
      answer: "ENTER",
    },
    {
      title: "Maze 2: Flooded path",
      story: "The path is flooded and risky.",
      condition: "waterLevel > 70 || oxygenLevel < 30",
      answer: "AVOID",
    },
    {
      title: "Maze 3: Storm decision",
      story: "If wind speed is over 80, wait; otherwise keep moving.",
      condition: "windSpeed > 80 → WAIT, else MOVE",
      answer: "WAIT",
    },
    {
      title: "Maze 4: Safe zone",
      story: "A calm and safe path appears.",
      condition: "temperature < 40 && oxygenLevel > 70",
      answer: "ENTER",
    },
    {
      title: "Final maze: Escape",
      story: "A collapsing universe forces a final decision.",
      condition: "energyLevel > 90 || gravity < 20",
      answer: "ESCAPE",
    },
  ];

  const current = levels[level];

  useEffect(() => {
    if (!output.startsWith("🎉") || progressSubmittedRef.current) return;
    progressSubmittedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        await apiRequest(`/progress/${MAZE_GAME_ID}/complete`, {
          method: "POST",
          body: JSON.stringify({ score: MAZE_POINTS, completed: true }),
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
      const newScore = score + 15;
      setScore(newScore);
      setOutput(`✅ Correct! You chose: ${current.answer}`);
      setMove(true);

      setTimeout(() => {
        setMove(false);
        if (level < levels.length - 1) {
          setLevel((l) => l + 1);
          setCode("");
          setOutput("");
        } else {
          setOutput(`🎉 You escaped the maze! Final score: ${newScore}`);
        }
      }, 2000);
    } else {
      setOutput(
        "❌ Wrong path! Use if-else and print the correct action in System.out.println."
      );
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
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#0d0221] via-[#1A0C3F] to-[#0d0221] text-white p-4 md:p-8 flex flex-col items-center">
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/20 bg-black/40 p-6 shadow-2xl">
        <button
          type="button"
          className="absolute top-4 right-4 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold hover:bg-red-700"
          onClick={exitGame}
        >
          Exit
        </button>

        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 pr-20">
          Multiverse Maze
        </h1>
        <p className="text-purple-200 text-sm mb-4">
          Navigate each reality with Java-style if-else—print ENTER, AVOID, WAIT,
          MOVE, or ESCAPE as the maze demands.
        </p>

        <div className="text-amber-200 text-sm mb-4">⭐ Score: {score}</div>

        <h2 className="text-lg font-bold text-cyan-200 mb-3">{current.title}</h2>

        <div className="rounded-xl bg-amber-100/95 text-gray-900 p-4 mb-3 text-left text-sm">
          <p className="font-medium">{current.story}</p>
          <p className="mt-2">
            <strong>Condition / rule:</strong>{" "}
            <code className="bg-white/80 px-1 rounded text-xs">{current.condition}</code>
          </p>
        </div>

        <div className="rounded-xl bg-sky-100/90 text-gray-900 p-3 mb-3 text-left text-xs md:text-sm">
          <p className="font-semibold mb-1">Your task</p>
          <p>
            Use <code className="bg-white/70 px-1 rounded">if</code> and{" "}
            <code className="bg-white/70 px-1 rounded">else</code>. When the
            condition matches this level&apos;s rule, print{" "}
            <strong>{current.answer}</strong> with{" "}
            <code className="bg-white/70 px-1 rounded">System.out.println(&quot;…&quot;);</code>
          </p>
          <pre className="whitespace-pre-wrap font-mono mt-2 text-[11px] md:text-xs bg-white/50 p-2 rounded">{`if (/* your condition */) {
    System.out.println("${current.answer}");
} else {
    System.out.println("OTHER");
}`}</pre>
        </div>

        <div className="rounded-xl bg-emerald-100/90 text-gray-900 p-3 mb-4 text-left text-xs overflow-x-auto">
          <p className="font-semibold mb-2">Nested decisions (hint)</p>
          <pre className="whitespace-pre-wrap font-mono">{`int marks = 85;
boolean project = true;
if (marks > 80) {
    if (project) {
        System.out.println("Excellent");
    } else {
        System.out.println("Good");
    }
} else {
    System.out.println("Needs improvement");
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
            Move
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

        <div className="relative mt-6 h-36 rounded-xl bg-gradient-to-b from-indigo-950 to-black overflow-hidden border border-purple-500/30">
          <div
            className={`absolute bottom-4 left-3 text-3xl transition-transform duration-[2000ms] ease-in-out ${
              move ? "translate-x-[min(52vw,220px)]" : "translate-x-0"
            }`}
          >
            🧑‍🚀
          </div>
          <div className="absolute bottom-4 right-4 text-3xl">🚪</div>
          <div
            className="absolute top-8 left-[18%] w-[28%] h-2 bg-gray-600 rounded"
            aria-hidden
          />
          <div
            className="absolute top-8 left-[42%] w-2 h-20 bg-gray-600 rounded"
            aria-hidden
          />
          <div
            className="absolute top-[4.5rem] left-[55%] w-[22%] h-2 bg-gray-600 rounded"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
