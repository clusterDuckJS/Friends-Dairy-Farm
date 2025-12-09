// /src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser, loginUser } from "../../utils/auth";
import "./login.css";
import LOGO from '../../assets/logo.webp'
import { useToast } from "../../Context/ToastContext";

export default function Login() {
  const [tab, setTab] = useState("login");
  const toast = useToast();

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      return toast.error("Enter both email and password.");
    }

    setLoading(true);
    try {
      await loginUser({ email: loginEmail.trim(), password: loginPassword });
      // on success supabase creates the session automatically
      navigate("/products");
    } catch (err) {
      // show clearer message if available
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      return toast.error("Name, email and password are required.");
    }
    if (signupPassword !== signupConfirm) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    try {
      await signUpUser({
        email: signupEmail.trim(),
        password: signupPassword,
        fullName: signupName.trim(),
        phone: signupPhone.trim(),
      });

      toast.success(
        "Account created. If email confirmation is enabled, check your inbox. Now switch to Login."
      );

      // reset signup fields and switch to login tab
      setSignupName("");
      setSignupEmail("");
      setSignupPhone("");
      setSignupPassword("");
      setSignupConfirm("");
      setTab("login");
    } catch (err) {
      toast.error(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-header">
          <img src={LOGO} alt="logo" className="auth-logo" />
          <h1 className="bold mb-1">Welcome Back</h1>
          <p>Login or create an account to schedule deliveries</p>
        </div>

        <div className="card">
          <div className="tab-control">
            <button
              className={`tab-btn ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-btn ${tab === "signup" ? "active" : ""}`}
              onClick={() => setTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {tab === "login" ? (
            <form className="form" onSubmit={handleLogin}>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your.email@example.com"
              />

              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="********"
              />

              <button type="submit" className="primary" disabled={loading}>
                {loading ? "Please wait..." : "Login"}
              </button>
            </form>
          ) : (
            <form className="form" onSubmit={handleSignup}>
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Your name"
              />

              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="your.email@example.com"
              />

              <label className="label">Phone Number</label>
              <input
                className="input"
                type="tel"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                placeholder="+91 XXXXXX XXXXX"
              />

              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="********"
              />

              <label className="label">Confirm Password</label>
              <input
                className="input"
                type="password"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                placeholder="********"
              />

              <button type="submit" className="primary" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}

          <p className="tos">
            By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
