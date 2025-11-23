import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";

/* -------------------------
   Helper: escape RegExp
------------------------- */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* -------------------------
   Evaluate simple println expressions
------------------------- */
function evalPrintExpression(expr, varName, inputValue) {
  const parts = expr.split(/\+/).map((p) => p.trim());
  const resultParts = parts.map((p) => {
    const literalMatch = p.match(/^"([^"]*)"$/);
    if (literalMatch) return literalMatch[1];

    if (p === varName) return inputValue;

    const p2 = p.replace(/^\(|\)$/g, "");
    if (p2 === varName) return inputValue;

    return p.replace(/^"|"$/g, "");
  });

  return resultParts.join("");
}

/* -------------------------
   Validate & simulate Java code
------------------------- */
function validateAndSimulate(code) {
  const inputString = "hello ocean";
  const src = (code || "").trim();

  if (!src)
    return { ok: false, hint: "Type your code in the editor.", stdin: inputString, stdout: "", printed: false };

  // Scanner
  const scannerRegex = /Scanner\s+([A-Za-z_]\w*)\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)\s*;/;
  const scannerMatch = src.match(scannerRegex);
  if (!scannerMatch) {
    if (/new\s+Scanner\s*\(/.test(src))
      return { ok: false, hint: "Use: new Scanner(System.in);", stdin: inputString, stdout: "", printed: false };

    return { ok: false, hint: "Instantiate Scanner: Scanner sc = new Scanner(System.in);", stdin: inputString, stdout: "", printed: false };
  }
  const scanVar = scannerMatch[1];

  // nextLine()
  const stringDecl = new RegExp(`String\\s+([A-Za-z_]\\w*)\\s*=\\s*${escapeRegExp(scanVar)}\\.nextLine\\s*\\(\\)\\s*;`);
  const stringAssign = new RegExp(`([A-Za-z_]\\w*)\\s*=\\s*${escapeRegExp(scanVar)}\\.nextLine\\s*\\(\\)\\s*;`);

  let varName = null;
  const m1 = src.match(stringDecl);
  const m2 = src.match(stringAssign);
  if (m1) varName = m1[1];
  else if (m2) varName = m2[1];
  else {
    if (src.includes(`${scanVar}.nextLine()`))
      return { ok: false, hint: "Store nextLine() result into a String variable.", stdin: inputString, stdout: "", printed: false };

    if (src.includes(`${scanVar}.next(`))
      return { ok: false, hint: "Use nextLine() because input has spaces.", stdin: inputString, stdout: "", printed: false };

    return { ok: false, hint: "Use: String msg = sc.nextLine();", stdin: inputString, stdout: "", printed: false };
  }

  // print
  const printRegex = /System\.out\.(?:println|print)\(([^)]*)\)/g;
  let printed = false;
  let stdout = "";

  let m;
  while ((m = printRegex.exec(src)) !== null) {
    const arg = m[1].trim();

    if (arg === varName) stdout = inputString;
    else {
      const lit = arg.match(/^"([^"]*)"$/);
      if (lit) stdout = lit[1];
      else stdout = evalPrintExpression(arg, varName, inputString);
    }

    printed = true;
    break;
  }

  if (!printed)
    return { ok: false, hint: "Print the input using System.out.println(msg);", stdin: inputString, stdout: "", printed: false };

  const ok = stdout.includes(inputString);

  if (ok)
    return { ok: true, hint: "Perfect — you read input and printed it!", stdin: inputString, stdout, printed: true, varName };

  return {
    ok: false,
    hint: `Your program printed "${stdout}" — print the actual input ("${inputString}").`,
    stdin: inputString,
    stdout,
    printed: true,
    varName
  };
}

/* -------------------------
   Bottle SVG
------------------------- */
function BottleSVG() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84">
      <g transform="rotate(-12 42 42)">
        <rect x="34" y="8" width="16" height="10" rx="2" fill="#a16207" />
        <rect x="31" y="16" width="22" height="10" rx="4" fill="#7dd3fc" stroke="#0ea5e9" strokeWidth="2" />
        <rect x="24" y="24" width="36" height="40" rx="10" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
        <rect x="30" y="34" width="24" height="20" rx="3" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.5" />
        <rect x="26" y="28" width="6" height="30" rx="3" fill="#e0f2fe" opacity="0.8" />
      </g>
    </svg>
  );
}

/* -------------------------
   MAIN COMPONENT (READY TO USE)
------------------------- */
export default function MessageInBottle({ awardXp = 10 }) {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [xp, setXp] = useState(0);
  const [sent, setSent] = useState(false);
  const [consoleData, setConsoleData] = useState({ stdin: "hello ocean", stdout: "", logs: [] });
  const [activeConsoleTab, setActiveConsoleTab] = useState("output");

  const starter = useMemo(
    () =>
      `// Goal: Read one line from stdin using Scanner + nextLine()
// Example:
Scanner sc = new Scanner(System.in);
String msg = sc.nextLine();
System.out.println(msg);
`,
    []
  );

  function handleSend() {
    const result = validateAndSimulate(code);
    setFeedback(result.hint);
    setConsoleData({
      stdin: result.stdin,
      stdout: result.stdout || "",
      logs: [result.hint]
    });

    if (result.ok) {
      setXp((x) => x + awardXp);
      setSent(false);
      requestAnimationFrame(() => setSent(true));
    } else {
      setSent(false);
    }
  }

  function handleReset() {
    setCode("");
    setFeedback("");
    setSent(false);
    setConsoleData({ stdin: "hello ocean", stdout: "", logs: [] });
  }

  return (
    <div className="game-grid">

      {/* 💠 Inject CSS directly so no external file needed */}
      <style>{`
/* ROOT */
:root {
  --bg1:#e6f4ff; --bg2:#cfeafe; --card:#ffffff; --ink:#0f172a;
  --muted:#475569; --chip:#fde68a; --chip-info:#bfdbfe;
  --success:#16a34a; --error:#dc2626;
  --shadow:0 10px 30px -10px rgba(2,132,199,.25);
}
.game-grid { display:grid; gap:14px; padding:16px; }

/* CARD */
.card { background:var(--card); border:1px solid #e5e7eb; border-radius:14px; padding:14px; box-shadow:var(--shadow); }
.glass { background:rgba(255,255,255,0.85); backdrop-filter:blur(6px); }

/* TEXT */
.card-title { margin:0 0 6px; font-size:20px; }
.card-subtitle { margin:0 0 8px; font-size:16px; }
.muted { color:var(--muted); }

/* CHIPS */
.chip { border-radius:999px; padding:6px 12px; background:var(--chip); font-weight:700; }
.chip.info { background:var(--chip-info); }

/* ROWS */
.row { display:flex; align-items:center; }
.row.between { justify-content:space-between; }
.gap { gap:8px; }
.mt { margin-top:10px; }

/* BUTTONS */
.btn { border-radius:10px; border:1px solid #d1d5db; padding:8px 12px; cursor:pointer; background:white; }
.btn.primary { background:#0ea5e9; color:white; }

/* FEEDBACK */
.feedback.ok { color:var(--success); }
.feedback.err { color:var(--error); }

/* EDITOR */
.editor-wrap { height:260px; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; }

/* OCEAN */
.ocean {
  position:relative; height:260px;
  border:1px solid #bae6fd; border-radius:14px;
  background:linear-gradient(to bottom,#e0f2fe,#6cbcf2);
  overflow:hidden;
}
.sun { position:absolute; left:20px; top:-14px; width:72px; height:72px; background:#fde047; border-radius:50%; }
.cloud { position:absolute; height:22px; background:rgba(255,255,255,.75); border-radius:999px; }
.cloud-a { width:120px; left:100px; top:8px; }
.cloud-b { width:160px; left:300px; top:26px; }

.wave { position:absolute; bottom:0; left:0; width:220%; animation:wave 8s linear infinite; height:96px; }
.wave-1 { fill:#60a5fa; }
.wave-2 { fill:#3b82f6; height:110px; animation-duration:9s; }
.wave-3 { fill:#2563eb; height:128px; animation-duration:12s; }
@keyframes wave { to { transform:translateX(-50%); } }

/* BOTTLE */
.bottle-wrap { position:absolute; bottom:110px; left:16px; }
.bottle-wrap.sailing { animation:sail 4s linear forwards; }
@keyframes sail { to { left:calc(100% - 140px); } }

.speech {
  position:absolute; left:90px; top:-46px;
  background:white; padding:6px 10px;
  border-radius:10px; border:1px solid #ccc;
  font-weight:700;
}

/* CONSOLE */
.console-grid { display:flex; gap:12px; margin-top:12px; }
.console-box {
  flex:1; background:#0b1220; color:#e6eef9;
  border-radius:10px; padding:8px;
}
.console-title { margin-bottom:6px; color:#cbd5e1; }
.console-area { margin:0; font-family:monospace; }
.console-log-area {
  background:#0b1220; padding:12px; color:#e6eef9;
  border-radius:8px; white-space:pre-wrap;
}

/* RESPONSIVE */
@media(max-width:880px) {
  .console-grid { flex-direction:column; }
}
      `}</style>

      {/* MISSION */}
      <section className="card glass">
        <div className="row between">
          <div>
            <h2 className="card-title">Mission</h2>
            <p className="muted">Read the input using <code>Scanner</code> + <code>nextLine()</code>, then print it.</p>
            <div className="row gap mt">
              <div className="chip info">Provided input: <strong>hello ocean</strong></div>
            </div>
          </div>
          <div className="chip">⭐ XP: {xp}</div>
        </div>
      </section>

      {/* EDITOR */}
      <section className="card">
        <div className="editor-wrap">
          <Editor
            height="260px"
            defaultLanguage="java"
            value={code}
            defaultValue={starter}
            onChange={(v) => setCode(v ?? "")}
            theme="vs-light"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              tabSize: 2
            }}
          />
        </div>

        <div className="row gap mt">
          <button className="btn primary" onClick={handleSend}>Run & Send Bottle 🌊</button>
          <button className="btn" onClick={handleReset}>Reset</button>
          <p className={`feedback ${feedback.startsWith("Perfect") ? "ok" : "err"}`}>{feedback}</p>
        </div>
      </section>

      {/* OCEAN */}
      <section className="ocean">
        <div className="sun" />
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />

        <svg className="wave wave-1" viewBox="0 0 1200 100"><path d="M0,40 Q150,70 300,40 T600,40 900,40 1200,40 V100 H0Z"/></svg>
        <svg className="wave wave-2" viewBox="0 0 1200 100"><path d="M0,48 Q150,78 300,48 T600,48 900,48 1200,48 V100 H0Z"/></svg>
        <svg className="wave wave-3" viewBox="0 0 1200 100"><path d="M0,56 Q150,86 300,56 T600,56 900,56 1200,56 V100 H0Z"/></svg>

        <div className={`bottle-wrap ${sent ? "sailing" : ""}`}>
          {sent && <div className="speech">{consoleData.stdout}</div>}
          <BottleSVG />
        </div>
      </section>

      {/* CONSOLE */}
      <section className="card">
        <div className="row between">
          <h3 className="card-subtitle">Console</h3>
          <div className="row gap">
            <button className={`btn ${activeConsoleTab === "output" ? "primary" : ""}`} onClick={() => setActiveConsoleTab("output")}>Output</button>
            <button className={`btn ${activeConsoleTab === "logs" ? "primary" : ""}`} onClick={() => setActiveConsoleTab("logs")}>Logs</button>
          </div>
        </div>

        {activeConsoleTab === "output" ? (
          <div className="console-grid">
            <div className="console-box">
              <div className="console-title">stdin</div>
              <pre className="console-area">{consoleData.stdin}</pre>
            </div>
            <div className="console-box">
              <div className="console-title">stdout</div>
              <pre className="console-area">{consoleData.stdout}</pre>
            </div>
          </div>
        ) : (
          <div className="console-logs">
            <div className="console-title">Logs / Hints</div>
            <pre className="console-log-area">
              {consoleData.logs.length ? consoleData.logs.join("\n") : "No logs yet. Run code to see hints."}
            </pre>
          </div>
        )}
      </section>

      {/* HINTS */}
      <section className="card">
        <h3 className="card-subtitle">Hints</h3>
        <ul className="list">
          <li>Create scanner: <code>Scanner sc = new Scanner(System.in);</code></li>
          <li>Read line: <code>String msg = sc.nextLine();</code></li>
          <li>Print it: <code>System.out.println(msg);</code></li>
        </ul>
      </section>
    </div>
  );
}
