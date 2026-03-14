import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // focus states
  const [focusField, setFocusField] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Full name, email, and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.signup({
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        email: email.trim(),
        password,
        role,
      });

      // Store token returned on signup
      localStorage.setItem("authToken", response.access_token);
      navigate("/instructions");
    } catch (err) {
      setError(err.message || "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0a1f44, #1b3b70, #2c5590)",
    fontFamily: "'Segoe UI', sans-serif",
  };

  const cardStyle = {
    width: "400px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(29, 53, 87, 0.95)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    color: "#fff",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f5f7fa",
    color: "#0d1b2a",
    fontSize: "16px",
    outline: "none",
    transition: "0.3s",
    boxSizing: "border-box",
  };

  const focusStyle = {
    border: "1px solid #4cafee",
    boxShadow: "0 0 8px rgba(76, 175, 238, 0.4)",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: loading ? "#888" : "#4cafee",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "0.3s",
  };

  const isFocus = (field) => (focusField === field ? focusStyle : {});

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "30px" }}>Create an Account</h2>

        {error && (
          <p style={{ color: "#ff6b6b", marginBottom: "10px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ ...inputStyle, ...isFocus("name") }}
            onFocus={() => setFocusField("name")}
            onBlur={() => setFocusField(null)}
          />
          <input
            placeholder="Phone Number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ ...inputStyle, ...isFocus("phone") }}
            onFocus={() => setFocusField("phone")}
            onBlur={() => setFocusField(null)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...inputStyle, ...isFocus("email") }}
            onFocus={() => setFocusField("email")}
            onBlur={() => setFocusField(null)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, ...isFocus("password") }}
            onFocus={() => setFocusField("password")}
            onBlur={() => setFocusField(null)}
            autoComplete="new-password"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ ...inputStyle, padding: "12px" }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "20px" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#4cafee" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
