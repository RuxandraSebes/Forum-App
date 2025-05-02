import { useState } from "react";

export default function AnswerForm({ onAddAnswer }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAnswer = {
      id: Date.now(),
      author: "User",  // Poți adăuga un sistem de autentificare ulterior
      text,
      createdAt: new Date().toISOString(),
      picture: image,
      votes: { up: 0, down: 0 },
    };

    onAddAnswer(newAnswer);
    setText("");
    setImage("");
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Răspuns:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Imagine:</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <button type="submit">Adaugă răspuns</button>
    </form>
  );
}
