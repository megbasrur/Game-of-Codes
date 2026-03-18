import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw, Zap, Star, Trophy, ChevronRight } from 'lucide-react';

// ── RIASEC + ML DATA ──────────────────────────────────────────────────────────
const MODEL = {
  career_courses: {
    "AI/ML Engineer":            { primary: "Python",   secondary: "ML",      path: ["Python", "ML"] },
    "Data Scientist":            { primary: "Python",   secondary: "ML",      path: ["Python", "ML"] },
    "Data Engineer":             { primary: "Python",   secondary: "ML",      path: ["Python", "ML"] },
    "NLP Engineer":              { primary: "Python",   secondary: "ML",      path: ["Python", "ML"] },
    "Backend Software Engineer": { primary: "Java/C++", secondary: "Python",  path: ["Java/C++", "Python"] },
    "Mobile Developer":          { primary: "Java/C++", secondary: "Python",  path: ["Java/C++", "Python"] },
    "Game Developer":            { primary: "Java/C++", secondary: "Python",  path: ["Java/C++", "Python"] },
    "Cloud Architect":           { primary: "Python",   secondary: "Java/C++",path: ["Python", "Java/C++"] },
    "DevOps Engineer":           { primary: "Python",   secondary: "Java/C++",path: ["Python", "Java/C++"] },
    "Site Reliability Engineer": { primary: "Python",   secondary: "Java/C++",path: ["Python", "Java/C++"] },
    "Cybersecurity Engineer":    { primary: "Python",   secondary: "Java/C++",path: ["Python", "Java/C++"] },
    "Cybersecurity Analyst":     { primary: "Python",   secondary: "Java/C++",path: ["Python", "Java/C++"] },
    "Full-Stack Developer":      { primary: "WebDev",   secondary: "Java/C++",path: ["WebDev", "Java/C++"] },
    "UX/UI Designer":            { primary: "WebDev",   secondary: "Python",  path: ["WebDev", "Python"] },
    "Product Manager (Tech)":    { primary: "WebDev",   secondary: "Python",  path: ["WebDev", "Python"] },
  },
  career_roadmap: {
    "AI/ML Engineer":            ["Python Fundamentals","Statistics & Math","ML Basics","Deep Learning","MLOps & Deployment"],
    "Data Scientist":            ["Python Fundamentals","SQL & Databases","Data Analysis","ML Basics","Advanced Analytics"],
    "Data Engineer":             ["Python Fundamentals","SQL & Databases","ETL Pipelines","Cloud Platforms","Streaming Data"],
    "NLP Engineer":              ["Python Fundamentals","Linear Algebra","NLP Basics","Transformers & LLMs","RAG & Deployment"],
    "Backend Software Engineer": ["Java/C++ Basics","Data Structures","APIs & Databases","System Design","Cloud & DevOps"],
    "Mobile Developer":          ["Java/C++ Basics","Mobile UI Patterns","APIs & Data","Testing","App Store Deploy"],
    "Game Developer":            ["Java/C++ Basics","Game Engine Basics","Physics & Math","Multiplayer","3D Graphics"],
    "Cloud Architect":           ["Python Fundamentals","Networking Basics","Cloud Services","IaC & Terraform","Security & Cost"],
    "DevOps Engineer":           ["Python Fundamentals","Linux & Bash","CI/CD Pipelines","Kubernetes","Monitoring"],
    "Site Reliability Engineer": ["Python Fundamentals","Linux & Bash","Observability","Incident Mgmt","SLOs & SLAs"],
    "Cybersecurity Engineer":    ["Python Fundamentals","Networking","Ethical Hacking","Cryptography","Threat Modeling"],
    "Cybersecurity Analyst":     ["Python Fundamentals","Networking","SIEM Tools","Incident Response","Compliance"],
    "Full-Stack Developer":      ["HTML/CSS/JS Basics","Frontend Frameworks","Backend APIs","Databases","Deployment"],
    "UX/UI Designer":            ["HTML/CSS/JS Basics","Design Principles","Figma & Prototyping","User Research","Accessibility"],
    "Product Manager (Tech)":    ["HTML/CSS/JS Basics","SQL Basics","Agile & Scrum","Analytics & Metrics","Roadmapping"],
  },
  career_riasec: {
    "AI/ML Engineer":            { R:0.5,I:0.9,A:0.1,S:0.1,E:0.2,C:0.6 },
    "Data Scientist":            { R:0.4,I:0.9,A:0.1,S:0.2,E:0.2,C:0.7 },
    "Data Engineer":             { R:0.7,I:0.7,A:0.1,S:0.1,E:0.2,C:0.8 },
    "Backend Software Engineer": { R:0.8,I:0.7,A:0.1,S:0.1,E:0.2,C:0.6 },
    "Full-Stack Developer":      { R:0.8,I:0.6,A:0.4,S:0.2,E:0.3,C:0.4 },
    "Mobile Developer":          { R:0.8,I:0.6,A:0.4,S:0.2,E:0.2,C:0.4 },
    "Game Developer":            { R:0.7,I:0.5,A:0.7,S:0.2,E:0.3,C:0.3 },
    "Cloud Architect":           { R:0.8,I:0.7,A:0.1,S:0.1,E:0.4,C:0.7 },
    "DevOps Engineer":           { R:0.8,I:0.6,A:0.1,S:0.1,E:0.3,C:0.8 },
    "Site Reliability Engineer": { R:0.8,I:0.7,A:0.1,S:0.1,E:0.3,C:0.7 },
    "Cybersecurity Engineer":    { R:0.5,I:0.8,A:0.1,S:0.1,E:0.3,C:0.8 },
    "Cybersecurity Analyst":     { R:0.4,I:0.8,A:0.1,S:0.2,E:0.2,C:0.8 },
    "NLP Engineer":              { R:0.5,I:0.9,A:0.3,S:0.2,E:0.2,C:0.5 },
    "UX/UI Designer":            { R:0.2,I:0.3,A:0.9,S:0.6,E:0.4,C:0.2 },
    "Product Manager (Tech)":    { R:0.2,I:0.5,A:0.3,S:0.7,E:0.8,C:0.3 },
  },
  q_riasec_weights: {
    Q001:[{I:2},{S:1},{A:1},{C:2}], Q002:[{I:2},{R:1},{A:1},{E:0}],
    Q003:[{I:2},{S:1},{A:2},{I:1}], Q004:[{R:2},{S:2},{C:1},{A:2}],
    Q005:[{R:2},{A:1},{I:1},{E:0}], Q006:[{R:1},{S:2},{A:2},{C:2}],
    Q007:[{A:2},{I:2},{R:1},{E:1}], Q008:[{A:2},{I:1},{R:1},{C:2}],
    Q009:[{A:2},{I:2},{R:2},{I:2}], Q010:[{S:2},{S:1},{S:1},{R:1}],
    Q011:[{E:2},{R:2},{E:1},{R:2}], Q012:[{S:2},{I:1},{R:1},{C:1}],
    Q013:[{E:2},{R:1},{S:1},{C:1}], Q014:[{E:2},{I:2},{E:1},{R:2}],
    Q015:[{E:2},{E:1},{I:1},{C:2}], Q016:[{R:2},{R:1},{I:1},{A:0}],
    Q017:[{C:2},{R:1},{A:2},{S:1}], Q018:[{C:2},{R:1},{I:1},{A:0}],
    Q019:[{I:2},{C:1},{R:2},{S:1}], Q020:[{I:2},{I:1},{R:1},{A:0}],
    Q021:[{E:2},{R:2},{A:2},{I:2}], Q022:[{A:1},{I:2},{R:2},{S:1}],
    Q023:[{E:2},{I:2},{S:2},{A:2}], Q024:[{R:2},{R:2},{I:2},{I:2}],
    Q025:[{S:2},{S:1},{I:1},{R:0}],
  },
};

const QUESTIONS = [
  { id:"Q001", domain:"Analytical Thinking", text:"When you encounter a complex problem, what's your first instinct?", opts:["Break it down into smaller logical steps","Ask someone who has faced it before","Search for creative workarounds","Document the problem thoroughly"] },
  { id:"Q002", domain:"Data Comfort", text:"How do you feel about working with large datasets?", opts:["Excited — patterns and insights fascinate me","Neutral — it's a tool like any other","Prefer it to be visual/graphical","Find it tedious"] },
  { id:"Q003", domain:"Academic Interest", text:"Which school subject did you enjoy most?", opts:["Mathematics / Statistics","Literature / History","Art / Music","Biology / Chemistry"] },
  { id:"Q004", domain:"Building & Creating", text:"Which activity sounds most satisfying to you?", opts:["Building an app from scratch","Helping someone solve a personal problem","Writing a report or essay","Designing a visual presentation"] },
  { id:"Q005", domain:"Debugging Attitude", text:"How do you feel about debugging code or fixing broken systems?", opts:["Enjoy it — like solving a puzzle","Dislike it — prefer creating new things","Tolerate it as part of the job","Prefer to hand off to others"] },
  { id:"Q006", domain:"Build Motivation", text:"When you build something, what matters most?", opts:["It works perfectly and is efficient","It helps real people","It looks great","It's documented well"] },
  { id:"Q007", domain:"Creative Design", text:"When designing something, which excites you most?", opts:["The visual aesthetics and user experience","The technical architecture behind it","How it will scale for millions of users","How it aligns with business goals"] },
  { id:"Q008", domain:"Ambiguity Comfort", text:"How comfortable are you with open-ended, unstructured problems?", opts:["Very comfortable — I enjoy exploring","Somewhat comfortable with some guidance","Prefer clear requirements and specs","Need a step-by-step process"] },
  { id:"Q009", domain:"Role Appeal", text:"Which role sounds most appealing?", opts:["UX/UI Designer crafting user experiences","Data Scientist uncovering trends","Cloud Architect designing systems","Security Analyst protecting networks"] },
  { id:"Q010", domain:"People Orientation", text:"How do you feel about teaching or mentoring others in tech?", opts:["Love it — very fulfilling","It's okay occasionally","Prefer one-on-one over groups","Prefer to focus on my own work"] },
  { id:"Q011", domain:"Team Role", text:"In a tech team, which role sounds most interesting?", opts:["Technical Lead guiding the team","Solo developer with full autonomy","Product Manager aligning stakeholders","DevOps Engineer keeping systems running"] },
  { id:"Q012", domain:"User Centricity", text:"How important is user feedback in your work?", opts:["Critical — I build for people","Important but secondary to technical correctness","Useful but not a priority","Not particularly relevant to my work"] },
  { id:"Q013", domain:"Ownership Drive", text:"How do you respond to taking ownership of a product or feature?", opts:["Energized — love end-to-end ownership","Comfortable if scope is clear","Prefer contributing to a larger team effort","Prefer a well-defined individual task"] },
  { id:"Q014", domain:"Career Aspiration", text:"Which of these appeals most to you career-wise?", opts:["Founding or leading a tech startup","Specializing deeply in one technical area","Bridging business and technology","Working on infrastructure and reliability"] },
  { id:"Q015", domain:"Risk Tolerance", text:"How comfortable are you with risk and ambiguity?", opts:["Very comfortable — thrive in uncertain environments","Somewhat comfortable with some safety nets","Prefer calculated, measured risks","Prefer stable, well-defined environments"] },
  { id:"Q016", domain:"Automation Love", text:"How do you feel about setting up automated pipelines and workflows?", opts:["Love it — automation is elegant","It's necessary and I'm good at it","Prefer high-level design over implementation","Find it repetitive"] },
  { id:"Q017", domain:"Work Structure", text:"Which work environment sounds most productive for you?", opts:["Structured with clear processes and KPIs","Agile and fast-moving sprints","Remote and self-directed","Collaborative open-office environment"] },
  { id:"Q018", domain:"Documentation", text:"How do you approach documentation?", opts:["Essential — write it proactively and thoroughly","Write it when required","Write minimal docs","Prefer others handle documentation"] },
  { id:"Q019", domain:"Learning Style", text:"When learning a new programming language or tool, you prefer:", opts:["Reading the official documentation","Following a structured video course","Jumping in and building a project","Pairing with an experienced colleague"] },
  { id:"Q020", domain:"Math Comfort", text:"How do you feel about mathematics and algorithms?", opts:["Enthusiastic — enjoy proofs and optimization","Comfortable with applied math","Prefer to use existing libraries","Avoid when possible"] },
  { id:"Q021", domain:"Group Role", text:"In a group project, you naturally gravitate toward:", opts:["Coordinating and managing timelines","Deep technical implementation","Creative brainstorming and ideation","Quality assurance and review"] },
  { id:"Q022", domain:"Learning Format", text:"When exploring a new technical concept, you prefer:", opts:["Visual diagrams and interactive demos","Written explanations and theory","Hands-on experiments and sandbox","Discussion with peers"] },
  { id:"Q023", domain:"Dream Outcome", text:"Which best describes your dream career outcome?", opts:["Building a product used by millions","Advancing scientific or technical knowledge","Mentoring the next generation of coders","Creating elegant, beautiful digital experiences"] },
  { id:"Q024", domain:"Project Excitement", text:"What type of projects excite you the most?", opts:["Infrastructure and cloud systems","Consumer-facing web/mobile apps","AI and machine learning models","Cybersecurity and ethical hacking"] },
  { id:"Q025", domain:"Social Impact", text:"How important is social impact in your career choice?", opts:["Very important — technology should serve humanity","Important but not a deciding factor","Prefer to focus on technical excellence","Not a primary consideration"] },
];

const COURSE_INFO = {
  "Python":   { icon:"🐍", name:"Python",              desc:"Core language for data, AI, backend & scripting." },
  "Java/C++": { icon:"☕", name:"Java / C++",           desc:"Systems, mobile & backend. Performance-critical apps." },
  "WebDev":   { icon:"🌐", name:"Web Dev (HTML/CSS/JS)",desc:"Frontend & full-stack foundation for browser apps." },
  "ML":       { icon:"🤖", name:"Machine Learning",     desc:"Algorithms, models & neural networks for AI careers." },
};

const RIASEC_COLORS = { R:"#f5a623", I:"#a78bfa", A:"#f472b6", S:"#34d399", E:"#f87171", C:"#38bdf8" };
const RIASEC_NAMES  = { R:"Realistic", I:"Investigative", A:"Artistic", S:"Social", E:"Enterprising", C:"Conventional" };
const DOMAIN_MAP = {
  "AI/ML Engineer":"Artificial Intelligence","NLP Engineer":"Artificial Intelligence",
  "Data Scientist":"Data & Analytics","Data Engineer":"Data & Analytics",
  "Backend Software Engineer":"Software Development","Full-Stack Developer":"Software Development",
  "Mobile Developer":"Software Development","Game Developer":"Software Development",
  "Cloud Architect":"Cloud & Infrastructure","DevOps Engineer":"Cloud & Infrastructure",
  "Site Reliability Engineer":"Cloud & Infrastructure","Cybersecurity Engineer":"Security",
  "Cybersecurity Analyst":"Security","UX/UI Designer":"Design & Product",
  "Product Manager (Tech)":"Product & Strategy",
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
function computeRIASEC(answers) {
  const s = { R:0, I:0, A:0, S:0, E:0, C:0 };
  const idx = { A:0, B:1, C:2, D:3 };
  QUESTIONS.forEach(q => {
    const ans = answers[q.id];
    if (!ans) return;
    const weights = MODEL.q_riasec_weights[q.id][idx[ans]];
    Object.entries(weights).forEach(([k, v]) => { s[k] = (s[k] || 0) + v; });
  });
  return s;
}

function hollandCode(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]).join('');
}

function predict(scores) {
  const maxVal = Math.max(...Object.values(scores)) || 1;
  const norm = {};
  Object.entries(scores).forEach(([k, v]) => norm[k] = v / maxVal);
  return Object.entries(MODEL.career_riasec).map(([career, profile]) => {
    let dot = 0, magA = 0, magB = 0;
    ['R','I','A','S','E','C'].forEach(d => {
      const a = norm[d] || 0, b = profile[d] || 0;
      dot += a * b; magA += a * a; magB += b * b;
    });
    const sim = magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
    return { career, sim };
  }).sort((a, b) => b.sim - a.sim);
}

// ── ANIMATED STARS BG ────────────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            opacity: 0.3,
            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── SCREEN: WELCOME ───────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center relative z-10">
      {/* Glow orb */}
      <div className="absolute w-96 h-96 rounded-full bg-purple-600/30 blur-3xl top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="mb-6 flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
          <Zap className="w-7 h-7 text-white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">
          Code<span className="text-purple-400">Quest</span>
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
        Discover Your<br />
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          Tech Career Path
        </span>
      </h1>
      <p className="text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
        Answer 25 questions. Our RIASEC-powered ML model matches you to your ideal career and tells you exactly which course to start.
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
        {[["25","Questions"],["15","Career Paths"],["4","Courses"]].map(([val, lbl]) => (
          <div key={lbl} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-extrabold text-purple-300 font-mono">{val}</div>
            <div className="text-xs text-gray-400 mt-1">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Course tags */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {Object.values(COURSE_INFO).map(c => (
          <span key={c.name} className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-300 backdrop-blur-sm">
            {c.icon} {c.name}
          </span>
        ))}
      </div>

      <button
        onClick={onStart}
        className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-purple-700/40 transition-all duration-200 hover:scale-105 hover:shadow-purple-500/50 flex items-center gap-3"
      >
        <Star className="w-5 h-5" />
        Start Career Assessment
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="text-gray-600 text-xs mt-6 font-mono">RF Classifier · 150-student dataset · RIASEC-grounded</p>
    </div>
  );
}

// ── SCREEN: QUIZ ──────────────────────────────────────────────────────────────
function QuizScreen({ current, total, answers, onAnswer, onNext, onPrev }) {
  const q = QUESTIONS[current];
  const letters = ['A','B','C','D'];
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-gray-500 font-mono">Q{current + 1} / {total}</span>
          <span className="text-xs text-purple-400 font-mono font-semibold">{q.domain}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md mb-6 shadow-xl">
          <p className="text-white text-xl font-semibold leading-relaxed mb-8">{q.text}</p>
          <div className="space-y-3">
            {q.opts.map((opt, i) => {
              const letter = letters[i];
              const selected = answers[q.id] === letter;
              return (
                <button
                  key={letter}
                  onClick={() => onAnswer(q.id, letter)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-150 group
                    ${selected
                      ? 'bg-purple-600/30 border-purple-500 text-white shadow-md shadow-purple-700/30'
                      : 'bg-white/3 border-white/8 text-gray-300 hover:border-purple-500/50 hover:bg-purple-600/10 hover:text-white'
                    }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 transition-all
                    ${selected ? 'bg-purple-500 text-white' : 'bg-white/8 text-gray-500 group-hover:bg-purple-500/20 group-hover:text-purple-300'}`}>
                    {letter}
                  </span>
                  <span className="text-sm leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nav */}
        <div className="flex justify-between">
          <button
            onClick={onPrev}
            disabled={current === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={onNext}
            disabled={!answers[q.id]}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 shadow-md shadow-purple-700/30"
          >
            {current === total - 1 ? 'See My Results' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN: RESULTS ───────────────────────────────────────────────────────────
function ResultsScreen({ answers, onRestart }) {
  const [barsReady, setBarsReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBarsReady(true), 300); return () => clearTimeout(t); }, []);

  const scores  = computeRIASEC(answers);
  const code    = hollandCode(scores);
  const ranked  = predict(scores);
  const top     = ranked[0];
  const pct     = Math.round(top.sim * 100);
  const courses = MODEL.career_courses[top.career];
  const roadmap = MODEL.career_roadmap[top.career];
  const maxScore = Math.max(...Object.values(scores)) || 1;
  const allCourses = ["Python","Java/C++","WebDev","ML"];

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-4">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 text-xs font-bold font-mono tracking-widest uppercase">Career Match Found</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Results ✦</h2>
        <p className="text-gray-400 text-sm mt-2">Based on your RIASEC profile across 25 dimensions</p>
      </div>

      {/* Top Career Hero */}
      <div className="relative bg-gradient-to-br from-purple-900/60 to-pink-900/30 border border-purple-500/40 rounded-3xl p-7 mb-5 overflow-hidden shadow-2xl shadow-purple-900/50">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="text-xs font-bold tracking-widest text-purple-400 font-mono mb-2 uppercase"># 1 Match · ML Prediction</div>
        <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">{top.career}</div>
        <div className="text-sm text-gray-400 mb-5">{DOMAIN_MAP[top.career] || 'Tech'}</div>

        {/* Match bar */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl font-extrabold text-green-400 font-mono">{pct}%</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-green-400 rounded-full transition-all duration-1000"
              style={{ width: barsReady ? `${pct}%` : '0%' }}
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-widest">Your Holland Code</div>
        <div className="text-3xl font-extrabold tracking-[6px] font-mono bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{code}</div>
      </div>

      {/* Start Course */}
      <div className="bg-gradient-to-r from-purple-800/40 to-indigo-800/30 border border-purple-500/30 rounded-2xl overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-white/5">
          <div className="text-xs font-bold text-green-400 font-mono tracking-widest uppercase mb-1">▶ Start Next</div>
          <div className="text-xl font-bold text-white">{COURSE_INFO[courses.primary]?.name}</div>
        </div>
        <div className="px-6 py-4 flex flex-wrap gap-2 items-center">
          {courses.path.map((c, i) => (
            <React.Fragment key={c}>
              {i > 0 && <ChevronRight className="w-3 h-3 text-gray-600" />}
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border
                ${i === 0
                  ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                  : 'bg-green-500/15 border-green-500/50 text-green-400'}`}>
                {COURSE_INFO[c]?.icon} {COURSE_INFO[c]?.name}
              </span>
            </React.Fragment>
          ))}
          {allCourses.filter(c => !courses.path.includes(c)).map(c => (
            <React.Fragment key={c}>
              <ChevronRight className="w-3 h-3 text-gray-700" />
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono border bg-white/5 border-white/10 text-gray-600">
                {COURSE_INFO[c]?.icon} {COURSE_INFO[c]?.name}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* All Courses Grid */}
      <div className="text-xs text-gray-600 font-mono tracking-widest uppercase mb-3">All Platform Courses</div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {allCourses.map(c => {
          const isPrimary = c === courses.primary;
          const isSecondary = c === courses.secondary;
          const info = COURSE_INFO[c];
          return (
            <div key={c} className={`rounded-2xl p-4 border transition-all
              ${isPrimary ? 'bg-purple-600/20 border-purple-500/50' : isSecondary ? 'bg-green-500/10 border-green-500/30' : 'bg-white/3 border-white/8'}`}>
              <div className={`text-xs font-bold font-mono tracking-widest rounded-full px-2 py-0.5 inline-block mb-3
                ${isPrimary ? 'bg-purple-500/20 text-purple-400' : isSecondary ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-gray-600'}`}>
                {isPrimary ? '★ Recommended' : isSecondary ? 'Next up' : 'Optional'}
              </div>
              <div className="text-2xl mb-2">{info.icon}</div>
              <div className="text-sm font-bold text-white mb-1">{info.name}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{info.desc}</div>
            </div>
          );
        })}
      </div>

      {/* 5-Step Roadmap */}
      <div className="text-xs text-gray-600 font-mono tracking-widest uppercase mb-3">Your 5-Step Career Roadmap</div>
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden mb-5">
        {roadmap.map((step, i) => (
          <div key={i} className={`flex items-center gap-4 px-6 py-4 ${i < roadmap.length - 1 ? 'border-b border-white/5' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0
              ${i === 0 ? 'bg-purple-600/40 border border-purple-500 text-purple-300' : 'bg-white/5 border border-white/10 text-gray-600'}`}
              style={i === 0 ? { animation: 'pulse 2s ease-in-out infinite' } : {}}>
              {i + 1}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{step}</div>
              <div className="text-xs text-gray-600">{i === 0 ? '▶ Start here' : 'Up next in your journey'}</div>
            </div>
          </div>
        ))}
      </div>

      {/* RIASEC Profile */}
      <div className="text-xs text-gray-600 font-mono tracking-widest uppercase mb-3">Your RIASEC Profile</div>
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-5 space-y-4">
        {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([dim, val]) => (
          <div key={dim} className="flex items-center gap-3">
            <div className="w-6 text-xs font-bold font-mono text-gray-500">{dim}</div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-xs text-gray-600 font-mono">{RIASEC_NAMES[dim]}</div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: barsReady ? `${Math.round((val / maxScore) * 100)}%` : '0%',
                    background: RIASEC_COLORS[dim],
                  }}
                />
              </div>
            </div>
            <div className="w-6 text-xs font-mono text-gray-500 text-right">{val}</div>
          </div>
        ))}
      </div>

      {/* Alt Careers */}
      <div className="text-xs text-gray-600 font-mono tracking-widest uppercase mb-3">Other Strong Matches</div>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {ranked.slice(1, 5).map((r, i) => (
          <div key={r.career} className="bg-white/3 border border-white/8 rounded-2xl p-4 hover:border-purple-500/30 transition-all cursor-default">
            <div className="text-xs text-gray-600 font-mono mb-1">#{i + 2} match</div>
            <div className="text-sm font-bold text-white mb-1 leading-tight">{r.career}</div>
            <div className="text-purple-400 font-mono text-xs mb-2">{Math.round(r.sim * 100)}%</div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500/50 rounded-full" style={{ width: `${Math.round(r.sim * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Restart */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-purple-700/30 transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" /> Retake Assessment
        </button>
      </div>
    </div>
  );
}

// ── ROOT COMPONENT ────────────────────────────────────────────────────────────
export default function CareerQuiz() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('welcome'); // welcome | quiz | results
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (qid, letter) => {
    setAnswers(prev => ({ ...prev, [qid]: letter }));
  };

  const handleNext = () => {
    if (current === QUESTIONS.length - 1) { setScreen('results'); return; }
    setCurrent(c => c + 1);
  };

  const handlePrev = () => { if (current > 0) setCurrent(c => c - 1); };

  const handleRestart = () => {
    setAnswers({});
    setCurrent(0);
    setScreen('welcome');
  };

  return (
    <div className="w-screen min-h-screen relative overflow-x-hidden">
      {/* Galaxy Background — matches landing.jsx */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, #2B0B5A 0%, #1A0C3F 60%), 
                       linear-gradient(135deg, #2F2F6F 0%, #6B6CD9 70%, #A44EFF 100%)`,
        }}
      />
      <div className="fixed w-3/5 h-3/5 top-10 left-20 bg-purple-500/50 rounded-full filter blur-3xl animate-pulse z-0 pointer-events-none" />
      <div className="fixed w-2/5 h-2/5 bottom-10 right-10 bg-pink-500/40 rounded-full filter blur-3xl animate-pulse z-0 pointer-events-none" />
      <StarField />

      {/* Back button (quiz/results only) */}
      {screen !== 'welcome' && (
        <button
          onClick={() => screen === 'quiz' ? setScreen('welcome') : navigate(-1)}
          className="fixed top-6 left-6 z-20 flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}

      {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('quiz')} />}
      {screen === 'quiz' && (
        <QuizScreen
          current={current}
          total={QUESTIONS.length}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {screen === 'results' && <ResultsScreen answers={answers} onRestart={handleRestart} />}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.6; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
