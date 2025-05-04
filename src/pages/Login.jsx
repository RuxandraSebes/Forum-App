import { useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/LocalStorage";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = loadFromStorage("users") || [];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setMessage("Utilizator sau parolă greșită!");
      setMessageType("error");
      return;
    }

    saveToStorage("currentUser", user);
    setMessage("Autentificare reușită!");
    setMessageType("success");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Autentificare</h2>

        {message && (
          <p
            style={{
              ...styles.message,
              backgroundColor: messageType === "error" ? "#ffe0e0" : "#e0ffe0",
              color: messageType === "error" ? "#cc0000" : "#006600",
            }}
          >
            {message}
          </p>
        )}

        <input
          type="text"
          placeholder="Nume utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Autentifică-te</button>

        <p style={styles.registerText}>
          Nu ai cont?{" "}
          <Link to="/register" style={styles.link}>
            Înregistrează-te
          </Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    backgroundColor: "#f9f9f9",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    padding: "10px",
    borderRadius: "4px",
    fontWeight: "bold",
    textAlign: "center",
  },
  registerText: {
    textAlign: "center",
    marginTop: "1rem",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
