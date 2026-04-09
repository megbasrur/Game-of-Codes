import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TrollImg from "../assets/troll.png";
import { apiRequest } from "../lib/api";
import { useRegisterGameStarted } from "../hooks/useRegisterGameStarted";

const TROLL_GAME_ID = "talk-to-troll";
const TROLL_POINTS = 40;

const TalkToTroll = () => {
  const navigate = useNavigate();
  const { planetId } = useParams();
  useRegisterGameStarted(TROLL_GAME_ID);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [gameComplete, setGameComplete] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [trollBounce, setTrollBounce] = useState(false);

  const progressSubmittedRef = useRef(false);

  const problems = [
    {
      desc: "Troll: 'What is the human's name?'",
      buggy:
        'Scanner sc = new Scanner(System.in);\nString name = ;\nSystem.out.println("Hello " + name);',
      fixed:
        'Scanner sc = new Scanner(System.in);\nString name = sc.nextLine();\nSystem.out.println("Hello " + name);',
      hint: "Use Scanner to take input",
    },
    {
      desc: "Troll: 'Say my favorite word: MAGIC!'",
      buggy: "System.out.println();",
      fixed: 'System.out.println("MAGIC");',
      hint: "Print the string",
    },
    {
      desc: "Troll: 'Repeat what I say: I love coding'",
      buggy: "System.out.println();",
      fixed: 'System.out.println("I love coding");',
      hint: "Print exact sentence",
    },
    {
      desc: "Troll: 'What is the human's name and age?'",
      buggy:
        'Scanner sc = new Scanner(System.in);\nString name = ;\nint age = ;\nSystem.out.println( + " is " + );',
      fixed:
        'Scanner sc = new Scanner(System.in);\nString name = sc.nextLine();\nint age = sc.nextInt();\nSystem.out.println(name + " is " + age);',
      hint: "Use nextInt() for age",
    },
  ];

  const getCurrent = () => problems[currentIndex];

  useEffect(() => {
    if (!gameComplete || progressSubmittedRef.current) return;
    progressSubmittedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        await apiRequest(`/progress/${TROLL_GAME_ID}/complete`, {
          method: "POST",
          body: JSON.stringify({ score: TROLL_POINTS, completed: true }),
        });
      } catch {
        if (!cancelled) progressSubmittedRef.current = false;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gameComplete]);

  useEffect(() => {
    if (!getCurrent()) return;
    setUserCode(getCurrent().buggy);
    setShowHint(false);
    setTrollBounce(true);
    const timer = setTimeout(() => setTrollBounce(false), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const checkCode = () => {
    const normalize = (s) => s.trim().replace(/\s+/g, " ");
    if (normalize(userCode) === normalize(getCurrent().fixed)) {
      setFeedback("🧌 Hmm... correct. You may pass.");
      setTimeout(() => {
        if (currentIndex < problems.length - 1) {
          setCurrentIndex((i) => i + 1);
          setFeedback("");
        } else {
          setGameComplete(true);
          setFeedback("🏆 You defeated the troll!");
        }
      }, 1200);
    } else {
      setFeedback("🧌 WRONG! Try again!");
    }
  };

  const resetGame = () => {
    progressSubmittedRef.current = false;
    setCurrentIndex(0);
    setGameComplete(false);
    setUserCode(problems[0].buggy);
    setFeedback("");
  };

  return (
    <>
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-green-200 w-[520px] max-w-[95vw] p-8 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">🧌 Talk to the Troll</h2>
            <p className="mb-4">Answer the troll&apos;s riddles using Java input and output.</p>
            <ul className="text-left mb-6">
              <li>• Use Scanner for input</li>
              <li>• Use System.out.println for output</li>
              <li>• Get all answers right to pass</li>
            </ul>
            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Face the Troll
            </button>
          </div>
        </div>
      )}

      <div className="h-screen w-screen flex">
        <div className="w-1/2 bg-gradient-to-br from-green-800 to-amber-900 flex flex-col items-center justify-center relative">
          <img
            src={TrollImg}
            alt=""
            className={`w-40 md:w-48 lg:w-56 mb-6 ${trollBounce ? "talk-troll-enter" : ""}`}
          />
          <div className="bg-black/60 text-white p-6 rounded-xl max-w-md text-center text-sm md:text-base">
            {getCurrent().desc}
          </div>
        </div>

        <div className="w-1/2 bg-gray-900 text-white flex flex-col relative">
          <button
            type="button"
            onClick={() => navigate(`/planet/${planetId}`)}
            className="absolute top-4 right-4 bg-red-500 px-4 py-2 rounded z-10"
          >
            Exit
          </button>

          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Talk to the Troll</h2>
          </div>

          <div className="p-4 flex-1 overflow-auto">
            {!gameComplete ? (
              <>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-64 bg-gray-800 p-3 text-green-400 font-mono rounded"
                />
                <div className="mt-4 bg-gray-800 p-3 rounded">
                  <h3 className="text-yellow-400">💡 Hint</h3>
                  {showHint ? (
                    <p>{getCurrent().hint}</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowHint(true)}
                      className="bg-yellow-500 px-3 py-1 rounded text-black"
                    >
                      Show Hint
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={checkCode}
                  className="mt-4 bg-green-600 px-6 py-2 rounded"
                >
                  Answer Troll
                </button>
                <p className="mt-3">{feedback}</p>
              </>
            ) : (
              <div className="text-center mt-20">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl text-green-300">Troll Defeated!</h2>
                <button
                  type="button"
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

      <style>{`
        @keyframes talkTrollEnter {
          0% { opacity: 0; transform: translateY(-36px); }
          45% { opacity: 1; transform: translateY(-18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .talk-troll-enter {
          animation: talkTrollEnter 0.65s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default TalkToTroll;
