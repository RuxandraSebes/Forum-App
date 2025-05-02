import { useEffect, useState } from "react";
import { saveToStorage, loadFromStorage } from "../utils/LocalStorage";
import VoteButtons from "./VoteButtons";
import AnswerForm from "./AnswerForm";
import AnswerCard from "./AnswerCard";

export default function QuestionCard({ question, onVote, currentUser }) {
    const [answers, setAnswers] = useState(() => {
        const saved = loadFromStorage(`answers_${question.id}`);
        return saved || [];
      });
  const [refresh, setRefresh] = useState(false);
  const [hasVoted, setHasVoted] = useState(() => {
    const savedVote = loadFromStorage(`question_vote_${question.id}`);
    return savedVote || false;
  }); 

  const addAnswer = (newAnswer) => {
    const updatedAnswers = [newAnswer, ...answers];
  
    // Sortează răspunsurile după voturi (descrescător)
    updatedAnswers.sort((a, b) => {
      const aVotes = (a.votes?.up || 0) - (a.votes?.down || 0);
      const bVotes = (b.votes?.up || 0) - (b.votes?.down || 0);
      return bVotes - aVotes;
    });
  
    setAnswers(updatedAnswers);
    saveToStorage(`answers_${question.id}`, updatedAnswers);
  
    // Actualizează statusul întrebării
    if (question.status === "Received") {
      question.status = "In Progress";
      setRefresh((prev) => !prev);
    }
  };
  
  const handleAnswerEdit = (id, newText) => {
    setAnswers((prev) =>
      prev.map((ans) => (ans.id === id ? { ...ans, text: newText } : ans))
    );
    saveToStorage(`answers_${question.id}`, answers);  // Salvăm răspunsurile actualizate
  };

  const handleAnswerDelete = (id) => {
    setAnswers((prev) => {
      const updatedAnswers = prev.filter((ans) => ans.id !== id);
      saveToStorage(`answers_${question.id}`, updatedAnswers);  // Salvăm răspunsurile după ștergere
      return updatedAnswers;
    });
  };

  const handleQuestionVote = (type) => {
    if (hasVoted) return; // Previne votarea multiplă

    question.votes[type] += 1;
    setHasVoted(true); // Marchează că utilizatorul a votat
    saveToStorage(`question_vote_${question.id}`, true);  // Salvăm că utilizatorul a votat

    // Salvăm voturile întrebării în localStorage
    const updatedVotes = { ...question.votes };
    saveToStorage(`question_votes_${question.id}`, updatedVotes);

    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    if (question.status === "received" && answers.length > 0) {
      question.status = "in progress";
    }
  }, [answers]);
  

  const handleAnswerVote = (id, type) => {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.id === id
          ? {
              ...ans,
              votes: {
                ...ans.votes,
                [type]: (ans.votes?.[type] || 0) + 1,
              },
            }
          : ans
      )
    );
    saveToStorage(`answers_${question.id}`, answers);  // Salvăm răspunsurile actualizate cu voturile
  };


  return (
    <div style={styles.card}>
      <h3>{question.title}</h3>
      {question.picture && (
  <img
    src={question.picture}
    alt="Question visual"
    style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "10px" }}
  />
)}
    {question.author === currentUser && question.status !== "solved" && (
  <button onClick={() => question.status = "solved"}>
    Marchează ca rezolvat
  </button>
)}

      <p><strong>Autor:</strong> {question.author}</p>
      <p><strong>Data creării:</strong> {new Date(question.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> {question.status}</p>
      <p><strong>Tag-uri:</strong> {question.tags.join(", ")}</p>

      <VoteButtons
         votes={question.votes}
        onVote={handleQuestionVote}
        author={question.author}
        />
    <h4>Răspunsuri:</h4>
      {answers.length > 0 ? (
        answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            onEdit={handleAnswerEdit}
            onDelete={handleAnswerDelete}
            onVote={handleAnswerVote}
          />
        ))
      ) : (
        <p>Nu sunt răspunsuri încă.</p>
      )}
      <AnswerForm onAddAnswer={addAnswer} />
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
  },
};

