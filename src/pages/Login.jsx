import { useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/LocalStorage";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = loadFromStorage("users") || [];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert("Utilizator sau parolă greșită!");
      return;
    }

    saveToStorage("currentUser", user);
    alert("Autentificare reușită!");
    navigate("/");
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Autentificare</h2>
      <input
        type="text"
        placeholder="Nume utilizator"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Autentifică-te</button>
    </form>
  );
}
