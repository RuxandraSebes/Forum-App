import { useState } from "react";

export default function QuestionForm({ onAddQuestion }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("received");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newQuestion = {
      id: Date.now(),  // ID unic pe baza timpului
      author: "User",  // Poți adăuga un sistem de autentificare ulterior
      title,
      text,
      createdAt: new Date().toISOString(),
      picture: image,
      status,
      tags: tags.split(",").map(tag => tag.trim()),
      votes: { up: 0, down: 0 },
    };

    onAddQuestion(newQuestion);
    setTitle("");
    setText("");
    setTags("");
    setStatus("received");
    setImage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Titlu:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Text:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tag-uri (separate prin virgulă):</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
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
      <div>
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="received">Received</option>
          <option value="in progress">In Progress</option>
          <option value="solved">Solved</option>
        </select>
      </div>
      <button type="submit">Adaugă întrebare</button>
    </form>
  );
}
