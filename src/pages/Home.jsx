import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import QuestionForm from "../components/QuestionForm";
import QuestionCard from "../components/QuestionCard";
import { loadFromStorage, saveToStorage } from "../utils/LocalStorage";
import { getQuestionDetails, getQuestionById } from "../api/questionApi";

export default function Home() {
  const [questions, setQuestions] = useState(() => {
    const loaded = loadFromStorage("questions");
    return Array.isArray(loaded) ? loaded : [];
  });

  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showOwnQuestions, setShowOwnQuestions] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage("currentUser") || null);

  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = loadFromStorage("currentUser");
    setCurrentUser(userFromStorage);
  }, []);

  

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestionDetails();
        const data = response.data;
        //console.log("date din API:", data);  // 🟡 vezi ce primești

        if (Array.isArray(data)) {
          setQuestions(data);
          saveToStorage("questions", data);
        } else {
          console.error("Datele întoarse de getQuestionDetails NU sunt un array:", data);
          setQuestions([]);
        }
      } catch (error) {
        console.error("Eroare la încărcarea întrebărilor:", error);
      }
    };

    fetchQuestions();
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

  /*const handleDeleteQuestion = (id) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    saveToStorage("questions", updatedQuestions);

    localStorage.removeItem(`question_data_${id}`);
    localStorage.removeItem(`answers_${id}`);
    localStorage.removeItem(`question_votes_${id}`);
    localStorage.removeItem(`question_vote_${id}`);
  };*/
  const handleDeleteQuestion = (id) => {
  setQuestions(prev => prev.filter(q => q.id !== id));
};


  const filteredQuestions = questions.filter((question) => {
    const title = question.title || "";
    const tags = Array.isArray(question.tags) ? question.tags : [];
    const author = question.author || "";

    const matchesSearch = title.toLowerCase().includes(searchText.toLowerCase());
    const matchesTag = selectedTag
      ? tags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase()))
      : true;
    const matchesOwnQuestions = showOwnQuestions ? author === currentUser : true;

    return matchesSearch && matchesTag && matchesOwnQuestions;
  });

  return (
    <div style={styles.container}>
      {/* Bara de sus */}
      <div style={styles.topBar}>
        <div>
          {currentUser ? (
            <>
              <span style={styles.welcomeText}>👋 Bun venit, <strong>{currentUser?.username}</strong></span>
              <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <div>
              <Link to="/login"><button style={styles.button}>Login</button></Link>
              <Link to="/register"><button style={styles.button}>Register</button></Link>
            </div>
          )}
        </div>
      </div>

      <h2 style={styles.sectionTitle}>📝 Adaugă o întrebare</h2>
      {currentUser ? (
        <QuestionForm onAddQuestion={addQuestion} currentUser={currentUser} />
      ) : (
        <p>Trebuie să fii <Link to="/login">autentificat</Link> pentru a adăuga întrebări.</p>
      )}

      <h2 style={styles.sectionTitle}>📋 Lista întrebărilor</h2>

      {/* Filtrare */}
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="🔍 Căutare după titlu"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="🏷️ Filtrare după tag"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={styles.input}
        />

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showOwnQuestions}
            onChange={() => setShowOwnQuestions(!showOwnQuestions)}
          />
          Afișează doar întrebările mele
        </label>
      </div>

      {/* Întrebări */}
      <div style={styles.questionsList}>
        {filteredQuestions.length === 0 ? (
          <p>Nu există întrebări care să corespundă filtrării.</p>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onVote={handleQuestionVote}
              onDelete={handleDeleteQuestion}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    backgroundColor: "#f8f9fa",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  welcomeText: {
    marginRight: "10px",
    fontSize: "1rem",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  button: {
    marginRight: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  sectionTitle: {
    marginTop: "2rem",
    marginBottom: "1rem",
    fontSize: "1.5rem",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  filterContainer: {
    marginBottom: "2rem",
  },
  checkboxLabel: {
    display: "block",
    marginTop: "0.5rem",
  },
  questionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
};
