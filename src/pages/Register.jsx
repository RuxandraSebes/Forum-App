import { useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/LocalStorage";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const users = loadFromStorage("users") || [];

    if (users.find((u) => u.username === username)) {
      alert("Numele de utilizator există deja!");
      return;
    }

    const newUser = { username, password };
    users.push(newUser);
    saveToStorage("users", users);
    alert("Înregistrare reușită!");
    navigate("/login");
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Înregistrare</h2>
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
      <button type="submit">Înregistrează-te</button>
    </form>
  );
}
