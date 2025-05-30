import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadFromStorage } from "../utils/LocalStorage";
import { clearStorage } from "../utils/LocalStorage";

export default function ModeratorPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUser = loadFromStorage("currentUser");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "moderator") {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/users/getAll");
      if (!response.ok) throw new Error("Failed to fetch users");
      let data = await response.json();
      // Exclude moderators and admins
      data = data.filter((u) => u.role !== "moderator" && u.role !== "admin");
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (user) => {
    try {
      if (!user.isBanned) {
        // Ban user: POST to /api/bans
        const response = await fetch("http://localhost:8080/users/ban", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            reason: "Inappropriate behavior",
          }), // add more fields if needed
        });
        if (!response.ok) throw new Error("Failed to ban user");
      } else {
        // Unban user: you may need to implement this in your backend
        const response = await fetch(
          `http://localhost:8080/users/unban/${user.id}`,
          { method: "PUT" }
        );
        if (!response.ok) throw new Error("Failed to unban user");
      }
      fetchUsers();
    } catch (err) {
      setError("Failed to update ban status");
    }
  };

  // Logout functionality
  const handleLogout = () => {
    clearStorage("currentUser");
    navigate("/login");
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 24,
        position: "relative",
      }}
    >
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "8px 16px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Log Out
      </button>
     <button
  style={{
    position: "absolute",
    top: 55,
    right: 20,
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  }}
>
  <a
    href="/"
    style={{
      color: "white",
      textDecoration: "none",
    }}
  >
    Home Page
  </a>
</button>

      <h2>Moderator Panel - User Management</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Username</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Status</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              style={{ background: user.isBanned ? "#ffe0e0" : "#fff" }}
            >
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {user.username}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {user.email}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {user.isBanned ? "Banned" : "Active"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                <button
                  style={{
                    background: user.isBanned ? "#28a745" : "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => handleBanToggle(user)}
                >
                  {user.isBanned ? "Unban" : "Ban"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
