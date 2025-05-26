import { useState } from "react";
import { saveToStorage } from "../utils/LocalStorage";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState(""); // folosim email în loc de username
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 401) {
        setMessage("Email sau parolă greșită!");
        setMessageType("error");
        return;
      }

      if (response.status === 403) {
        setMessage("Contul este blocat!");
        setMessageType("error");
        return;
      }

      if (!response.ok) {
        throw new Error("Eroare necunoscută");
      }

      const user = await response.json();
      saveToStorage("currentUser", user);
      setMessage("Autentificare reușită!");
      setMessageType("success");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Eroare la login:", error);
      setMessage("Eroare la conectare!");
      setMessageType("error");
    }
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
