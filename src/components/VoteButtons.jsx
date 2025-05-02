import { useState } from "react";

export default function VoteButtons({ votes, onVote, author, disable = false }) {
    const [hasVoted, setHasVoted] = useState(false);
    const currentUser = "User";

    const handleVote = (type) => {
        if (hasVoted || currentUser === author) return;
    
        onVote(type); // trimitem votul către întrebare sau răspuns
        setHasVoted(true);
      };

    const handleUpvote = () => {
      if (onVote) onVote("up");
    };
  
    const handleDownvote = () => {
      if (onVote) onVote("down");
    };
  
    return (
      <div>
        <button onClick={handleUpvote} disabled={disable}>👍</button>
        <button onClick={handleDownvote} disabled={disable}>👎</button>
        <span>{votes.up - votes.down}</span>
      </div>
    );
  }
  