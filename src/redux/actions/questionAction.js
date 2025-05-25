export const FETCH_QUESTIONS = "FETCH_QUESTIONS";
export const SET_QUESTIONS = "SET_QUESTIONS";

export const ADD_QUESTION = "ADD_QUESTION";
export const ADD_QUESTION_SUCCESS = "ADD_QUESTION_SUCCESS";
export const ADD_QUESTION_FAILURE = "ADD_QUESTION_FAILURE";

export const fetchQuestions = () => ({ type: FETCH_QUESTIONS });
export const setQuestions = (questions) => ({
  type: SET_QUESTIONS,
  payload: questions,
});


export const addQuestion = (questionData) => ({
  type: ADD_QUESTION,
  payload: questionData,
});

export const addQuestionSuccess = (newQuestion) => ({
  type: ADD_QUESTION_SUCCESS,
  payload: newQuestion,
});

export const addQuestionFailure = (error) => ({
  type: ADD_QUESTION_FAILURE,
  payload: error,
});
