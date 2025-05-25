import { useState } from "react";
import VoteButtons from "./VoteButtons";

export default function AnswerCard({ answer, onEdit, onDelete, onVote, question, currentUser, onAccept }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(answer.content);

  console.log("AnswerCard currentUser", currentUser);

  const handleEdit = () => {
    onEdit(answer.id, newText);
    setIsEditing(false);
  };

const currentUsername = typeof currentUser === "string" ? currentUser : currentUser?.username;

const normalize = str => (str || "").trim().toLowerCase();

const questionAuthorUsername = question?.author?.username;

const isAuthor = answer.authorUsername === currentUsername;
const isQuestionAuthor = normalize(questionAuthorUsername) === normalize(currentUsername);

//console.log("question full object:", question);
//console.log("questionAuthorUsername:", questionAuthorUsername);
//console.log("isQuestionAuthor:", isQuestionAuthor);


  const isSolved = question?.status?.toLowerCase() === "solved";

  return (
    <div style={styles.card}>
      <div style={styles.formGroup}>
        <div style={styles.imageContainer}>
          <img
            src={answer.picture || "/images/user-profile-icon-free-vector.jpg"}
            alt="Profile"
            style={styles.image}
          />
        </div>
      </div>


      {!isSolved && isQuestionAuthor && !answer.isAccepted && (
      <button onClick={() => onAccept(answer.id)} style={styles.acceptButton}>
        Acceptă răspunsul
      </button>
    )}

    {/*localQuestion.author === currentUser.username && localQuestion.status !== "solved" && (
  <button onClick={() => updateQuestionStatus("solved")} style={styles.button}>
    Marchează ca rezolvat
  </button>
)*/}



      {isEditing ? (
        <>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={4}
            style={styles.textarea}
          />
          <div style={styles.buttonContainer}>
            <button onClick={handleEdit} style={styles.saveButton}>Salvează</button>
            <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>Renunță</button>
          </div>
        </>
      ) : (
        <>
          <p style={styles.text}>{answer.content}</p>
          <p style={styles.meta}>
            <strong>Autor:</strong> {answer.authorUsername}
          </p>
          <p style={styles.meta}>
            <strong>Data:</strong> {new Date(answer.createdDate).toLocaleString()}
          </p>
         <VoteButtons
  isAnswer={true}
  votes={answer.votes}
  author={answer.authorUsername}
  currentUser={currentUsername}
  targetId={answer.id}
/>


          <div style={styles.buttonContainer}>
            {isAuthor && (
              <div style={styles.buttonContainer}>
                <button onClick={() => setIsEditing(true)} style={styles.editButton}>Editează</button>
                <button onClick={() => onDelete(answer.id)} style={styles.deleteButton}>Șterge</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  image: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  card: {
    border: "1px solid #eee",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    marginTop: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#333",
  },
  meta: {
    fontSize: "14px",
    color: "#777",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "10px",
  },
};
