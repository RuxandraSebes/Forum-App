import { useEffect, useState } from "react";
import { saveToStorage, loadFromStorage } from "../utils/LocalStorage";
import VoteButtons from "./VoteButtons";
import AnswerForm from "./AnswerForm";
import AnswerCard from "./AnswerCard";

export default function QuestionCard({ question, onVote, onDelete, currentUser }) {
  const [answers, setAnswers] = useState(() => {
    const saved = loadFromStorage(`answers_${question.id}`);
    return saved || [];
  });

  const [hasVoted, setHasVoted] = useState(() => {
    const savedVote = loadFromStorage(`question_vote_${question.id}`);
    return savedVote || false;
  });

  const [localQuestion, setLocalQuestion] = useState(() => {
    const saved = loadFromStorage(`question_data_${question.id}`);
    return saved || {
      ...question,
      votes: loadFromStorage(`question_votes_${question.id}`) || question.votes,
    };
  });

  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editedTitle, setEditedTitle] = useState(localQuestion.title);
  const [editedTags, setEditedTags] = useState(question.tags.join(", "));

  const addAnswer = (newAnswer) => {
    const updatedAnswers = [newAnswer, ...answers];
    updatedAnswers.sort((a, b) => {
      const aVotes = (a.votes?.up || 0) - (a.votes?.down || 0);
      const bVotes = (b.votes?.up || 0) - (b.votes?.down || 0);
      return bVotes - aVotes;
    });

    setAnswers(updatedAnswers);
    saveToStorage(`answers_${question.id}`, updatedAnswers);

    if (localQuestion.status === "received") {
      updateQuestionStatus("in progress");
    }
  };

  const handleAnswerEdit = (id, newText) => {
    const updatedAnswers = answers.map((ans) =>
      ans.id === id ? { ...ans, text: newText } : ans
    );

    setAnswers(updatedAnswers);
    saveToStorage(`answers_${question.id}`, updatedAnswers);
  };

  const handleAnswerDelete = (id) => {
    setAnswers((prev) => {
      const updatedAnswers = prev.filter((ans) => ans.id !== id);
      saveToStorage(`answers_${question.id}`, updatedAnswers);
      return updatedAnswers;
    });
  };

  const handleQuestionVote = (type) => {
    if (hasVoted || localQuestion.author === currentUser) return;
    const updatedVotes = {
      ...localQuestion.votes,
      [type]: (localQuestion.votes[type] || 0) + 1,
    };

    const updatedQuestion = {
      ...localQuestion,
      votes: updatedVotes,
    };

    setLocalQuestion(updatedQuestion);
    setHasVoted(true);

    saveToStorage(`question_vote_${question.id}`, true);
    saveToStorage(`question_votes_${question.id}`, updatedVotes);
  };

  useEffect(() => {
    if (question.status === "received" && answers.length > 0) {
      question.status = "in progress";
    }
  }, [answers]);

  const handleAnswerVote = (id, type) => {
    const targetAnswer = answers.find((ans) => ans.id === id);
  
    // Nu permite vot dacă autorul e același cu utilizatorul curent
    if (!targetAnswer || targetAnswer.author === currentUser) return;
  
    const updatedAnswers = answers.map((ans) =>
      ans.id === id
        ? {
            ...ans,
            votes: {
              ...ans.votes,
              [type]: (ans.votes?.[type] || 0) + 1,
            },
          }
        : ans
    );
  
    setAnswers(updatedAnswers);
    saveToStorage(`answers_${question.id}`, updatedAnswers);
  };

  const handleAcceptAnswer = (id) => {
    // Dacă întrebarea e deja rezolvată, nu mai poți accepta alt răspuns
    if (localQuestion.status === "solved") return;
  
    const updatedAnswers = answers.map((ans) =>
      ans.id === id ? { ...ans, isAccepted: true } : { ...ans, isAccepted: false }
    );
  
    const updatedQuestion = {
      ...localQuestion,
      status: "solved",
    };
  
    setAnswers(updatedAnswers);
    setLocalQuestion(updatedQuestion);
  
    saveToStorage(`answers_${question.id}`, updatedAnswers);
    saveToStorage(`question_status_${question.id}`, "solved");
  };
  

  const updateQuestionStatus = (newStatus) => {
    const updated = {
      ...localQuestion,
      status: newStatus,
    };
    setLocalQuestion(updated);
    saveToStorage(`question_data_${question.id}`, updated);
  };

  const handleEditQuestion = () => {
    const updated = {
      ...localQuestion,
      title: editedTitle,
      tags: editedTags.split(",").map((tag) => tag.trim()),
    };
    setLocalQuestion(updated);
    saveToStorage(`question_data_${question.id}`, updated);
    setIsEditingQuestion(false);
  };

  const handleDeleteQuestion = () => {
    onDelete(question.id);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3>{localQuestion.title}</h3>

        {question.picture && (
          <img
            src={question.picture}
            alt="Question visual"
            style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "10px" }}
          />
        )}

        {question.author === currentUser && question.status !== "solved" && (
          <button onClick={() => updateQuestionStatus("solved")} style={styles.button}>
            Marchează ca rezolvat
          </button>
        )}

        {question.author === currentUser && (
          <div style={{ marginTop: "10px" }}>
            {isEditingQuestion ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="text"
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                  style={styles.input}
                />
                <button onClick={handleEditQuestion} style={styles.button}>
                  Salvează
                </button>
                <button onClick={() => setIsEditingQuestion(false)} style={styles.button}>
                  Renunță
                </button>
              </>
            ) : (
              <>
                {question.author === currentUser && (
                  <>
                    <button onClick={() => setIsEditingQuestion(true)} style={styles.button}>
                      Editează întrebarea
                    </button>
                    <button onClick={handleDeleteQuestion} style={styles.button}>
                      Șterge întrebarea
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}

        <div style={styles.details}>
          <p><strong>Autor:</strong> {question.author}</p>
          <p><strong>Data creării:</strong> {new Date(question.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {localQuestion.status}</p>
          <p><strong>Tag-uri:</strong> {localQuestion.tags.join(", ")}</p>
          <VoteButtons votes={localQuestion.votes} onVote={handleQuestionVote} author={localQuestion.author} disable={localQuestion.author === currentUser} />
        </div>

        <h4>Răspunsuri:</h4>
        {answers.length > 0 ? (
          answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              onEdit={handleAnswerEdit}
              onDelete={handleAnswerDelete}
              onVote={handleAnswerVote}
              currentUser={currentUser}
              question={localQuestion}
              style={styles.answerCard}
              onAccept={handleAcceptAnswer}
            />
          ))
        ) : (
          <p>Nu sunt răspunsuri încă.</p>
        )}

        <AnswerForm onAddAnswer={addAnswer} currentUser={localQuestion.author}  questionStatus={localQuestion.status}/>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f4f4f4",
  },
  card: {
    width: "60%",
    border: "1px solid #ccc",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    marginRight: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  details: {
    marginTop: "20px",
  },
  answerCard: {
    marginTop: "15px",
    padding: "15px",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};
