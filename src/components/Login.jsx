import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./pages/customs/login.css";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    firstname: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // For flipping the card, we use a hidden checkbox and sync its checked state with isRegister
  const checkboxRef = useRef(null);

  // Sync checkbox with isRegister
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = isRegister;
    }
  }, [isRegister]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      if (
        !form.firstname ||
        !form.username ||
        !form.password ||
        !form.confirmPassword
      ) {
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
      if (!form.username || !form.password) {
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

  // Handle flip via label click
  const handleFlip = (register) => {
    setIsRegister(register);
    setError("");
  };

  return (
    <div
      id="login"
      className="fixed inset-0 z-[50] flex items-center justify-center min-h-screen w-screen bg-blue-200/80 backdrop-blur-[6px] overflow-y-auto"
      onMouseDown={handleBackdropClick}
    >
      <div ref={cardRef}>
        <div className="container">
          <input
            type="checkbox"
            id="signup_toggle"
            ref={checkboxRef}
            style={{ display: "none" }}
            readOnly
            checked={isRegister}
            tabIndex={-1}
            aria-hidden="true"
          />
          <form className="form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form_front">
              <div className="form_details">Login</div>
              <input
                placeholder="Username"
                className="input"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required={!isRegister}
                disabled={isRegister}
                tabIndex={isRegister ? -1 : 0}
              />
              <input
                placeholder="Password"
                className="input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required={!isRegister}
                disabled={isRegister}
                tabIndex={isRegister ? -1 : 0}
              />
              {error && !isRegister && (
                <div style={{ color: "red", fontSize: "0.9rem", marginBottom: 8 }}>
                  {error}
                </div>
              )}
              <button className="btn" type="submit" disabled={isRegister}>
                Login
              </button>
              <span className="switch">
                Don't have an account?{" "}
                <label
                  className="signup_tog"
                  htmlFor="signup_toggle"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleFlip(true)}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") handleFlip(true);
                  }}
                >
                  Sign Up
                </label>
              </span>
            </div>
            <div className="form_back">
              <div className="form_details">SignUp</div>
              <input
                placeholder="Firstname"
                className="input"
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                autoComplete="given-name"
                required={isRegister}
                disabled={!isRegister}
                tabIndex={isRegister ? 0 : -1}
              />
              <input
                placeholder="Username"
                className="input"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required={isRegister}
                disabled={!isRegister}
                tabIndex={isRegister ? 0 : -1}
              />
              <input
                placeholder="Password"
                className="input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required={isRegister}
                disabled={!isRegister}
                tabIndex={isRegister ? 0 : -1}
              />
              <input
                placeholder="Confirm Password"
                className="input"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required={isRegister}
                disabled={!isRegister}
                tabIndex={isRegister ? 0 : -1}
              />
              {error && isRegister && (
                <div style={{ color: "red", fontSize: "0.9rem", marginBottom: 8 }}>
                  {error}
                </div>
              )}
              <button className="btn" type="submit" disabled={!isRegister}>
                Signup
              </button>
              <span className="switch">
                Already have an account?{" "}
                <label
                  className="signup_tog"
                  htmlFor="signup_toggle"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleFlip(false)}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") handleFlip(false);
                  }}
                >
                  Sign In
                </label>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;