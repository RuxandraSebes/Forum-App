import { useState } from "react";

export default function AnswerForm({ onAddAnswer, currentUser, questionStatus }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAnswer = {
      id: Date.now(),
      author: currentUser || "User", 
      text,
      createdAt: new Date().toISOString(),
      picture: "/images/user-profile-icon-free-vector.jpg", 
      votes: { up: 0, down: 0 },
    };
    console.log("author", newAnswer.author);

    onAddAnswer(newAnswer);
    setText("");
  };

  const isDisabled = questionStatus === "solved";

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
       <div style={styles.formGroup}>
        <div style={styles.imageContainer}>
          <img
            src={"/images/user-profile-icon-free-vector.jpg"}
            alt="Profile"
            style={styles.image}
          />
        </div>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Răspuns:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={styles.textarea}
        />
      </div>
     
      <button type="submit" disabled={isDisabled} style={styles.submitButton}>Adaugă răspuns</button>
    </form>
  );
}

const styles = {
  form: {
    margin: "20px",
    backgroundColor: "#f9f9f9",
    padding: "50px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "50%",
    maxWidth: "500px",
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
  imageContainer: {
    marginBottom: "15px",
  },
  image: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
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
