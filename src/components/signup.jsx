import React, { useState } from "react";
import Bg from "../assets/bg.png";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    role: "Student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "age" ? Number(value) : value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

   fetch("https://game-of-codes.onrender.com/gameofcodes/user/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
})
  .then(async (res) => {
    const raw = await res.text();
    console.log("BACKEND RESPONSE:", raw);

    if (!res.ok) throw new Error(raw);
    return JSON.parse(raw);
  })
  .then((data) => {
    console.log("SUCCESS:", data);

    setSuccess("Signup successful!");
    setError("");

    // Navigate after 1 second
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  })
  .catch((err) => {
    console.error("ERROR:", err);
    setError("Signup failed: " + err.message);
    setSuccess("");
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
          Create Account
        </h2>

        {error && <p className="text-red-400 text-center mb-2">{error}</p>}
        {success && <p className="text-green-400 text-center mb-2">{success}</p>}

        <form onSubmit={handleSignup} className="flex flex-col gap-4" autoComplete="off">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
            className="px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="new-email"
            className="px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none"
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="px-4 py-3 rounded-md bg-white/20 text-black focus:outline-none"
          >
            <option value="Student" className="text-black">Student</option>
            <option value="Parent" className="text-black">Parent</option>
            <option value="Admin" className="text-black">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-white mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
