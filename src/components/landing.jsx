import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-200 to-purple-300 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-10">🚀 Choose Your Language</h1>

      <div
        onClick={() => navigate("/java")}
        className="w-40 h-40 bg-yellow-300 rounded-2xl shadow-lg flex items-center justify-center text-2xl font-semibold cursor-pointer hover:scale-105 hover:bg-yellow-400 transition"
      >
        ☕ Java
      </div>
    </div>
  );
}
