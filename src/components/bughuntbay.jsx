import React, { useState, useEffect } from 'react';
import Beach from '../assets/beach.png';
import {Bot} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const DebugBeachGame = () => {
  const navigate=useNavigate();
  // Game state
  const [currentBugIndex, setCCurrentBugIndex] = useState(0);
  const [collectedBugs, setCollectedBugs] = useState([]);
  const [robotPosition, setRobotPosition] = useState({ x: 50, y: 90 });
  const [cameraY, setCameraY] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Bug positions on the beach - arranged vertically for scrolling progression
  // y values represent distance from top of the entire scrollable area
  const bugs = [
    { id: 1, x: 20, y: 80, collected: false, emoji: '🐛' },
    { id: 2, x: 80, y: 60, collected: false, emoji: '🦗' },
    { id: 3, x: 40, y: 50, collected: false, emoji: '🐞' },
    { id: 4, x: 90, y: 20, collected: false, emoji: '🦟' },
    { id: 5, x: 25, y: 5, collected: false, emoji: '🕷️' }
  ];

  // Code problems to debug
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
  }, [currentBugIndex]);

  const checkCode = () => {
    const currentProblem = getCurrentProblem();
    const normalizedUserCode = userCode.trim().replace(/\s+/g, ' ');
    const normalizedFixedCode = currentProblem.fixedCode.trim().replace(/\s+/g, ' ');
    
    if (normalizedUserCode === normalizedFixedCode) {
      // Correct! Move robot and collect bug
      const targetBug = bugs[currentBugIndex];
      if (targetBug) {
        // Move robot to bug position
        setRobotPosition({ x: targetBug.x, y: targetBug.y });
        
        // Scroll camera to follow robot - more gradual scrolling
        const scrollAmount = currentBugIndex * 80; // Scroll up 80px per bug collected
        setCameraY(scrollAmount);
        
        setCollectedBugs(prev => [...prev, currentBugIndex]);
        setFeedback('🎉 Correct! Bug collected!');
        
        setTimeout(() => {
          if (currentBugIndex < codeProblems.length - 1) {
            setCCurrentBugIndex(currentBugIndex + 1);
            setFeedback('');
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
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Left Half - Beach Scene */}
      <div 
        className="w-1/2 relative bg-gradient-to-b from-blue-300 via-blue-200 to-yellow-200 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${Beach})`,
          backgroundBlendMode: 'overlay',
          backgroundPosition: `center ${50 + cameraY * 0.5}%`, // Parallax effect for background
          transform: `translateY(${cameraY}px)`,
          transition: 'all 1s ease-in-out'
        }}
      >
        {/* Scrollable game world container */}
        <div 
          className="relative w-full h-full" // Use normal height, not 200vh
          style={{
            transform: `translateY(-${cameraY}px)`, // Negative to scroll up
            transition: 'transform 1s ease-in-out'
          }}
        >
          {/* Sun 
          <div className="absolute top-8 right-4 w-16 h-16 bg-yellow-400 rounded-full shadow-lg"></div>*/}
          
          {/* Clouds at different heights 
          <div className="absolute top-16 left-8 w-12 h-6 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-20 left-16 w-8 h-4 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-32 right-20 w-10 h-5 bg-white rounded-full opacity-70"></div>
          <div className="absolute top-48 left-32 w-14 h-7 bg-white rounded-full opacity-60"></div>*/}
          
          {/* Beach/Sand area at bottom 
          <div className="absolute bottom-0 w-full h-32 bg-yellow-300"></div>
          
          {/* Palm trees at different positions 
          <div className="absolute bottom-20 right-8">
            <div className="w-4 h-16 bg-amber-800"></div>
            <div className="absolute -top-2 -left-4 text-4xl">🌴</div>
          </div>
          <div className="absolute" style={{ bottom: '60%', left: '10%' }}>
            <div className="w-3 h-12 bg-amber-800"></div>
            <div className="absolute -top-1 -left-3 text-3xl">🌴</div>
          </div>
          
          {/* Rocks and shells scattered around 
          <div className="absolute text-2xl" style={{ bottom: '30%', left: '20%' }}>🗿</div>
          <div className="absolute text-xl" style={{ bottom: '70%', right: '30%' }}>🐚</div>
          <div className="absolute text-lg" style={{ bottom: '50%', left: '60%' }}>🦀</div>
          
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
                collectedBugs.includes(index) ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`}
              style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
            >
              {bug.emoji}
            </div>
          ))}
        </div>
        
        {/* Game Status */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800">Debug Beach</h2>
          <p className="text-sm text-gray-600">Bugs Collected: {collectedBugs.length}/{bugs.length}</p>
        </div>
        
        {/* Feedback */}
        {feedback && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-95 rounded-lg p-4 shadow-xl text-center max-w-xs">
            <p className="text-lg font-semibold">{feedback}</p>
          </div>
        )}
      </div>
      
      {/* Right Half - Code Editor */}
      <div className="w-1/2 bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Code Debugger</h2>
          {!gameComplete && (
            <div className="mt-2">
              <p className="text-sm text-gray-300">Problem {currentBugIndex + 1} of {codeProblems.length}</p>
              <p className="text-sm text-blue-300">{getCurrentProblem()?.description}</p>
            </div>
          )}
        </div>
        <div>
          {/* Exit Button */}
  <div className="absolute top-4 right-4 z-50">
    <button
      onClick={() => navigate("/landing")}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-colors"
    >
      Exit
    </button>
  </div>

        </div>
        {/* Code Editor */}
        <div className="flex-1 p-4">
          {!gameComplete ? (
            <>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-64 bg-gray-800 border border-gray-600 rounded p-3 text-green-400 font-mono text-sm resize-none focus:outline-none focus:border-blue-400"
                placeholder="Fix the code here..."
              />
              
              <div className="mt-4 p-3 bg-gray-800 rounded">
                <h3 className="text-yellow-400 font-semibold mb-2">💡 Hint:</h3>
                <p className="text-sm text-gray-300">{getCurrentProblem()?.hint}</p>
              </div>
              
              <button
                onClick={checkCode}
                className="mt-4 bg-blue-600 text-blue-400 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors"
              >
                Submit Fix
              </button>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">Game Complete!</h2>
              <p className="text-lg text-gray-300 mb-6">You've debugged all the code and helped the robot collect all the bugs!</p>
              <button
                onClick={resetGame}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
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
                style={{ width: `${(collectedBugs.length / bugs.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Progress: {collectedBugs.length}/{bugs.length} bugs collected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugBeachGame;