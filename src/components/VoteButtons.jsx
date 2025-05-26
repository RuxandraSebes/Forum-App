import { useEffect, useState } from "react";

export default function VoteButtons({
  votes,
  author,
  currentUser,
  targetId,
  isAnswer,
}) {
  const [hasVoted, setHasVoted] = useState(false);
  const [localVotes, setLocalVotes] = useState({ up: 0, down: 0 });

  /*useEffect(() => {
    setLocalVotes(votes || { up: 0, down: 0 });
  }, [votes]);*/

   useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch("http://localhost:8080/votes");
        const data = await response.json();

        const relevantVotes = data.filter((vote) =>
          isAnswer ? vote.answerId === targetId : vote.questionId === targetId
        );

        const up = relevantVotes.filter(v => v.voteType === 1).length;
        const down = relevantVotes.filter(v => v.voteType === -1).length;

        setLocalVotes({ up, down });
      } catch (err) {
        console.error("Eroare la fetch voturi:", err);
      }
    };

    fetchVotes();
  }, [targetId, isAnswer]);

  useEffect(() => {
    const voted = localStorage.getItem(`voted-${isAnswer ? 'answer' : 'question'}-${targetId}-${currentUser}`);
    if (voted) {
      setHasVoted(true);
    }
  }, [targetId, currentUser, isAnswer]);

  const handleVote = async (type) => {
    if (hasVoted || currentUser === author) return;

    const voteValue = type === "up" ? 1 : -1;

    const payload = {
      userId: currentUser.id, // hardcodat temporar
      voteType: voteValue,
    };

    if (isAnswer) {
      payload.answerId = targetId;
    } else {
      payload.questionId = targetId;
    }

    try {
      const response = await fetch("http://localhost:8080/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Eroare la vot.");
      }

      const updatedVotes = { ...localVotes };
      updatedVotes[type] = (updatedVotes[type] || 0) + 1;
      setLocalVotes(updatedVotes);

      localStorage.setItem(`voted-${isAnswer ? 'answer' : 'question'}-${targetId}-${currentUser}`, "true");
      setHasVoted(true);

    } catch (err) {
      console.error("Eroare la vot:", err);
    }
  };

  return (
    <div>
      <button onClick={() => handleVote("up")} disabled={hasVoted || currentUser === author}>
        👍 {localVotes.up}
      </button>
      <button onClick={() => handleVote("down")} disabled={hasVoted || currentUser === author}>
        👎 {localVotes.down}
      </button>
      <span>{localVotes.up - localVotes.down}</span>
    </div>
  );
}
