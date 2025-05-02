import { useState } from "react";
import QuestionForm from "../components/QuestionForm";
import QuestionCard from "../components/QuestionCard";
import { loadFromStorage, saveToStorage } from "../utils/LocalStorage";

export default function Home() {
  const [questions, setQuestions] = useState(() => {
    return loadFromStorage("questions") || [];
  });

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

  return (
    <div>
      <h2>Adaugă o întrebare</h2>
      <QuestionForm onAddQuestion={addQuestion} />

      <h2>Lista întrebărilor</h2>
      <div>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          onVote={handleQuestionVote}  // Transmite funcția onVote aici
          currentUser={question.author} // Presupunem că întrebarea are un câmp author
          />
      ))}
    </div>
    </div>
  );
}
