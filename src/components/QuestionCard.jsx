import { useEffect, useState } from "react";
import { saveToStorage, loadFromStorage } from "../utils/LocalStorage";
import VoteButtons from "./VoteButtons";
import AnswerForm from "./AnswerForm";
import AnswerCard from "./AnswerCard";

export default function QuestionCard({ question, onVote, onDelete, currentUser }) {
  //console.log("Question object:", question);
  //console.log("QuestionCard currentUser:", currentUser);

 //currentUser = {id: 1, username: 'updatedUser', email: 'updated@example.com'}
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
  const [editedTags, setEditedTags] = useState(question.tags?.join(", ")|| "");

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

  /*const handleAnswerEdit = (id, newText) => {
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
  };*/

  /*const handleQuestionVote = (type) => {
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
  
   
    onVote(type); 
  };*/
/*
const handleQuestionVote = async (type) => {
  const hardcodedUser = {
    id: 1,
    username: "updatedUser",
    email: "updated@example.com",
  };

  if (hasVoted || localQuestion.author.username === hardcodedUser.username) return;

  try {
    const response = await fetch("http://localhost:8080/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: hardcodedUser.id,
        question_id: question.id,
        vote_type: type === "up" ? 1 : -1, // "up" sau "down"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Eroare la vot.");
    }

    const updatedVoteData = await response.json();

    const updatedQuestion = {
      ...localQuestion,
      votes: updatedVoteData,
    };

    setLocalQuestion(updatedQuestion);
    setHasVoted(true);

    if (onVote) onVote(type);
  } catch (error) {
    console.error("Eroare la votul întrebării:", error);
  }
};*/





  /*const handleAnswerVote = (id, type) => {
    const targetAnswer = answers.find((ans) => ans.id === id);
  
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
  };*/

  /*const handleAnswerVote = async (id, type) => {
     const hardcodedUser = {
    id: 1,
    username: "updatedUser",
    email: "updated@example.com",
  };

  const targetAnswer = answers.find((ans) => ans.id === id);
  if (!targetAnswer || targetAnswer.author === hardcodedUser?.id) return;

  try {
    const votePayload = {
      user_id: hardcodedUser.id,
      answer_id: id,
      vote_type: type === "up" ? 1 : -1,
    };

    const response = await fetch("http://localhost:8080/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(votePayload),
    });

    if (!response.ok) {
      const err = await response.text();
      alert("Eroare la vot: " + err);
      return;
    }

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
  } catch (err) {
    console.error("Eroare la vot:", err);
    alert("A apărut o eroare la vot.");
  }
};*/


  /*const handleAcceptAnswer = (id) => {
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
  };*/

  /*const updateQuestionStatus = (newStatus) => {
    const updated = {
      ...localQuestion,
      status: newStatus,
    };
    setLocalQuestion(updated);
    saveToStorage(`question_data_${question.id}`, updated);
  };

  useEffect(() => {
  if (localQuestion.status === "received" && answers.length > 0) {
    updateQuestionStatus("in progress");
  }
}, [answers]);

  const handleAcceptAnswer = async (id) => {
  if (localQuestion.status === "solved") return;

  // Setăm răspunsul acceptat local
  const updatedAnswers = answers.map((ans) =>
    ans.id === id ? { ...ans, isAccepted: true } : { ...ans, isAccepted: false }
  );

  // Update localQuestion status la solved
  const updatedQuestion = {
    ...localQuestion,
    status: "solved",
  };

  setAnswers(updatedAnswers);
  setLocalQuestion(updatedQuestion);

  saveToStorage(`answers_${question.id}`, updatedAnswers);
  saveToStorage(`question_status_${question.id}`, "solved");

  // Trimitem update la backend pentru statusul întrebării
  try {
    const response = await fetch(`http://localhost:8080/questions/${question.id}`, {
      method: "PUT", // sau PUT în funcție de ce ai pe backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "solved" }),
    });

    if (!response.ok) {
      throw new Error("Eroare la actualizarea statusului întrebării");
    }

    const updatedData = await response.json();
    setLocalQuestion(updatedData); // sincronizare cu backend

  } catch (error) {
    console.error("Eroare la actualizarea statusului:", error);
    // aici poți afișa un mesaj de eroare sau face rollback dacă vrei
  }
};*/

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
      // Aici poți implementa rollback sau afișa mesaj de eroare UI
    }
  };

  // useEffect care urmărește answers și schimbă statusul la "in progress" dacă e cazul
  useEffect(() => {
    const checkAndUpdateStatus = async () => {
      if (question.status === "received" && answers.length > 0) {
        await updateQuestionStatus("in progress");
      }
    };

    checkAndUpdateStatus();
  }, [answers]);

   // Funcția pentru acceptarea unui răspuns
  const handleAcceptAnswer = async (id) => {
    if (question.status === "solved") return;

    const updatedAnswers = answers.map((ans) =>
      ans.id === id ? { ...ans, isAccepted: true } : { ...ans, isAccepted: false }
    );

    try {
      // Actualizează statusul întrebării la solved
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



  /*const handleEditQuestion = () => {
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
  };*/
  const [editedContent, setEditedContent] = useState(question.content);

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
      setLocalQuestion(data); // actualizează local întrebare
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
      onDelete(question.id); // notifică părinte că întrebarea a fost ștearsă
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
        const response = await fetch(`http://localhost:8080/answers/byQuestion/${question.id}`);
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

// updateAnswer - trimite PUT la backend
async function updateAnswer(answerId, newContent) {
  // presupun că ai authorId și questionId undeva în context sau props

 // const authorId = currentUser.id;  // sau cum îl ai
  const authorId = currentUser.id; // presupun că ai authorId din currentUser
  const questionId = question.id;

  const response = await fetch(`http://localhost:8080/answers/update?answerId=${answerId}&authorId=${authorId}&questionId=${questionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content: newContent })
  });

  if (!response.ok) throw new Error("Eroare la actualizare răspuns");
  return response.json();
}

// deleteAnswer - trimite DELETE la backend
async function deleteAnswer(answerId) {
  const response = await fetch(`http://localhost:8080/answers/deleteById?id=${answerId}`, {
    method: "DELETE"
  });

  if (!response.ok) throw new Error("Eroare la ștergerea răspunsului");
  return response.text();
}

const handleAnswerEdit = async (id, newText) => {
  try {
    const updatedAnswer = await updateAnswer(id, newText);
    const updatedAnswers = answers.map((ans) =>
      ans.id === id ? updatedAnswer : ans
    );

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
  
                //console.log("question.author:", question.author);
                //console.log("currentUser:", currentUser);
                //console.log("are we displaying edit/delete buttons?", question.author.username === currentUser.username);
             
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

        {question.author === currentUser.username && question.status !== "solved" && (
          <button onClick={() => updateQuestionStatus("solved")} style={styles.button}>
            Marchează ca rezolvat
          </button>
        )}

        {question.author?.username === currentUser.username && (
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
                {question.author.username === currentUser.username && (
                  <>
                    <button onClick={() => setIsEditingQuestion(true)} style={styles.button}>
                      Editează întrebarea
                    </button>
                    <button onClick={handleDeleteQuestion} style={styles.button}>
                      Șterge întrebarea
                    </button>
                  </>
                ) }
              </>
            )}
          </div>
        )}

        <div style={styles.details}>
          <p><strong>Autor:</strong> {question.author.username}</p>
          <p>
  <strong>Data creării:</strong>{" "}
  {question.createdDate
    ? new Date(question.createdDate).toLocaleString()
    : "Necunoscută"}
</p>
          <p style={{ textTransform: 'capitalize' }}><strong>Status:</strong> {question.status}</p>
          <p><strong>Tag-uri:</strong> {question.tags?.join(", ")|| ""}</p>
          <p style={styles.text}><strong>Întrebare:</strong> {question.content}</p>

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
              //onVote={handleAnswerVote}
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
