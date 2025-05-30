import { useState } from "react";
import { useDispatch } from "react-redux";
import { addQuestion } from "../redux/actions/questionAction";

export default function QuestionForm({ onAddQuestion, currentUser }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("received");
  const [image, setImage] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newQuestion = {
      //id: Date.now(),
      author: { id: currentUser.id, name: currentUser.username || "User" },
      title,
      content,
      createdAt: new Date().toISOString(),
      picture: image,
      status,
      tagNames: tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
      votes: { up: 0, down: 0 },
    };

    //console.log("data", newQuestion.createdAt);
    //console.log("Payload trimis la backend:", newQuestion); 
    dispatch(addQuestion(newQuestion));

    //onAddQuestion(newQuestion);
    setTitle("");
    setContent("");
    setTags("");
    setStatus("received");
    setImage("");
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>

<div style={styles.imageContainer}>
          <img
            src={"/images/user-profile-icon-free-vector.jpg"}
            alt="Profile"
            style={styles.image}
          />
        </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Titlu:</label>
        <input
          type="content"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Text:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={styles.textarea}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Tag-uri (separate prin virgulă):</label>
        <input
          type="content"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={styles.input}
        />
      </div>

      <button type="submit" style={styles.submitButton}>
        Adaugă întrebare
      </button>
    </form>
  );
}

const styles = {
  image: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  form: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    height: "150px",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
