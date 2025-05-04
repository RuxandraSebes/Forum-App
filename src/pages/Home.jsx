import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import QuestionForm from "../components/QuestionForm";
import QuestionCard from "../components/QuestionCard";
import { loadFromStorage, saveToStorage } from "../utils/LocalStorage";

export default function Home() {
   const [questions, setQuestions] = useState(() => {
    return loadFromStorage("questions") || [];
  });
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showOwnQuestions, setShowOwnQuestions] = useState(false);
  const [currentUser, setCurrentUser] = useState("user1"); // sau orice ID/nume de utilizator vrei
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = loadFromStorage("currentUser");
    setCurrentUser(user?.username || null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  const handleQuestionVote = (id, type) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        if (!q.votes) q.votes = { up: 0, down: 0 };
        if (type === "up") q.votes.up += 1;
        else q.votes.down += 1;
      }
      return q;
    });

    setQuestions(updatedQuestions);
    saveToStorage("questions", updatedQuestions);
  };

  const addQuestion = (newQuestion) => {
    const updated = [newQuestion, ...questions];
    updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setQuestions(updated);
    saveToStorage("questions", updated);
  };

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    saveToStorage("questions", updatedQuestions);
  
    // Șterge din localStorage și toate datele asociate
    localStorage.removeItem(`question_data_${id}`);
    localStorage.removeItem(`answers_${id}`);
    localStorage.removeItem(`question_votes_${id}`);
    localStorage.removeItem(`question_vote_${id}`);
  };
  
  const filteredQuestions = questions.filter((question) => {
    // Căutare în titlu
    const matchesSearch = question.title.toLowerCase().includes(searchText.toLowerCase());

    // Filtrare după tag
    const matchesTag = selectedTag ? question.tags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase())) : true;

    // Filtrare după întrebările proprii
    const matchesOwnQuestions = showOwnQuestions ? question.author === currentUser : true;

    return matchesSearch && matchesTag && matchesOwnQuestions;
  });

  return (
    <div>
         <div>
      {/* Bara de sus cu butoane de autentificare */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        {currentUser ? (
          <>
            <span>Bun venit, {currentUser}!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <div>
            <Link to="/login"><button style={{ marginRight: "10px" }}>Login</button></Link>
            <Link to="/register"><button>Register</button></Link>
          </div>
        )}
        </div>
        <h2>Adaugă o întrebare</h2>
{currentUser ? (
  <QuestionForm onAddQuestion={addQuestion} currentUser={currentUser} />
) : (
  <p>Trebuie să fii <Link to="/login">autentificat</Link> pentru a adăuga întrebări.</p>
)}

      <h2>Lista întrebărilor</h2>

      {/* Filtrare */}
      <div>
        <input
          type="text"
          placeholder="Căutare după titlu"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Filtrare după tag"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={styles.input}
        />

        <label>
          <input
            type="checkbox"
            checked={showOwnQuestions}
            onChange={() => setShowOwnQuestions(!showOwnQuestions)}
          />
          Afișează doar întrebările mele
        </label>
      </div>

      {/* Listă întrebări filtrate */}
      <div>
        {filteredQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onVote={handleQuestionVote}
            onDelete={handleDeleteQuestion}
            currentUser={currentUser} // Presupunem că întrebarea are un câmp author
          />
        ))}
      </div>
    </div>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
};