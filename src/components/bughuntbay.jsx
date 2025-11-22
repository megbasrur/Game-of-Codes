import React, { useState, useEffect } from 'react';
import Beach from '../assets/beach.png';
import { useNavigate, useParams } from 'react-router-dom';

const DebugBeachGame = () => {
  const navigate = useNavigate();
  const { planetId } = useParams();

  // Game state
  const [currentBugIndex, setCCurrentBugIndex] = useState(0);
  const [collectedBugs, setCollectedBugs] = useState([]);
  const [robotPosition, setRobotPosition] = useState({ x: 50, y: 90 });
  const [cameraY, setCameraY] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');

  // NEW: Instruction Modal State
  const [showInstructions, setShowInstructions] = useState(true);

  // NEW: Hint State
  const [showHint, setShowHint] = useState(false);

  // Bug positions
  const bugs = [
    { id: 1, x: 20, y: 80, emoji: '🐛' },
    { id: 2, x: 80, y: 60, emoji: '🦗' },
    { id: 3, x: 40, y: 50, emoji: '🐞' },
    { id: 4, x: 90, y: 20, emoji: '🦟' },
    { id: 5, x: 25, y: 5, emoji: '🕷️' }
  ];

  // Code problems
const codeProblems = [
    {
      id: 1,
      buggyCode: "System.out.println(\"Hello World\"",
      fixedCode: "System.out.println(\"Hello World\");",
      hint: "Missing closing parenthesis and semicolon",
      description: "Fix the syntax error in the print statement"
    },
    {
      id: 2,
      buggyCode: "int x = 5\nint y = 10\nSystem.out.println(x + y",
      fixedCode: "int x = 5;\nint y = 10;\nSystem.out.println(x + y);",
      hint: "Multiple missing semicolons and closing parenthesis",
      description: "Fix all syntax errors in variable declarations"
    },
    {
      id: 3,
      buggyCode: "public static void greet(String name {\n  System.out.println(\"Hi \" + name);\n}",
      fixedCode: "public static void greet(String name) {\n  System.out.println(\"Hi \" + name);\n}",
      hint: "Missing closing parenthesis in method parameter",
      description: "Fix the method definition"
    },
    {
      id: 4,
      buggyCode: "if (x > 5 {\n  System.out.println(\"big\");\n}",
      fixedCode: "if (x > 5) {\n  System.out.println(\"big\");\n}",
      hint: "Missing closing parenthesis in if condition",
      description: "Fix the if statement"
    },
    {
      id: 5,
      buggyCode: "int[] arr = {1, 2, 3\nSystem.out.println(arr.length);",
      fixedCode: "int[] arr = {1, 2, 3};\nSystem.out.println(arr.length);",
      hint: "Missing closing brace and semicolon",
      description: "Fix the array declaration"
    }
  ];

  const getCurrentProblem = () => codeProblems[currentBugIndex];

  useEffect(() => {
    if (getCurrentProblem()) {
      setUserCode(getCurrentProblem().buggyCode);
    }
    // Reset the hint state when moving to a new problem
    setShowHint(false);
  }, [currentBugIndex]);

  const checkCode = () => {
    const currentProblem = getCurrentProblem();

    const normalizedUserCode = userCode.trim().replace(/\s+/g, ' ');
    const normalizedFixedCode = currentProblem.fixedCode.trim().replace(/\s+/g, ' ');

    if (normalizedUserCode === normalizedFixedCode) {
      const targetBug = bugs[currentBugIndex];

      if (targetBug) {
        setRobotPosition({ x: targetBug.x, y: targetBug.y });

        const scrollAmount = currentBugIndex * 80;
        setCameraY(scrollAmount);

        setCollectedBugs(prev => [...prev, currentBugIndex]);

        setFeedback('🎉 Correct! Bug collected!');

        setTimeout(() => {
          if (currentBugIndex < codeProblems.length - 1) {
            setCCurrentBugIndex(currentBugIndex + 1);
            setFeedback('');
            // The next line is added to reset the hint state for the next problem
            setShowHint(false);
          } else {
            setGameComplete(true);
            setFeedback('🏆 Congratulations! All bugs collected!');
          }
        }, 1500);
      }
    } else {
      setFeedback('❌ Not quite right. Check the hint!');
    }
  };

  const resetGame = () => {
    setCCurrentBugIndex(0);
    setCollectedBugs([]);
    setRobotPosition({ x: 50, y: 80 });
    setCameraY(0);
    setGameComplete(false);
    setUserCode(codeProblems[0].buggyCode);
    setFeedback('');
    setShowHint(false); // Reset hint state on game reset
  };

  return (
    <>
     {/* 🗺️ TREASURE MAP INSTRUCTION MODAL */}
{showInstructions && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-none flex items-center justify-center z-[999]">

    <div
      className="w-[550px] p-8 rounded-[35px] shadow-2xl relative bg-top bg-cover overflow-hidden"
      style={{
        backgroundImage:
          `url('https://cdn.wallpapersafari.com/10/67/hI5kfv.jpg')`,
        border: "6px solid #5c3d1e",
        boxShadow: "0 0 30px rgba(0,0,0,0.6)"
      }}
    >
      {/* --- Overlay to lighten the image --- */}
      <div className="absolute inset-0 bg-white/20 pointer-events-none" />

      {/* --- Content --- */}
      <div className="relative z-10">
        <h2
          className="text-4xl font-extrabold text-center mb-4 text-black drop-shadow-sm"
          style={{ fontFamily: "serif" }}
        >
          🏴‍☠️ Bug Hunt Bay
        </h2>

        <p className="text-black text-lg mb-4 font-bold leading-relaxed">
          Ahoy, young coder!  
          The beach is filled with sneaky bugs hiding inside broken Java code.
          Fix each code snippet to help the robot collect every bug!
        </p>

        <ul className="list-disc list-inside space-y-2 text-black text-md font-semibold mb-6">
          <li>Read the buggy Java code.</li>
          <li>Fix the syntax error(s).</li>
          <li>The robot will walk to the bug and collect it.</li>
          <li>5 bugs = one full treasure recovered!</li>
        </ul>

        <button
          onClick={() => setShowInstructions(false)}
          className="w-full py-3 bg-amber-600 hover:bg-yellow-700 text-white text-xl font-bold rounded-xl shadow-md transition"
        >
          ⚔️ Start Adventure
        </button>
      </div>
    </div>
  </div>
)}


      {/* Main Game */}
      <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
        
        {/* LEFT SIDE - Beach */}
        <div className="w-1/2 relative bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url(${Beach})`,
            backgroundPosition: `center ${50 + cameraY * 0.5}%`,
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="relative w-full h-full">

            {/* Robot */}
            <div
              className="absolute w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-4xl shadow-lg z-10"
              style={{
                left: `${robotPosition.x}%`,
                top: `${robotPosition.y}%`,
                transition: 'all 1s ease-in-out'
              }}
            >
              🤖
            </div>

            {/* Bugs */}
            {bugs.map((bug, index) => (
              <div
                key={bug.id}
                className={`absolute w-12 h-12 flex items-center justify-center text-4xl transition-all duration-500 z-10 ${
                  collectedBugs.includes(index)
                    ? "opacity-0 scale-0"
                    : "opacity-100 scale-100"
                }`}
                style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
              >
                {bug.emoji}
              </div>
            ))}
          </div>

          {/* Top-left game status */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800">Debug Beach</h2>
            <p className="text-sm text-gray-600">
              Bugs Collected: {collectedBugs.length}/{bugs.length}
            </p>
          </div>

          {/* Feedback popup */}
          {feedback && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                            bg-white bg-opacity-95 rounded-lg p-4 shadow-xl text-center max-w-xs z-50">
              <p className="text-lg font-semibold">{feedback}</p>
            </div>
          )}
        </div>


        {/* RIGHT SIDE - Code Editor */}
        <div className="w-1/2 bg-gray-900 text-white flex flex-col relative">

         {/* Exit */}
          <button
            onClick={() => navigate(`/planet/${planetId}`)} // <-- UPDATED NAVIGATION
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition"
          >
            Exit
          </button>

          {/* Header */}
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Bug Hunt Bay</h2>
            {!gameComplete && (
              <div className="mt-2">
                <p className="text-sm text-gray-300">
                  Problem {currentBugIndex + 1} of {codeProblems.length}
                </p>
                <p className="text-sm text-blue-300">
                  {getCurrentProblem()?.description}
                </p>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="flex-1 p-4">
            {!gameComplete ? (
              <>
                <textarea
                  disabled={showInstructions}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-64 bg-gray-800 border border-gray-600 rounded p-3 
                             text-green-400 font-mono text-sm resize-none focus:outline-none 
                             focus:border-blue-400 disabled:bg-gray-700 disabled:text-gray-400"
                />

                <div className="mt-4 p-3 bg-gray-800 rounded">
                  <h3 className="text-yellow-400 font-semibold mb-2">💡 Hint:</h3>
                  {showHint ? (
                    <p className="text-sm text-gray-300">
                      {getCurrentProblem()?.hint}
                    </p>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-1 
                                 rounded text-sm font-bold transition-colors shadow-md"
                      disabled={showInstructions}
                    >
                      Show Hint (Try solving it first!)
                    </button>
                  )}
                </div>

                <button
                  disabled={showInstructions}
                  onClick={checkCode}
                  className={`mt-4 px-6 py-2 rounded font-semibold transition-colors ${
                    showInstructions
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Submit Fix
                </button>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">
                  Game Complete!
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  You've debugged all the code and helped the robot collect all the bugs!
                </p>
                <button
                  onClick={resetGame}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg 
                             font-semibold text-lg transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {!gameComplete && (
            <div className="p-4 bg-gray-800">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(collectedBugs.length / bugs.length) * 100}%`
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Progress: {collectedBugs.length}/{bugs.length} bugs collected
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DebugBeachGame;