// src/components/DessertPyramid.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/* Dessert Pyramid component (standalone)
   - paste this file into src/components/DessertPyramid.jsx
   - import & use in any App: import DessertPyramid from './components/DessertPyramid'
*/

/* ---------- Questions (10) ---------- */
const QUESTIONS = [
  { prompt: "Store age = 19. Which Java type?", options: ["int", "double", "String", "boolean"], answer: 0 },
  { prompt: 'Store name = "Kashish". Which type?', options: ["char", "String", "boolean", "double"], answer: 1 },
  { prompt: "Store loggedIn = true. Which type?", options: ["boolean", "String", "int", "float"], answer: 0 },
  { prompt: "Store pi = 3.14159. Which type?", options: ["int", "double", "String", "boolean"], answer: 1 },
  { prompt: "Single character 'A'. Which type?", options: ["String", "char", "boolean", "int"], answer: 1 },
  { prompt: "Large integer (>2 billion). Which type?", options: ["int", "long", "short", "byte"], answer: 1 },
  { prompt: "Array of marks. Which type?", options: ["int[]", "float[]", "int", "String[]"], answer: 0 },
  { prompt: "Price 499.99. Which type?", options: ["double", "int", "String", "char"], answer: 0 },
  { prompt: "Roll number '007' best type?", options: ["int", "String", "float", "double"], answer: 1 },
  { prompt: "True/false values best type?", options: ["String", "boolean", "char", "byte"], answer: 1 },
];

/* ---------- Pyramid config ---------- */
const BRICK_W = 44;
const BRICK_H = 28;
const BRICK_GAP = 6;
const BASE_COLS = 13; // odd
const GROUND_EXTRA = 18;

function computeCapacity(baseCols) {
  let cap = 0;
  let row = 0;
  while (true) {
    const cols = baseCols - row * 2;
    if (cols <= 0) break;
    cap += cols;
    row++;
  }
  return cap;
}
const PYRAMID_CAPACITY = computeCapacity(BASE_COLS);

function computePyramidPositions(bricksCount, baseCols = BASE_COLS) {
  const positions = [];
  let remaining = bricksCount;
  let row = 0;
  while (remaining > 0) {
    const cols = baseCols - row * 2;
    if (cols <= 0) break;
    const take = Math.min(cols, remaining);
    for (let i = 0; i < take; i++) positions.push({ row, col: i, cols });
    remaining -= take;
    row++;
  }
  return positions;
}

/* castle image path (adjust if needed in friend's project) */
const castleUrl = "/mnt/data/f88f619f-5ac9-4fe4-b8f9-619adab7a357.png";

export default function DessertPyramid() {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [bricksCount, setBricksCount] = useState(0);
  const [fallingBricks, setFallingBricks] = useState([]);
  const [health, setHealth] = useState(100);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // modal show after delay so user can admire pyramid
  const [showModal, setShowModal] = useState(false);
  const modalTimerRef = useRef(null);

  // right panel scale
  const rightRef = useRef(null);
  const [scale, setScale] = useState(1);

  const capacity = useMemo(() => PYRAMID_CAPACITY, []);
  const positions = useMemo(() => computePyramidPositions(bricksCount, BASE_COLS), [bricksCount]);

  useEffect(() => {
    function updateScale() {
      const c = rightRef.current;
      if (!c) return;
      const paddingAllowance = 40;
      const containerWidth = c.clientWidth - paddingAllowance;
      const neededWidth = BASE_COLS * BRICK_W + (BASE_COLS - 1) * BRICK_GAP;
      const newScale = Math.min(1, containerWidth / neededWidth);
      setScale(newScale);
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  function clearModalTimer() {
    if (modalTimerRef.current) {
      clearTimeout(modalTimerRef.current);
      modalTimerRef.current = null;
    }
  }
  function scheduleModalDelay() {
    clearModalTimer();
    modalTimerRef.current = setTimeout(() => {
      setShowModal(true);
      modalTimerRef.current = null;
    }, 900);
  }

  // show modal after final answered or pyramid full
  useEffect(() => {
    setShowModal(false);
    const finalAnswered = qIndex === QUESTIONS.length - 1 && selected !== null;
    const pyramidFull = bricksCount >= capacity;
    if (finalAnswered || pyramidFull) scheduleModalDelay();
    else clearModalTimer();
    return () => clearModalTimer();
  }, [qIndex, selected, bricksCount, capacity]);

  // distribute bricks to complete pyramid across remaining questions
  function bricksToAddForCorrect(currentBricks, questionsRemaining) {
    if (questionsRemaining <= 0) return 0;
    const remainingNeeded = Math.max(0, capacity - currentBricks);
    return Math.min(remainingNeeded, Math.ceil(remainingNeeded / questionsRemaining));
  }

  function handleChoose(i) {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === QUESTIONS[qIndex].answer;
    if (correct) {
      setFeedback("✔ Correct — pyramid grows!");
      setCorrectCount((c) => c + 1);
      const questionsRemaining = QUESTIONS.length - qIndex;
      const add = bricksToAddForCorrect(bricksCount, questionsRemaining);
      setBricksCount((b) => Math.min(capacity, b + add));
    } else {
      setFeedback("✖ Wrong — bricks fall!");
      setWrongCount((w) => w + 1);
      setHealth((h) => Math.max(0, h - 20));
      const removeCount = Math.min(3, bricksCount);
      if (removeCount > 0) {
        const toRemove = [];
        for (let k = 0; k < removeCount; k++) toRemove.push(bricksCount - 1 - k);
        setFallingBricks((arr) => [...arr, ...toRemove]);
        setTimeout(() => {
          setBricksCount((b) => Math.max(0, b - removeCount));
          setFallingBricks((arr) => arr.filter((x) => !toRemove.includes(x)));
        }, 700);
      }
    }
  }

  function handleNext() {
    if (selected === null) return;
    if (qIndex + 1 < QUESTIONS.length) {
      setQIndex((n) => n + 1);
      setSelected(null);
      setFeedback("");
    } else {
      setFeedback("🎉 Completed all questions!");
    }
  }

  function handleRestart() {
    setQIndex(0);
    setSelected(null);
    setFeedback("");
    setBricksCount(0);
    setFallingBricks([]);
    setHealth(100);
    setCorrectCount(0);
    setWrongCount(0);
    clearModalTimer();
    setShowModal(false);
  }

  const totalAnswered = correctCount + wrongCount;
  const accuracy = totalAnswered === 0 ? 0 : Math.round((correctCount / totalAnswered) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      margin: 0,
      padding: 18,
      background: "linear-gradient(to bottom,#fff7e6,#fff1d9)",
      color: "#000",
      boxSizing: "border-box",
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
      position: "relative",
      zIndex: 1
    }}>
      {/* Decorative background behind everything (zIndex 0) */}
      <div className="desert-bg" aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 260, zIndex: 0, pointerEvents: "none" }}>
        <svg viewBox="0 0 1400 260" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="dg2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fff9ef" />
              <stop offset="100%" stopColor="#fff0d9" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1400" height="260" fill="url(#dg2)" />
          <path d="M0 140 C120 100 260 150 420 130 C600 110 760 170 920 140 C1080 110 1260 160 1400 140 L1400 220 L0 220 Z" fill="#ffe9b8" opacity="0.95" />
          <path d="M0 170 C160 150 320 190 480 170 C640 150 800 210 960 180 C1120 150 1260 190 1400 170 L1400 220 L0 220 Z" fill="#fff1c9" opacity="0.9" />
          <circle cx="1100" cy="60" r="40" fill="#ffd36b" opacity="0.95" />
          <g transform="translate(80,80)"><rect x="-6" y="18" width="12" height="60" rx="3" fill="#8b5a2b" /><g fill="#2ea044"><ellipse cx="0" cy="6" rx="36" ry="10" /><ellipse cx="-24" cy="-6" rx="20" ry="7" transform="rotate(-25)" /><ellipse cx="24" cy="-6" rx="20" ry="7" transform="rotate(25)" /></g></g>
          <g transform="translate(1260,60) scale(0.9)"><rect x="-6" y="18" width="12" height="60" rx="3" fill="#8b5a2b" /><g fill="#2ea044"><ellipse cx="0" cy="6" rx="36" ry="10" /><ellipse cx="-24" cy="-6" rx="20" ry="7" transform="rotate(-25)" /><ellipse cx="24" cy="-6" rx="20" ry="7" transform="rotate(25)" /></g></g>
        </svg>
      </div>

      {/* Centered app container (zIndex 2 so visible above desert-bg) */}
      <div style={{ width: "95%", maxWidth: 1200, margin: "0 auto", display: "flex", gap: 20, zIndex: 2, position: "relative" }}>
        {/* LEFT: Questions (zIndex 3) */}
        <div style={{
          flex: "1 1 0",
          background: "#fff",
          border: "2px solid #000",
          borderRadius: 10,
          padding: 22,
          boxSizing: "border-box",
          minHeight: 520,
          overflowY: "auto",
          position: "relative",
          zIndex: 3
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h1 style={{ margin: 0, fontSize: 26 }}>🍰 Dessert Pyramid — Learn Java Types</h1>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Health: {health}%</div>
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Question {qIndex + 1} / {QUESTIONS.length}</div>
            <div style={{ fontSize: 14 }}>Bricks: {bricksCount} / {capacity}</div>
          </div>

          <p style={{ fontSize: 20, marginTop: 12 }}>{QUESTIONS[qIndex].prompt}</p>

          <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
            {QUESTIONS[qIndex].options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = selected !== null && i === QUESTIONS[qIndex].answer;
              return (
                <button key={i} onClick={() => handleChoose(i)} disabled={selected !== null}
                  style={{
                    padding: "12px 14px",
                    fontSize: 18,
                    textAlign: "left",
                    borderRadius: 8,
                    border: "2px solid #000",
                    background: isSelected ? (isCorrect ? "#dff7df" : "#ffd6d6") : "#fff",
                    cursor: selected === null ? "pointer" : "default",
                    color: "#000",
                  }}>
                  {opt}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 18 }}>
            <button onClick={handleRestart} style={{ padding: "10px 16px", fontSize: 16, borderRadius: 8, border: "2px solid #000", background: "#ffd6d6", cursor: "pointer" }}>
              Restart
            </button>

            <div style={{ flex: 1, textAlign: "center", fontWeight: 700 }}>{feedback}</div>

            <button onClick={handleNext} disabled={selected === null} style={{ padding: "10px 16px", fontSize: 16, borderRadius: 8, border: "2px solid #000", background: selected === null ? "#ccc" : "#ff9d2b", cursor: selected === null ? "not-allowed" : "pointer", color: "#000" }}>
              Next
            </button>
          </div>

          <div style={{ marginTop: 16, fontSize: 14 }}>
            Tip: Answer remaining questions correctly to finish the full pyramid.
          </div>
        </div>

        {/* RIGHT: Pyramid (panel-bg inside this panel) */}
        <div ref={rightRef} style={{
          flex: "1 1 0",
          borderRadius: 10,
          padding: 16,
          boxSizing: "border-box",
          minHeight: 520,
          position: "relative",
          overflow: "hidden",
          background: "transparent",
          border: "2px solid #000",
          zIndex: 3
        }}>
          {/* panel-bg - dunes + castle + palms inside panel (zIndex 0) */}
          <div className="panel-bg" aria-hidden style={{
            position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
            zIndex: 0, pointerEvents: "none", overflow: "hidden",
          }}>
            <svg viewBox="0 0 1400 260" preserveAspectRatio="none" style={{ width: "100%", height: "40%", display: "block" }}>
              <defs>
                <linearGradient id="panelDg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fff9ef" />
                  <stop offset="100%" stopColor="#fff0d9" />
                </linearGradient>
              </defs>
              <rect width="1400" height="260" fill="url(#panelDg)" />
              <path d="M0 80 C120 60 260 95 420 85 C600 75 760 95 920 85 C1080 75 1260 95 1400 85 L1400 260 L0 260 Z" fill="#ffe9b8" opacity="0.95" />
              <circle cx="1200" cy="35" r="34" fill="#ffd36b" opacity="0.95" />
            </svg>

            <img src={castleUrl} alt="castle" style={{
              position: "absolute", right: 18, top: 6, width: 220, height: "auto", opacity: 0.95, pointerEvents: "none"
            }} />

            {/* left palm small */}
            <div style={{ position: "absolute", left: 18, bottom: 90, zIndex: 0, opacity: 0.95 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ display: "block" }}>
                <rect x="34" y="10" width="8" height="36" rx="2" fill="#8b5a2b" />
                <g fill="#2ea044" transform="translate(0,0)"><ellipse cx="38" cy="8" rx="36" ry="10" /></g>
              </svg>
            </div>
          </div>

          {/* panel content above panel-bg (zIndex 2+) */}
          <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 2 }}>
            <div style={{ padding: 12 }}>
              <h2 style={{ marginTop: 0, fontSize: 20 }}>Pyramid Builder</h2>
              <div style={{ fontSize: 14, marginBottom: 8 }}>Bricks: {bricksCount}</div>
            </div>

            <div style={{ position: "relative", width: "100%", height: "78%", marginTop: 4 }}>
              {/* ground plate (zIndex lower than bricks) */}
              <div style={{
                position: "absolute",
                left: "50%",
                bottom: 8,
                transform: "translateX(-50%)",
                width: `${BASE_COLS * BRICK_W + (BASE_COLS - 1) * BRICK_GAP}px`,
                height: 22,
                background: "linear-gradient(180deg,#f5e0b0,#e7c98b)",
                borderRadius: 8,
                border: "2px solid #b58a3a",
                zIndex: 1,
                boxShadow: "0 6px 0 rgba(0,0,0,0.06) inset",
              }} />

              {/* bricks container (scaled to fit) */}
              <div style={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                transform: `translateX(-50%) scale(${scale})`,
                transformOrigin: "center bottom",
                width: `${BASE_COLS * BRICK_W + (BASE_COLS - 1) * BRICK_GAP}px`,
                height: "auto",
                pointerEvents: "none",
                zIndex: 3,
              }}>
                {computePyramidPositions(bricksCount, BASE_COLS).map((p, idx) => (
                  <div key={idx} style={{
                    position: "absolute",
                    left: `${((BASE_COLS - p.cols) / 2) * (BRICK_W + BRICK_GAP) + p.col * (BRICK_W + BRICK_GAP)}px`,
                    bottom: `${p.row * (BRICK_H + BRICK_GAP) + GROUND_EXTRA}px`,
                    width: `${BRICK_W}px`,
                    height: `${BRICK_H}px`,
                    background: "linear-gradient(180deg,#f4b55a,#c07b17)",
                    border: "1.8px solid #6b3f08",
                    borderRadius: 6,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2b1700",
                    fontWeight: 700,
                  }} />
                ))}

                {/* falling bricks */}
                {fallingBricks.map((idx) => {
                  const arr = computePyramidPositions(idx + 1, BASE_COLS);
                  const last = arr[arr.length - 1];
                  if (!last) return null;
                  return (
                    <div key={`fall-${idx}`} className="brick falling" style={{
                      position: "absolute",
                      left: `${((BASE_COLS - last.cols) / 2) * (BRICK_W + BRICK_GAP) + last.col * (BRICK_W + BRICK_GAP)}px`,
                      bottom: `${last.row * (BRICK_H + BRICK_GAP) + GROUND_EXTRA}px`,
                      width: `${BRICK_W}px`,
                      height: `${BRICK_H}px`,
                      background: "linear-gradient(180deg,#f4b55a,#c07b17)",
                      border: "1.8px solid #6b3f08",
                      borderRadius: 6,
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2b1700",
                      fontWeight: 700,
                      zIndex: 4,
                    }} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      {showModal && (
        <div style={{ position: "fixed", left: 0, right: 0, top: 0, bottom: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ width: "min(720px,90%)", background: "#fff", padding: 22, borderRadius: 10, border: "3px solid #000", textAlign: "center" }}>
            <h2 style={{ marginTop: 0 }}>🏆 Quiz Complete</h2>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12 }}>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{correctCount}</div><div>Correct</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{wrongCount}</div><div>Wrong</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{bricksCount}</div><div>Bricks</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{accuracy}%</div><div>Accuracy</div></div>
            </div>

            <p style={{ marginTop: 18 }}>{accuracy >= 75 ? "Great job! Your dessert pyramid stands tall." : "Nice attempt — try again to build a taller pyramid!"}</p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 18 }}>
              <button onClick={handleRestart} style={{ padding: "10px 16px", fontSize: 16, borderRadius: 8, border: "2px solid #000", background: "#ffd6d6", cursor: "pointer" }}>Restart</button>
              <button onClick={() => setShowModal(false)} style={{ padding: "10px 16px", fontSize: 16, borderRadius: 8, border: "2px solid #000", background: "#dff7df", cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .brick.falling { animation: fall-and-rotate 700ms ease-in forwards; }
        @keyframes fall-and-rotate {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          60% { transform: translateY(160px) rotate(8deg); opacity: 1; }
          100% { transform: translateY(420px) rotate(28deg); opacity: 0; }
        }
        /* ensure buttons text is black */
        button { color: #000; }
      `}</style>
    </div>
  );
}