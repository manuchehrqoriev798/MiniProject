import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiContext from "../contexts/ApiContext";
import { TEACHER_TOKEN_KEY, TEACHER_EMAIL_KEY } from "../constants/teacherAuth";

export default function Login() {
  const { login } = useContext(ApiContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email: email.trim(), password });
      if (response && response.role === "teacher") {
        // Also populate teacher session keys so TeacherProtectedRoute accepts the token
        localStorage.setItem(TEACHER_TOKEN_KEY, response.access_token);
        localStorage.setItem(TEACHER_EMAIL_KEY, response.email || email.trim());
        navigate("/teacher/dashboard");
      } else {
        navigate("/instructions");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password.");
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

  const inputFocusStyle = {
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

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "30px" }}>Welcome Back!</h2>

        {error && (
          <p style={{ color: "#ff6b6b", marginBottom: "10px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...inputStyle, ...(emailFocus ? inputFocusStyle : {}) }}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, ...(passFocus ? inputFocusStyle : {}) }}
            onFocus={() => setPassFocus(true)}
            onBlur={() => setPassFocus(false)}
            autoComplete="current-password"
          />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "20px" }}>
          No account?{" "}
          <Link to="/signup" style={{ color: "#4cafee" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
