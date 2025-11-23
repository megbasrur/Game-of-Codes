import React, { useState } from "react";
import Bg from "../assets/bg.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    fetch("https://game-of-codes.onrender.com/gameofcodes/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
     .then((data) => {
    console.log("LOGIN RESPONSE:", data);

    if (data.token) {
        setSuccess("Login successful!");

        localStorage.setItem("accessToken", data.token);

        setTimeout(() => navigate("/landing"), 800);
    } else {
        setError("Invalid email or password!");
    }
})

      .catch((err) => {
        console.error("LOGIN ERROR:", err);
        setError("Something went wrong. Try again!");
      });
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-10 rounded-xl shadow-xl 
                      w-11/12 max-w-md border border-white/20">
        
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h2>

        {/* Messages */}
        {error && <p className="text-red-400 text-center mb-2">{error}</p>}
        {success && <p className="text-green-400 text-center mb-2">{success}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="px-4 py-3 rounded-md bg-white/20 text-white 
                       placeholder-gray-200 focus:outline-none"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="px-4 py-3 rounded-md bg-white/20 text-white 
                       placeholder-gray-200 focus:outline-none"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-purple-600 text-white font-bold 
                       rounded-md hover:bg-purple-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-white mt-4 text-center">
          Don’t have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
