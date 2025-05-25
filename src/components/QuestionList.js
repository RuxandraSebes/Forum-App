import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "../redux/actions/questionActions";
import QuestionCard from "./QuestionCard";

export default function QuestionsList({ currentUser }) {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questions.questions);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  return (
    <div>
      <h2>Lista întrebărilor</h2>
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          currentUser={{id: 1, username: 'updatedUser', email: 'updated@example.com'}}
          onDelete={() => {}}
          onVote={() => {}}
        />
      ))}
    </div>
  );
}
