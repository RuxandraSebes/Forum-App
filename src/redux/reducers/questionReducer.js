import { SET_QUESTIONS, ADD_QUESTION_SUCCESS,
  ADD_QUESTION_FAILURE, } from "../actions/questionAction";

const initialState = {
  questions: [],
};

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_QUESTIONS:
      return { ...state, questions: action.payload };
    
    case ADD_QUESTION_SUCCESS:
      return {
        ...state,
        questions: [...state.questions, action.payload],
        error: null,
      };

    case ADD_QUESTION_FAILURE:
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
};

export default questionReducer;
