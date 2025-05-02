import { useState } from "react";
import VoteButtons from "./VoteButtons";

export default function AnswerCard({ answer, onEdit, onDelete, onVote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(answer.text);

  const handleEdit = () => {
    onEdit(answer.id, newText);
    setIsEditing(false);
  };

  return (
    <div style={styles.card}>
      {isEditing ? (
        <>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={4}
          />
          <button onClick={handleEdit}>Salvează</button>
          <button onClick={() => setIsEditing(false)}>Renunță</button>
        </>
      ) : (
        <>
          <p>{answer.text}</p>
          <p><strong>Autor:</strong> {answer.author}</p>
          <p><strong>Data:</strong> {new Date(answer.createdAt).toLocaleString()}</p>

          <VoteButtons
            votes={answer.votes}
            onVote={(type) => onVote(answer.id, type)}
            author={answer.author}
          />

          <button onClick={() => setIsEditing(true)}>Editează</button>
          <button onClick={() => onDelete(answer.id)}>Șterge</button>
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #eee",
    background: "#f9f9f9",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "6px",
  },
};
