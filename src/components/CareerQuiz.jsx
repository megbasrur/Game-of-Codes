import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw, Star, Trophy, ChevronRight } from 'lucide-react';
import { apiRequest } from '../lib/api';
import AppHeader from './AppHeader';

// ── RIASEC + ML DATA ─────────────────────────────────────────────────────────
const MODEL = {
  career_courses: {
    "AI/ML Engineer":            { primary:"Python",   secondary:"ML",       path:["Python","ML"] },
    "Data Scientist":            { primary:"Python",   secondary:"ML",       path:["Python","ML"] },
    "Data Engineer":             { primary:"Python",   secondary:"ML",       path:["Python","ML"] },
    "NLP Engineer":              { primary:"Python",   secondary:"ML",       path:["Python","ML"] },
    "Backend Software Engineer": { primary:"Java/C++", secondary:"Python",   path:["Java/C++","Python"] },
    "Mobile Developer":          { primary:"Java/C++", secondary:"Python",   path:["Java/C++","Python"] },
    "Game Developer":            { primary:"Java/C++", secondary:"Python",   path:["Java/C++","Python"] },
    "Cloud Architect":           { primary:"Python",   secondary:"Java/C++", path:["Python","Java/C++"] },
    "DevOps Engineer":           { primary:"Python",   secondary:"Java/C++", path:["Python","Java/C++"] },
    "Site Reliability Engineer": { primary:"Python",   secondary:"Java/C++", path:["Python","Java/C++"] },
    "Cybersecurity Engineer":    { primary:"Python",   secondary:"Java/C++", path:["Python","Java/C++"] },
    "Cybersecurity Analyst":     { primary:"Python",   secondary:"Java/C++", path:["Python","Java/C++"] },
    "Full-Stack Developer":      { primary:"WebDev",   secondary:"Java/C++", path:["WebDev","Java/C++"] },
    "UX/UI Designer":            { primary:"WebDev",   secondary:"Python",   path:["WebDev","Python"] },
    "Product Manager (Tech)":    { primary:"WebDev",   secondary:"Python",   path:["WebDev","Python"] },
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
    "AI/ML Engineer":            {R:0.5,I:0.9,A:0.1,S:0.1,E:0.2,C:0.6},
    "Data Scientist":            {R:0.4,I:0.9,A:0.1,S:0.2,E:0.2,C:0.7},
    "Data Engineer":             {R:0.7,I:0.7,A:0.1,S:0.1,E:0.2,C:0.8},
    "Backend Software Engineer": {R:0.8,I:0.7,A:0.1,S:0.1,E:0.2,C:0.6},
    "Full-Stack Developer":      {R:0.8,I:0.6,A:0.4,S:0.2,E:0.3,C:0.4},
    "Mobile Developer":          {R:0.8,I:0.6,A:0.4,S:0.2,E:0.2,C:0.4},
    "Game Developer":            {R:0.7,I:0.5,A:0.7,S:0.2,E:0.3,C:0.3},
    "Cloud Architect":           {R:0.8,I:0.7,A:0.1,S:0.1,E:0.4,C:0.7},
    "DevOps Engineer":           {R:0.8,I:0.6,A:0.1,S:0.1,E:0.3,C:0.8},
    "Site Reliability Engineer": {R:0.8,I:0.7,A:0.1,S:0.1,E:0.3,C:0.7},
    "Cybersecurity Engineer":    {R:0.5,I:0.8,A:0.1,S:0.1,E:0.3,C:0.8},
    "Cybersecurity Analyst":     {R:0.4,I:0.8,A:0.1,S:0.2,E:0.2,C:0.8},
    "NLP Engineer":              {R:0.5,I:0.9,A:0.3,S:0.2,E:0.2,C:0.5},
    "UX/UI Designer":            {R:0.2,I:0.3,A:0.9,S:0.6,E:0.4,C:0.2},
    "Product Manager (Tech)":    {R:0.2,I:0.5,A:0.3,S:0.7,E:0.8,C:0.3},
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
  {id:"Q001",domain:"Analytical Thinking",text:"When you encounter a complex problem, what's your first instinct?",opts:["Break it down into smaller logical steps","Ask someone who has faced it before","Search for creative workarounds","Document the problem thoroughly"]},
  {id:"Q002",domain:"Data Comfort",text:"How do you feel about working with large datasets?",opts:["Excited — patterns and insights fascinate me","Neutral — it's a tool like any other","Prefer it to be visual/graphical","Find it tedious"]},
  {id:"Q003",domain:"Academic Interest",text:"Which school subject did you enjoy most?",opts:["Mathematics / Statistics","Literature / History","Art / Music","Biology / Chemistry"]},
  {id:"Q004",domain:"Building & Creating",text:"Which activity sounds most satisfying to you?",opts:["Building an app from scratch","Helping someone solve a personal problem","Writing a report or essay","Designing a visual presentation"]},
  {id:"Q005",domain:"Debugging Attitude",text:"How do you feel about debugging code or fixing broken systems?",opts:["Enjoy it — like solving a puzzle","Dislike it — prefer creating new things","Tolerate it as part of the job","Prefer to hand off to others"]},
  {id:"Q006",domain:"Build Motivation",text:"When you build something, what matters most?",opts:["It works perfectly and is efficient","It helps real people","It looks great","It's documented well"]},
  {id:"Q007",domain:"Creative Design",text:"When designing something, which excites you most?",opts:["The visual aesthetics and user experience","The technical architecture behind it","How it will scale for millions of users","How it aligns with business goals"]},
  {id:"Q008",domain:"Ambiguity Comfort",text:"How comfortable are you with open-ended, unstructured problems?",opts:["Very comfortable — I enjoy exploring","Somewhat comfortable with some guidance","Prefer clear requirements and specs","Need a step-by-step process"]},
  {id:"Q009",domain:"Role Appeal",text:"Which role sounds most appealing?",opts:["UX/UI Designer crafting user experiences","Data Scientist uncovering trends","Cloud Architect designing systems","Security Analyst protecting networks"]},
  {id:"Q010",domain:"People Orientation",text:"How do you feel about teaching or mentoring others in tech?",opts:["Love it — very fulfilling","It's okay occasionally","Prefer one-on-one over groups","Prefer to focus on my own work"]},
  {id:"Q011",domain:"Team Role",text:"In a tech team, which role sounds most interesting?",opts:["Technical Lead guiding the team","Solo developer with full autonomy","Product Manager aligning stakeholders","DevOps Engineer keeping systems running"]},
  {id:"Q012",domain:"User Centricity",text:"How important is user feedback in your work?",opts:["Critical — I build for people","Important but secondary to technical correctness","Useful but not a priority","Not particularly relevant to my work"]},
  {id:"Q013",domain:"Ownership Drive",text:"How do you respond to taking ownership of a product or feature?",opts:["Energized — love end-to-end ownership","Comfortable if scope is clear","Prefer contributing to a larger team effort","Prefer a well-defined individual task"]},
  {id:"Q014",domain:"Career Aspiration",text:"Which of these appeals most to you career-wise?",opts:["Founding or leading a tech startup","Specializing deeply in one technical area","Bridging business and technology","Working on infrastructure and reliability"]},
  {id:"Q015",domain:"Risk Tolerance",text:"How comfortable are you with risk and ambiguity?",opts:["Very comfortable — thrive in uncertain environments","Somewhat comfortable with some safety nets","Prefer calculated, measured risks","Prefer stable, well-defined environments"]},
  {id:"Q016",domain:"Automation Love",text:"How do you feel about setting up automated pipelines and workflows?",opts:["Love it — automation is elegant","It's necessary and I'm good at it","Prefer high-level design over implementation","Find it repetitive"]},
  {id:"Q017",domain:"Work Structure",text:"Which work environment sounds most productive for you?",opts:["Structured with clear processes and KPIs","Agile and fast-moving sprints","Remote and self-directed","Collaborative open-office environment"]},
  {id:"Q018",domain:"Documentation",text:"How do you approach documentation?",opts:["Essential — write it proactively and thoroughly","Write it when required","Write minimal docs","Prefer others handle documentation"]},
  {id:"Q019",domain:"Learning Style",text:"When learning a new programming language or tool, you prefer:",opts:["Reading the official documentation","Following a structured video course","Jumping in and building a project","Pairing with an experienced colleague"]},
  {id:"Q020",domain:"Math Comfort",text:"How do you feel about mathematics and algorithms?",opts:["Enthusiastic — enjoy proofs and optimization","Comfortable with applied math","Prefer to use existing libraries","Avoid when possible"]},
  {id:"Q021",domain:"Group Role",text:"In a group project, you naturally gravitate toward:",opts:["Coordinating and managing timelines","Deep technical implementation","Creative brainstorming and ideation","Quality assurance and review"]},
  {id:"Q022",domain:"Learning Format",text:"When exploring a new technical concept, you prefer:",opts:["Visual diagrams and interactive demos","Written explanations and theory","Hands-on experiments and sandbox","Discussion with peers"]},
  {id:"Q023",domain:"Dream Outcome",text:"Which best describes your dream career outcome?",opts:["Building a product used by millions","Advancing scientific or technical knowledge","Mentoring the next generation of coders","Creating elegant, beautiful digital experiences"]},
  {id:"Q024",domain:"Project Excitement",text:"What type of projects excite you the most?",opts:["Infrastructure and cloud systems","Consumer-facing web/mobile apps","AI and machine learning models","Cybersecurity and ethical hacking"]},
  {id:"Q025",domain:"Social Impact",text:"How important is social impact in your career choice?",opts:["Very important — technology should serve humanity","Important but not a deciding factor","Prefer to focus on technical excellence","Not a primary consideration"]},
];

const COURSE_INFO = {
  "Python":   { name:"Python",               desc:"Core language for data, AI, backend & scripting." },
  "Java/C++": { name:"Java / C++",            desc:"Systems, mobile & backend. Performance-critical apps." },
  "WebDev":   { name:"Web Dev (HTML/CSS/JS)", desc:"Frontend & full-stack foundation for browser apps." },
  "ML":       { name:"Machine Learning",      desc:"Algorithms, models & neural networks for AI careers." },
};

const RIASEC_COLORS = {R:"#f5a623",I:"#a78bfa",A:"#f472b6",S:"#34d399",E:"#f87171",C:"#38bdf8"};
const RIASEC_NAMES  = {R:"Realistic",I:"Investigative",A:"Artistic",S:"Social",E:"Enterprising",C:"Conventional"};
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

function computeRIASEC(answers) {
  const s = {R:0,I:0,A:0,S:0,E:0,C:0};
  const idx = {A:0,B:1,C:2,D:3};
  QUESTIONS.forEach(q => {
    const ans = answers[q.id];
    if (!ans) return;
    const weights = MODEL.q_riasec_weights[q.id][idx[ans]];
    Object.entries(weights).forEach(([k,v]) => { s[k]=(s[k]||0)+v; });
  });
  return s;
}
function hollandCode(scores) {
  return Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,3).map(e=>e[0]).join('');
}
function predict(scores) {
  const maxVal = Math.max(...Object.values(scores))||1;
  const norm = {};
  Object.entries(scores).forEach(([k,v]) => norm[k]=v/maxVal);
  return Object.entries(MODEL.career_riasec).map(([career,profile]) => {
    let dot=0,magA=0,magB=0;
    ['R','I','A','S','E','C'].forEach(d => {
      const a=norm[d]||0,b=profile[d]||0;
      dot+=a*b; magA+=a*a; magB+=b*b;
    });
    const sim = magA&&magB ? dot/(Math.sqrt(magA)*Math.sqrt(magB)) : 0;
    return {career,sim};
  }).sort((a,b)=>b.sim-a.sim);
}

// ── GALAXY BACKGROUND ────────────────────────────────────────────────────────
function GalaxyBg() {
  const stars = Array.from({length:80},(_,i)=>({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size:Math.random()*2+0.5, delay:Math.random()*5, dur:Math.random()*3+2,
  }));
  return (
    <>
      <div className="fixed inset-0 z-0" style={{
        background:`radial-gradient(circle at 30% 30%, #2B0B5A 0%, #1A0C3F 60%),
                    linear-gradient(135deg,#2F2F6F 0%,#6B6CD9 70%,#A44EFF 100%)`,
      }}/>
      <div className="fixed w-3/5 h-3/5 top-10 left-20 bg-purple-500/40 rounded-full filter blur-3xl animate-pulse z-0 pointer-events-none"/>
      <div className="fixed w-2/5 h-2/5 bottom-10 right-10 bg-pink-500/30 rounded-full filter blur-3xl animate-pulse z-0 pointer-events-none"/>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {stars.map(s=>(
          <div key={s.id} className="absolute rounded-full bg-white"
            style={{left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,opacity:0.25,
              animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`}}/>
        ))}
      </div>
    </>
  );
}

// ── WELCOME SCREEN ────────────────────────────────────────────────────────────
function WelcomeScreen({onStart}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center relative z-10">
      <div className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"/>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
        Discover Your<br/>
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          Tech Career Path
        </span>
      </h1>
      <p className="text-gray-300 text-lg max-w-md mb-10 leading-relaxed">
       A personalized assessment to understand your interests and guide your coding journey.
      </p>
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {Object.values(COURSE_INFO).map(c=>(
          <span key={c.name} className="rounded-full px-4 py-1.5 text-sm font-semibold text-purple-200"
            style={{background:'rgba(139,92,246,0.22)',border:'1.5px solid rgba(167,139,250,0.4)'}}>
            {c.name}
          </span>
        ))}
      </div>
      <button onClick={onStart}
        className="text-white font-bold text-lg px-10 py-4 rounded-2xl flex items-center gap-3 transition-all hover:scale-105"
        style={{background:'linear-gradient(135deg,#7c3aed,#db2777)',boxShadow:'0 0 32px rgba(124,58,237,0.5)'}}>
        <Star className="w-5 h-5"/> Start Career Assessment
        <ChevronRight className="w-5 h-5"/>
      </button>
    </div>
  );
}

// ── QUIZ SCREEN ───────────────────────────────────────────────────────────────
function QuizScreen({current,total,answers,onAnswer,onNext,onPrev}) {
  const q = QUESTIONS[current];
  const letters = ['A','B','C','D'];
  const progress = ((current+1)/total)*100;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-300 font-mono font-semibold">Q{current+1} / {total}</span>
          <span className="text-sm text-purple-300 font-mono font-semibold">{q.domain}</span>
        </div>
        <div className="h-2 rounded-full mb-8 overflow-hidden" style={{background:'rgba(255,255,255,0.12)'}}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{width:`${progress}%`,background:'linear-gradient(90deg,#7c3aed,#db2777)'}}/>
        </div>
        <div className="rounded-3xl p-8 mb-5 shadow-2xl"
          style={{background:'rgba(30,20,60,0.92)',border:'1.5px solid rgba(167,139,250,0.5)',
            backdropFilter:'blur(16px)',boxShadow:'0 8px 40px rgba(124,58,237,0.3)'}}>
          <p className="text-white text-xl font-semibold leading-relaxed mb-8">{q.text}</p>
          <div className="space-y-3">
            {q.opts.map((opt,i)=>{
              const letter=letters[i], selected=answers[q.id]===letter;
              return (
                <button key={letter} onClick={()=>onAnswer(q.id,letter)}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-150"
                  style={{
                    background:selected?'rgba(124,58,237,0.5)':'rgba(255,255,255,0.1)',
                    border:selected?'1.5px solid rgba(167,139,250,0.9)':'1.5px solid rgba(255,255,255,0.25)',
                    boxShadow:selected?'0 0 16px rgba(124,58,237,0.4)':'none',
                  }}>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                    style={{background:selected?'#7c3aed':'rgba(255,255,255,0.15)',
                      border:selected?'1.5px solid #a78bfa':'1.5px solid rgba(255,255,255,0.3)',
                      color:selected?'#fff':'#d1d5db'}}>
                    {letter}
                  </span>
                  <span className="text-sm leading-snug" style={{color:selected?'#f3f0ff':'#e5e7eb'}}>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between">
          <button onClick={onPrev} disabled={current===0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{background:'rgba(255,255,255,0.1)',border:'1.5px solid rgba(255,255,255,0.25)',color:'#e5e7eb'}}>
            <ArrowLeft className="w-4 h-4"/> Back
          </button>
          <button onClick={onNext} disabled={!answers[q.id]}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
            style={{background:'linear-gradient(135deg,#7c3aed,#db2777)',
              boxShadow:answers[q.id]?'0 4px 20px rgba(124,58,237,0.5)':'none'}}>
            {current===total-1?'See My Results':'Next'}
            <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PIXEL-ART GAME MAP ROADMAP ────────────────────────────────────────────────
// Matches the inspo: winding road bottom→top, red location pins, step cards beside road,
// trophy at top, START at bottom — all in galaxy purple/pink theme
export function GameMapRoadmap({ steps, career }) {
  const [activeStep, setActiveStep] = useState(0);

  // The 5 pin positions along the winding road (in the SVG coordinate space 400×700)
  // Road snakes: bottom-centre → left → right → left → top-centre
  // Pins placed ON the road at natural stop points
  const pins = [
    { x: 170, y: 618, cardSide: 'right' },  // step 1 – bottom, road curves right
    { x: 260, y: 480, cardSide: 'left'  },  // step 2
    { x: 140, y: 350, cardSide: 'right' },  // step 3
    { x: 268, y: 210, cardSide: 'left'  },  // step 4
    { x: 200, y:  88, cardSide: 'none'  },  // step 5 – top (trophy)
  ];

  // Winding road path — single smooth S-curve from bottom to top
  const roadPath = `
    M 200 700
    L 200 660
    C 200 640  170 630  170 618
    C 170 595  160 565  175 540
    C 195 510  240 505  260 490
    C 280 475  285 455  280 435
    C 270 405  240 390  210 375
    C 175 358  140 355  138 342
    C 136 325  148 305  165 288
    C 185 268  220 258  245 240
    C 268 222  275 215  268 200
    C 260 182  235 172  218 158
    C 200 144  196  120  200 100
    C 200  95  200  90   200  88
  `;

  // Decorative pixel-art nebula blobs (space theme replaces the grass)
  const nebulas = [
    {cx:60,  cy:150, rx:45, ry:30, color:'rgba(139,92,246,0.25)'},
    {cx:340, cy:240, rx:40, ry:28, color:'rgba(219,39,119,0.2)'},
    {cx:50,  cy:400, rx:50, ry:35, color:'rgba(59,130,246,0.2)'},
    {cx:340, cy:450, rx:38, ry:26, color:'rgba(139,92,246,0.2)'},
    {cx:80,  cy:570, rx:42, ry:28, color:'rgba(219,39,119,0.18)'},
    {cx:320, cy:590, rx:36, ry:24, color:'rgba(99,102,241,0.2)'},
  ];

  // Pixel-art stars (small cross/plus shapes) scattered around
  const pixelStars = [
    {x:45, y:120},{x:355,y:180},{x:38, y:300},{x:360,y:350},
    {x:55, y:490},{x:350,y:510},{x:40, y:640},{x:355,y:130},
    {x:100,y:50 },{x:300,y:55 },{x:80, y:660},{x:310,y:655},
  ];

  // Pixel planet decorations
  const planets = [
    {cx:52, cy:200, r:14, color:'#7c3aed', ringColor:'#a78bfa'},
    {cx:352,cy:300, r:10, color:'#db2777', ringColor:'#f472b6'},
    {cx:45, cy:530, r:12, color:'#4f46e5', ringColor:'#818cf8'},
    {cx:355,cy:620, r:9,  color:'#7c3aed', ringColor:'#c084fc'},
  ];

  const stepColors = ['#a855f7','#8b5cf6','#7c3aed','#6d28d9','#db2777'];

  return (
    <div style={{
      borderRadius:20,
      overflow:'hidden',
      border:'2px solid rgba(167,139,250,0.5)',
      boxShadow:'0 8px 40px rgba(124,58,237,0.4)',
      background:'#0d0820',
      position:'relative',
    }}>
      {/* Career title bar at top */}
      <div style={{
        padding:'12px 20px',
        background:'rgba(124,58,237,0.3)',
        borderBottom:'1.5px solid rgba(167,139,250,0.35)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div>
          <div style={{fontSize:10,fontFamily:'monospace',fontWeight:700,letterSpacing:2,
            textTransform:'uppercase',color:'#a78bfa',marginBottom:2}}>Your Career Roadmap</div>
          <div style={{fontSize:15,fontWeight:700,color:'#fff'}}>{career}</div>
        </div>
        <Trophy style={{width:24,height:24,color:'#fbbf24'}}/>
      </div>

      {/* THE MAP — full SVG */}
      <div style={{position:'relative', background:'#0d0820'}}>
        <svg
          viewBox="0 0 400 700"
          width="100%"
          style={{display:'block', maxHeight:'70vh'}}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* ── Space background tiles ── */}
          <rect x="0" y="0" width="400" height="700" fill="#0d0820"/>

          {/* pixel grid dots — subtle space texture */}
          {Array.from({length:20},(_,row)=>
            Array.from({length:13},(_,col)=>(
              <rect key={`${row}-${col}`}
                x={col*32+4} y={row*36+4} width="2" height="2"
                fill="rgba(167,139,250,0.08)" rx="1"/>
            ))
          )}

          {/* nebula blobs */}
          {nebulas.map((n,i)=>(
            <ellipse key={i} cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry} fill={n.color}/>
          ))}

          {/* pixel planets */}
          {planets.map((p,i)=>(
            <g key={i}>
              {/* ring */}
              <ellipse cx={p.cx} cy={p.cy} rx={p.r+6} ry={4} fill="none"
                stroke={p.ringColor} strokeWidth="1.5" opacity="0.6"/>
              <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.color} opacity="0.85"/>
              {/* highlight */}
              <circle cx={p.cx-p.r*0.3} cy={p.cy-p.r*0.3} r={p.r*0.25}
                fill="rgba(255,255,255,0.25)"/>
            </g>
          ))}

          {/* pixel-art plus stars */}
          {pixelStars.map((s,i)=>(
            <g key={i} opacity="0.5">
              <rect x={s.x-1} y={s.y-3} width="2" height="6" fill="#e2d9f3" rx="1"/>
              <rect x={s.x-3} y={s.y-1} width="6" height="2" fill="#e2d9f3" rx="1"/>
            </g>
          ))}

          {/* ── ROAD ── */}
          {/* road shadow */}
          <path d={roadPath} fill="none" stroke="rgba(0,0,0,0.5)"
            strokeWidth="44" strokeLinecap="round" strokeLinejoin="round"/>
          {/* road base — dark asphalt */}
          <path d={roadPath} fill="none" stroke="#1e1b2e"
            strokeWidth="40" strokeLinecap="round" strokeLinejoin="round"/>
          {/* road edges — purple glow lines */}
          <path d={roadPath} fill="none" stroke="rgba(139,92,246,0.6)"
            strokeWidth="40" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="none" style={{filter:'blur(1px)'}}/>
          <path d={roadPath} fill="none" stroke="#2d1f5e"
            strokeWidth="36" strokeLinecap="round" strokeLinejoin="round"/>
          {/* road surface */}
          <path d={roadPath} fill="none" stroke="#1a1535"
            strokeWidth="30" strokeLinecap="round" strokeLinejoin="round"/>
          {/* centre dashed line — pink/purple */}
          <path d={roadPath} fill="none" stroke="rgba(216,180,254,0.7)"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="14 10"/>
          {/* subtle road edge highlights */}
          <path d={roadPath} fill="none" stroke="rgba(167,139,250,0.25)"
            strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>

          {/* ── TROPHY at top ── */}
          <circle cx="200" cy="44" r="22" fill="rgba(251,191,36,0.15)"
            stroke="rgba(251,191,36,0.5)" strokeWidth="1.5"/>
          <text x="200" y="51" textAnchor="middle" fontSize="22" dominantBaseline="middle">🏆</text>

          {/* ── START label at bottom ── */}
          <rect x="108" y="672" width="82" height="22" rx="4"
            fill="#7c3aed" stroke="rgba(167,139,250,0.8)" strokeWidth="1.5"/>
          {/* pixel font effect — bold monospace */}
          <text x="149" y="687" textAnchor="middle" dominantBaseline="middle"
            fill="#fff" fontSize="11" fontFamily="monospace" fontWeight="bold"
            letterSpacing="2">START</text>

          {/* ── ROCKET at start (replaces princess from inspo) ── */}
          <text x="185" y="695" textAnchor="middle" fontSize="18" dominantBaseline="middle">🚀</text>

          {/* ── STEP PINS + CARDS ── */}
          {pins.map((pin, i) => {
            const isActive = i === activeStep;
            const isComplete = i < activeStep;
            const color = stepColors[i];
            const isGoal = i === 4;

            // Card position: alternate left/right beside the road
            const cardW = 130;
            const cardH = 44;
            const gap = 18;
            const cardX = pin.cardSide === 'right'
              ? pin.x + 22 + gap
              : pin.x - 22 - gap - cardW;
            const cardY = pin.y - cardH / 2;

            // Connector line from pin edge to card
            const lineX1 = pin.cardSide === 'right' ? pin.x + 20 : pin.x - 20;
            const lineX2 = pin.cardSide === 'right' ? cardX : cardX + cardW;

            return (
              <g key={i} onClick={() => setActiveStep(i)} style={{cursor:'pointer'}}>
                {/* Connector line */}
                {pin.cardSide !== 'none' && (
                  <line x1={lineX1} y1={pin.y} x2={lineX2} y2={pin.y}
                    stroke="rgba(167,139,250,0.4)" strokeWidth="1"
                    strokeDasharray="4 3"/>
                )}

                {/* Step info card */}
                {pin.cardSide !== 'none' && (
                  <g>
                    {/* card shadow */}
                    <rect x={cardX+2} y={cardY+2} width={cardW} height={cardH} rx="8"
                      fill="rgba(0,0,0,0.4)"/>
                    {/* card bg */}
                    <rect x={cardX} y={cardY} width={cardW} height={cardH} rx="8"
                      fill={isActive ? 'rgba(124,58,237,0.6)' : isComplete ? 'rgba(45,212,160,0.15)' : 'rgba(20,12,50,0.9)'}
                      stroke={isActive ? 'rgba(167,139,250,0.9)' : isComplete ? 'rgba(45,212,160,0.5)' : 'rgba(167,139,250,0.3)'}
                      strokeWidth={isActive ? 2 : 1}/>
                    {/* step number pill */}
                    <rect x={cardX+8} y={cardY+8} width="18" height="14" rx="4"
                      fill={isComplete ? '#2dd4a0' : color}/>
                    <text x={cardX+17} y={cardY+17} textAnchor="middle"
                      dominantBaseline="middle" fill="#fff" fontSize="8"
                      fontFamily="monospace" fontWeight="bold">{i+1}</text>
                    {/* step name — wrapped in foreignObject for text wrapping */}
                    <foreignObject x={cardX+30} y={cardY+4} width={cardW-36} height={cardH-8}>
                      <div xmlns="http://www.w3.org/1999/xhtml" style={{
                        fontSize:'10px', fontWeight:600, lineHeight:'1.3',
                        color: isActive ? '#f3f0ff' : isComplete ? '#6ee7b7' : '#c4b5fd',
                        fontFamily:'system-ui,sans-serif',
                        overflow:'hidden', maxHeight:'36px',
                      }}>
                        {steps[i]}
                      </div>
                    </foreignObject>
                  </g>
                )}

                {/* Goal card — centred above trophy */}
                {pin.cardSide === 'none' && (
                  <g>
                    <rect x={pin.x - 70} y={pin.y + 28} width="140" height="28" rx="6"
                      fill={isActive?'rgba(124,58,237,0.7)':'rgba(20,12,50,0.9)'}
                      stroke={isActive?'rgba(216,180,254,0.9)':'rgba(167,139,250,0.4)'}
                      strokeWidth={isActive?2:1}/>
                    <text x={pin.x} y={pin.y+44} textAnchor="middle"
                      dominantBaseline="middle" fill={isActive?'#fff':'#c4b5fd'}
                      fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {steps[i]}
                    </text>
                  </g>
                )}

                {/* Glow ring for active */}
                {isActive && (
                  <circle cx={pin.x} cy={pin.y} r="20"
                    fill="none" stroke={color} strokeWidth="2" opacity="0.5"
                    style={{animation:'ping 1.5s ease-in-out infinite'}}/>
                )}

                {/* Pin drop shadow */}
                <ellipse cx={pin.x} cy={pin.y+2} rx="8" ry="4" fill="rgba(0,0,0,0.4)"/>

                {/* Location pin body */}
                <path
                  d={`M${pin.x},${pin.y-18} 
                      C${pin.x-12},${pin.y-18} ${pin.x-12},${pin.y-6} ${pin.x},${pin.y+2}
                      C${pin.x+12},${pin.y-6} ${pin.x+12},${pin.y-18} ${pin.x},${pin.y-18}Z`}
                  fill={isComplete ? '#2dd4a0' : isActive ? '#fff' : color}
                  stroke={isActive ? color : 'rgba(0,0,0,0.3)'}
                  strokeWidth={isActive ? 2 : 1}
                />
                {/* Pin inner circle */}
                <circle cx={pin.x} cy={pin.y-12} r="4"
                  fill={isActive ? color : isComplete ? '#0d0820' : 'rgba(255,255,255,0.8)'}/>

                {/* Completed checkmark */}
                {isComplete && (
                  <text x={pin.x} y={pin.y-11} textAnchor="middle"
                    dominantBaseline="middle" fill="#0d0820" fontSize="7" fontWeight="bold">
                    ✓
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step detail panel below map */}
      <div style={{
        padding:'16px 20px',
        background:'rgba(124,58,237,0.18)',
        borderTop:'1.5px solid rgba(167,139,250,0.3)',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
          <div style={{
            width:24,height:24,borderRadius:6,display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:11,fontWeight:700,fontFamily:'monospace',
            color:'#fff',background:stepColors[activeStep],flexShrink:0,
          }}>{activeStep+1}</div>
          <span style={{color:'#fff',fontWeight:700,fontSize:14}}>{steps[activeStep]}</span>
          {activeStep===0 && (
            <span style={{marginLeft:'auto',fontSize:10,fontWeight:700,padding:'2px 8px',
              borderRadius:100,background:'rgba(45,212,160,0.2)',
              border:'1px solid rgba(45,212,160,0.5)',color:'#2dd4a0',whiteSpace:'nowrap'}}>
              Start here
            </span>
          )}
          {activeStep===4 && (
            <span style={{marginLeft:'auto',fontSize:10,fontWeight:700,padding:'2px 8px',
              borderRadius:100,background:'rgba(251,191,36,0.2)',
              border:'1px solid rgba(251,191,36,0.5)',color:'#fbbf24',whiteSpace:'nowrap'}}>
              Goal
            </span>
          )}
        </div>
        <p style={{color:'#a78bfa',fontSize:12,marginBottom:12,paddingLeft:34}}>
          {activeStep===0?'Your starting milestone — begin here on the platform.':
           activeStep===4?'Your final destination — master this to become job-ready.':
           `Step ${activeStep+1} of 5 — builds on everything before it.`}
        </p>
        {/* step nav dots */}
        <div style={{display:'flex',gap:8,alignItems:'center',justifyContent:'center'}}>
          {steps.map((_,i)=>(
            <button key={i} onClick={()=>setActiveStep(i)}
              style={{
                width: i===activeStep?24:10,
                height:10, borderRadius:5, border:'none',cursor:'pointer',
                background: i===activeStep?stepColors[i]:
                            i<activeStep?'rgba(45,212,160,0.5)':'rgba(255,255,255,0.15)',
                transition:'all 0.2s',
              }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── RESULTS SCREEN ────────────────────────────────────────────────────────────
function ResultsScreen({answers, onRestart}) {
  const [barsReady, setBarsReady] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setBarsReady(true),300); return ()=>clearTimeout(t); },[]);

  const scores   = computeRIASEC(answers);
  const code     = hollandCode(scores);
  const ranked   = predict(scores);
  const top      = ranked[0];
  const pct      = Math.round(top.sim*100);
  const courses  = MODEL.career_courses[top.career];
  const roadmap  = MODEL.career_roadmap[top.career];
  const maxScore = Math.max(...Object.values(scores))||1;
  const allCourses = ["Python","Java/C++","WebDev","ML"];

  const card = {
    background:'rgba(20,12,50,0.92)',
    border:'1.5px solid rgba(167,139,250,0.4)',
    boxShadow:'0 4px 24px rgba(124,58,237,0.2)',
  };

  useEffect(() => {
    apiRequest("/career-result", {
      method: "POST",
      body: JSON.stringify({
        career: top.career,
        matchPercent: pct,
        hollandCode: code,
        recommendedPath: courses.path,
        riasecScores: scores,
        runnerUpCareers: ranked.slice(1, 5).map((r) => ({
          career: r.career,
          matchPercent: Math.round(r.sim * 100),
        })),
      }),
    }).catch(() => {
      // no-op
    });
  }, [top.career, pct, code, courses.path]);

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
          style={{background:'rgba(251,191,36,0.12)',border:'1px solid rgba(251,191,36,0.35)'}}>
          <Trophy className="w-4 h-4 text-yellow-400"/>
          <span className="text-yellow-400 text-xs font-bold font-mono tracking-widest uppercase">Career Match Found</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Results</h2>
        <p className="text-gray-300 text-sm mt-2">Based on your RIASEC profile across 25 dimensions</p>
      </div>

      {/* Top Career */}
      <div className="relative rounded-3xl p-7 mb-5 overflow-hidden shadow-2xl"
        style={{background:'rgba(30,14,70,0.96)',border:'1.5px solid rgba(167,139,250,0.6)',
          boxShadow:'0 8px 40px rgba(124,58,237,0.4)'}}>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"/>
        <div className="text-xs font-bold tracking-widest text-purple-300 font-mono mb-2 uppercase"># 1 Match · ML Prediction</div>
        <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">{top.career}</div>
        <div className="text-sm text-gray-300 mb-5">{DOMAIN_MAP[top.career]||'Tech'}</div>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl font-extrabold text-green-400 font-mono">{pct}%</span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.12)'}}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{width:barsReady?`${pct}%`:'0%',background:'linear-gradient(90deg,#7c3aed,#34d399)'}}/>
          </div>
        </div>
        <div className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-widest">Your Holland Code</div>
        <div className="text-3xl font-extrabold tracking-[6px] font-mono bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">{code}</div>
      </div>

      {/* ── PIXEL-ART GAME MAP ── */}
      <div className="mb-5">
        <GameMapRoadmap steps={roadmap} career={top.career}/>
      </div>

      {/* Start Course */}
      <div className="rounded-2xl overflow-hidden mb-5 shadow-xl" style={card}>
        <div className="px-6 py-4" style={{borderBottom:'1px solid rgba(167,139,250,0.2)'}}>
          <div className="text-xs font-bold text-green-400 font-mono tracking-widest uppercase mb-1">Start Next on the Platform</div>
          <div className="text-xl font-bold text-white">{COURSE_INFO[courses.primary]?.name}</div>
        </div>
        <div className="px-6 py-4 flex flex-wrap gap-2 items-center">
          {courses.path.map((c,i)=>(
            <React.Fragment key={c}>
              {i>0 && <ChevronRight className="w-3 h-3 text-gray-500"/>}
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono"
                style={{
                  background:i===0?'rgba(124,58,237,0.35)':'rgba(34,197,94,0.15)',
                  border:i===0?'1.5px solid rgba(167,139,250,0.7)':'1.5px solid rgba(34,197,94,0.4)',
                  color:i===0?'#e9d5ff':'#86efac',
                }}>{COURSE_INFO[c]?.name}</span>
            </React.Fragment>
          ))}
          {allCourses.filter(c=>!courses.path.includes(c)).map(c=>(
            <React.Fragment key={c}>
              <ChevronRight className="w-3 h-3 text-gray-600"/>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono"
                style={{background:'rgba(255,255,255,0.07)',border:'1.5px solid rgba(255,255,255,0.18)',color:'#9ca3af'}}>
                {COURSE_INFO[c]?.name}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* All Courses */}
      <div className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-3">All Platform Courses</div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {allCourses.map(c=>{
          const isPrimary=c===courses.primary, isSecondary=c===courses.secondary, info=COURSE_INFO[c];
          return (
            <div key={c} className="rounded-2xl p-4 transition-all"
              style={{
                background:isPrimary?'rgba(124,58,237,0.28)':isSecondary?'rgba(34,197,94,0.12)':'rgba(255,255,255,0.06)',
                border:isPrimary?'1.5px solid rgba(167,139,250,0.7)':isSecondary?'1.5px solid rgba(34,197,94,0.4)':'1.5px solid rgba(255,255,255,0.18)',
              }}>
              <div className="text-xs font-bold font-mono tracking-widest rounded-full px-2 py-0.5 inline-block mb-3"
                style={{
                  background:isPrimary?'rgba(167,139,250,0.2)':isSecondary?'rgba(34,197,94,0.15)':'rgba(255,255,255,0.07)',
                  color:isPrimary?'#c4b5fd':isSecondary?'#86efac':'#6b7280',
                }}>
                {isPrimary?'Recommended':isSecondary?'Next up':'Optional'}
              </div>
              <div className="text-sm font-bold text-white mb-1">{info.name}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{info.desc}</div>
            </div>
          );
        })}
      </div>

      {/* RIASEC Profile */}
      <div className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-3">Your RIASEC Profile</div>
      <div className="rounded-2xl p-6 mb-5 shadow-xl" style={card}>
        <div className="space-y-4">
          {Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([dim,val])=>(
            <div key={dim} className="flex items-center gap-3">
              <div className="w-6 text-xs font-bold font-mono" style={{color:RIASEC_COLORS[dim]}}>{dim}</div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 font-mono mb-1">{RIASEC_NAMES[dim]}</div>
                <div className="h-2 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.1)'}}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{width:barsReady?`${Math.round((val/maxScore)*100)}%`:'0%',background:RIASEC_COLORS[dim]}}/>
                </div>
              </div>
              <div className="w-6 text-xs font-mono text-gray-400 text-right">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alt Careers */}
      <div className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-3">Other Strong Matches</div>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {ranked.slice(1,5).map((r,i)=>(
          <div key={r.career} className="rounded-2xl p-4 transition-all"
            style={{background:'rgba(255,255,255,0.06)',border:'1.5px solid rgba(255,255,255,0.18)'}}>
            <div className="text-xs text-gray-400 font-mono mb-1">#{i+2} match</div>
            <div className="text-sm font-bold text-white mb-1 leading-tight">{r.career}</div>
            <div className="text-purple-300 font-mono text-xs mb-2">{Math.round(r.sim*100)}%</div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.1)'}}>
              <div className="h-full rounded-full" style={{width:`${Math.round(r.sim*100)}%`,background:'rgba(167,139,250,0.6)'}}/>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button onClick={onRestart}
          className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105"
          style={{background:'linear-gradient(135deg,#7c3aed,#db2777)',boxShadow:'0 4px 24px rgba(124,58,237,0.4)'}}>
          <RotateCcw className="w-4 h-4"/> Retake Assessment
        </button>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function CareerRoadmap() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('welcome');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    apiRequest("/features")
      .then((data) => {
        if (!data.features?.careerGuidance) {
          navigate("/landing");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleAnswer = (qid,letter) => setAnswers(prev=>({...prev,[qid]:letter}));
  const handleNext = () => {
    if (current===QUESTIONS.length-1){ setScreen('results'); return; }
    setCurrent(c=>c+1);
  };
  const handlePrev = () => { if (current>0) setCurrent(c=>c-1); };
  const handleRestart = () => { setAnswers({}); setCurrent(0); setScreen('welcome'); };

  return (
    <div className="w-screen min-h-screen relative overflow-x-hidden">
      <GalaxyBg/>

      <div className="relative z-20 px-6 pt-6 max-w-6xl mx-auto">
        <AppHeader />
        {screen !== "welcome" && (
          <button
            type="button"
            onClick={() =>
              screen === "quiz"
                ? setScreen("welcome")
                : navigate("/landing")
            }
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all text-sm font-medium w-fit"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>

      {screen==='welcome' && <WelcomeScreen onStart={()=>setScreen('quiz')}/>}
      {screen==='quiz' && (
        <QuizScreen
          current={current} total={QUESTIONS.length}
          answers={answers} onAnswer={handleAnswer}
          onNext={handleNext} onPrev={handlePrev}
        />
      )}
      {screen==='results' && <ResultsScreen answers={answers} onRestart={handleRestart}/>}

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:.6} }
        @keyframes ping {
          0%   { transform:scale(1);   opacity:.5; }
          70%  { transform:scale(1.6); opacity:0;  }
          100% { transform:scale(1.6); opacity:0;  }
        }
      `}</style>
    </div>
  );
}

export { MODEL, DOMAIN_MAP, COURSE_INFO, RIASEC_COLORS, RIASEC_NAMES };
