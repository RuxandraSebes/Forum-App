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
  const [editedTags, setEditedTags] = useState(question.tags?.join(", ") || "");
  const [editedContent, setEditedContent] = useState(question.content);

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

  const updateQuestionStatus = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Eroare la actualizarea statusului întrebării");
      }

      const updatedData = await response.json();
      setLocalQuestion(updatedData);
    } catch (error) {
      console.error("Eroare la actualizarea statusului:", error);
    }
  };

  useEffect(() => {
    if (question.status === "received" && answers.length > 0) {
      updateQuestionStatus("in progress");
    }
  }, [answers]);

  const handleAcceptAnswer = async (id) => {
    if (question.status === "solved") return;

    const updatedAnswers = answers.map((ans) =>
      ans.id === id ? { ...ans, isAccepted: true } : { ...ans, isAccepted: false }
    );

    try {
      const response = await fetch(`http://localhost:8080/questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "solved" }),
      });

      if (!response.ok) {
        throw new Error("Eroare la actualizarea statusului întrebării");
      }

      const updatedQuestion = await response.json();
      setLocalQuestion(updatedQuestion);
      setAnswers(updatedAnswers);
    } catch (error) {
      console.error("Eroare la acceptarea răspunsului:", error);
    }
  };

  const handleEditQuestion = async () => {
    const updated = {
      title: editedTitle,
      content: editedContent,
    };

    try {
      const response = await fetch(`http://localhost:8080/questions/${question.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalQuestion(data);
        saveToStorage(`question_data_${question.id}`, data);
        setIsEditingQuestion(false);
      } else {
        console.error("Eroare la actualizarea întrebării.");
      }
    } catch (error) {
      console.error("Eroare de rețea:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:8080/questions/${question.id}`, {
        method: "DELETE",
      });

      if (response.ok || response.status === 204) {
        onDelete(question.id);
      } else {
        console.error("Eroare la ștergerea întrebării.");
      }
    } catch (error) {
      console.error("Eroare de rețea:", error);
    }
  };

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch(`http://localhost:8080/answers/question/${question.id}`);
        if (response.ok) {
          const data = await response.json();
          setAnswers(data);
          saveToStorage(`answers_${question.id}`, data);
        } else {
          console.error("Failed to fetch answers");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchAnswers();
  }, [question.id]);

  async function updateAnswer(answerId, newContent) {
    const authorId = currentUser.id;
    const questionId = question.id;

    const response = await fetch(
      `http://localhost:8080/answers/update?answerId=${answerId}&authorId=${authorId}&questionId=${questionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent }),
      }
    );

    if (!response.ok) throw new Error("Eroare la actualizare răspuns");
    return response.json();
  }

  async function deleteAnswer(answerId) {
    const response = await fetch(`http://localhost:8080/answers/deleteById?id=${answerId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Eroare la ștergerea răspunsului");
    return response.text();
  }

  const handleAnswerEdit = async (id, newText) => {
    try {
      const updatedAnswer = await updateAnswer(id, newText);
      const updatedAnswers = answers.map((ans) => (ans.id === id ? updatedAnswer : ans));

      setAnswers(updatedAnswers);
      saveToStorage(`answers_${question.id}`, updatedAnswers);
    } catch (error) {
      console.error("Eroare la actualizarea răspunsului:", error);
    }
  };

  const handleAnswerDelete = async (id) => {
    try {
      await deleteAnswer(id);
      const updatedAnswers = answers.filter((ans) => ans.id !== id);
      setAnswers(updatedAnswers);
      saveToStorage(`answers_${question.id}`, updatedAnswers);
    } catch (error) {
      console.error("Eroare la ștergerea răspunsului:", error);
    }
  };

  const canEditOrDelete =
    question.author?.username === currentUser?.username || currentUser?.role === "moderator";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.imageContainer}>
          <img
            src={"/images/user-profile-icon-free-vector.jpg"}
            alt="Profile"
            style={styles.image}
          />
        </div>
        <h3>{localQuestion.title}</h3>

        {question.picture && (
          <img
            src={question.picture}
            alt="Question visual"
            style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "10px" }}
          />
        )}

        {canEditOrDelete && question.status !== "solved" && (
          <button onClick={() => updateQuestionStatus("solved")} style={styles.button}>
            Marchează ca rezolvat
          </button>
        )}

        {canEditOrDelete && (
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
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
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
                <button onClick={() => setIsEditingQuestion(true)} style={styles.button}>
                  Editează întrebarea
                </button>
                <button onClick={handleDeleteQuestion} style={styles.button}>
                  Șterge întrebarea
                </button>
              </>
            )}
          </div>
        )}

        <div style={styles.details}>
          <p>
            <strong>Autor:</strong> <span>{question.author?.username} ({question.author?.score} pts)</span>
          </p>
          <p>
            <strong>Data creării:</strong>{" "}
            {question.createdDate ? new Date(question.createdDate).toLocaleString() : "Necunoscută"}
          </p>
          <p style={{ textTransform: "capitalize" }}>
            <strong>Status:</strong> {question.status}
          </p>
          <p>
            <strong>Tag-uri:</strong> {question.tags?.join(", ") || ""}
          </p>
          <p style={styles.text}>
            <strong>Întrebare:</strong> {question.content}
          </p>

          <VoteButtons
            isAnswer={false}
            votes={question.votes}
            author={question.author}
            currentUser={currentUser}
            targetId={question.id}
          />
        </div>

        <h4>Răspunsuri:</h4>
        {answers.length > 0 ? (
          answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              onEdit={handleAnswerEdit}
              onDelete={handleAnswerDelete}
              currentUser={currentUser}
              question={question}
              style={styles.answerCard}
              onAccept={handleAcceptAnswer}
            />
          ))
        ) : (
          <p>Nu sunt răspunsuri încă.</p>
        )}

        {question.status !== "solved" && (
          <AnswerForm
            onAddAnswer={addAnswer}
            currentUser={currentUser}
            questionId={question.id}
            questionStatus={question.status}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  text: {
    marginBottom: "15px",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  image: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  },
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
