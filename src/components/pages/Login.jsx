import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      if (!form.email || !form.password || !form.confirmPassword || !form.username) {
        setError("Please fill in all fields.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      // Close the page after successful registration
      navigate(-1);
    } else {
      if (!form.email || !form.password) {
        setError("Please fill in all fields.");
        return;
      }
      // Close the page after successful login
      navigate(-1);
    }
  };

  // Handle click outside the login card to close the page
  const handleBackdropClick = (e) => {
    // If the click is on the backdrop (not inside the card), close
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      navigate(-1);
    }
  };

  return (
    <div
      id="login"
      className="fixed inset-0 z-[50] flex items-center justify-center min-h-screen w-screen bg-blue-200/80 backdrop-blur-[6px] overflow-y-auto"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="lagcard relative w-[300px] md:w-[400px] rounded-2xl bg-white z-[20] shadow-lg shadow-[#3d4a83]/10 px-6 py-8 sm:p-8 m-4 flex flex-col gap-2 login-card"
      >
        <img src="/comboImg/offerbg.webp" alt="offerBg" className="absolute top-0 left-0 w-full h-full rounded-2xl object-cover opacity-10 z-[-10]" />
        <h2
          className="text-3xl font-bold text-[#3d4a83] mb-2 text-center font-saintCarell login-title"
        >
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        <p
          className="text-center font-Refrigerator-medium text-[#848db6] mb-6"
        >
          {isRegister
            ? "Sign up to get started with Sovereign Clothing"
            : "Sign in to your account"}
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {isRegister && (
            <div>
              <label
                htmlFor="username"
                className="block text-black font-Refrigerator-medium mb-1 font-medium"
              >
                Username
              </label>
              <input
                className="w-full rounded-lg border border-[#3d4a83] px-4 py-2 font-Refrigerator-medium outline-none transition focus:ring-2 focus:ring-[#3d4a83] login-input"
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Your username"
                required
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-black font-Refrigerator-medium mb-1 font-medium"
            >
              Email
            </label>
            <input
              className="w-full rounded-lg border border-[#3d4a83] px-4 py-2 font-Refrigerator-medium outline-none transition focus:ring-2 focus:ring-[#3d4a83] login-input"
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@email.com"
              required
              inputMode="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-black font-Refrigerator-medium mb-1 font-medium"
            >
              Password
            </label>
            <input
              className="w-full rounded-lg border border-[#3d4a83] px-4 py-2 font-Refrigerator-medium outline-none transition focus:ring-2 focus:ring-[#3d4a83] login-input"
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="••••••••"
              required
            />
          </div>
          {isRegister && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-black font-Refrigerator-medium mb-1 font-medium"
              >
                Confirm Password
              </label>
              <input
                className="w-full rounded-lg border border-[#3d4a83] px-4 py-2 font-Refrigerator-medium outline-none transition focus:ring-2 focus:ring-[#3d4a83] login-input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="••••••••"
                required
              />
            </div>
          )}
          {error && (
            <div className="text-red-500 text-sm text-center mt-1">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-Refrigerator-medium tracking-wide bg-[#3d4a83] text-white font-semibold text-[1.1rem] border-none mt-2 cursor-pointer transition hover:bg-[#495db5] login-button"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <div
          className="mt-6 text-center flex flex-wrap justify-center items-center gap-1 text-base"
        >
          <span
            className="text-black font-Refrigerator-medium"
          >
            {isRegister ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button
            className="ml-2 text-[#3d4a83] font-bold font-Refrigerator-medium bg-none border-none cursor-pointer underline text-base hover:underline focus:outline-none"
            onClick={() => {
              setIsRegister((prev) => !prev);
              setError("");
            }}
            type="button"
            tabIndex={0}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </div>
      </div>
      {/* Responsive styles for very small screens */}
      <style>
        {`
          @media (max-width: 480px) {
            .login-card {
              padding: 1rem !important;
              max-width: 98vw !important;
              margin: 0.5rem !important;
            }
            .login-title {
              font-size: 1.5rem !important;
            }
            .login-input {
              font-size: 0.95rem !important;
              padding: 0.4rem 0.7rem !important;
            }
            .login-button {
              font-size: 1rem !important;
              padding: 0.4rem 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;