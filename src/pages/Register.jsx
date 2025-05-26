import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const payload = {
      email: email,
      username: username,
      role: "user",
      score: 0.0,
      password: password,
      picture: null,
      phoneNumber: null,
      isBanned: false
    };

    try {
      const response = await fetch("http://localhost:8080/users/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("Înregistrare reușită!");
        setMessageType("success");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        const errorText = await response.text();
        setMessage("Eroare la înregistrare: " + errorText);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Eroare la conectarea cu serverul.");
      setMessageType("error");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2>Înregistrare</h2>

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
        <button type="submit" style={styles.button}>Înregistrează-te</button>

        <p style={styles.registerText}>
          Ai deja cont?{" "}
          <Link to="/login" style={styles.link}>
            Autentifică-te
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
    backgroundColor: "#28a745",
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
