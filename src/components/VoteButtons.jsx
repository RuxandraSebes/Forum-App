import { useEffect, useState } from "react";

export default function VoteButtons({ votes, onVote, author, currentUser, targetId }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(votes);

 useEffect(() => {
    const voted = localStorage.getItem(`voted-${targetId}-${currentUser}`);
    if (voted) {
      setHasVoted(true);
    }
  }, [targetId, currentUser]);

   useEffect(() => {
    localStorage.setItem(`question_votes_${targetId}`, JSON.stringify(localVotes));
  }, [localVotes, targetId]);

 const handleVote = (type) => {
    if (hasVoted || currentUser === author) return;

    const updatedVotes = {
      ...localVotes,
      [type]: (localVotes[type] || 0) + 1,
    };

    setLocalVotes(updatedVotes);
    setHasVoted(true);
    localStorage.setItem(`voted-${targetId}-${currentUser}`, "true");

    onVote(type);
  };

  return (
    <div>
      <button onClick={() => handleVote("up")} disabled={hasVoted || currentUser === author}>👍 {localVotes?.up}</button>
      <button onClick={() => handleVote("down")} disabled={hasVoted || currentUser === author}>👎 {localVotes?.down}</button>
      <span>{(localVotes?.up || 0) - (localVotes?.down || 0)}</span>
    </div>
  );
}
