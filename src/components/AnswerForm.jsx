import { useState } from "react";

export default function AnswerForm({ onAddAnswer, currentUser, questionStatus }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAnswer = {
      id: Date.now(),
      author: currentUser || "User",  // You can add an authentication system later
      text,
      createdAt: new Date().toISOString(),
      picture: image,
      votes: { up: 0, down: 0 },
    };

    onAddAnswer(newAnswer);
    setText("");
    setImage("");
  };

  const isDisabled = questionStatus === "solved";

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Răspuns:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={styles.textarea}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Imagine:</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={styles.input}
        />
      </div>
      <button type="submit"  disabled={isDisabled} style={styles.submitButton}>Adaugă răspuns</button>
    </form>
  );
}

const styles = {
  form: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#333",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minHeight: "100px",
    boxSizing: "border-box",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  submitButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
  },
};
