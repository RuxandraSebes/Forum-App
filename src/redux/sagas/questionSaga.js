import { call, put, takeEvery } from "redux-saga/effects";
import { FETCH_QUESTIONS, setQuestions, ADD_QUESTION, addQuestionFailure, addQuestionSuccess } from "../actions/questionAction";
import { addQuestionApi } from "../../api/questionApi";

function* fetchQuestionsSaga() {
  try {
    const response = yield call(fetch, "http://localhost:8080/questions/getAll");
    const data = yield response.json();
    yield put(setQuestions(data));
  } catch (error) {
    console.error("Eroare la preluarea întrebărilor:", error);
  } 
}

function* addQuestionSaga(action) {
  try {
    const newQuestion = yield call(addQuestionApi, action.payload);
    yield put(addQuestionSuccess(newQuestion));
    // După adăugare poți și să refetch-ezi lista întrebărilor, dacă vrei:
    // const data = yield call(fetchQuestionsApi);
    // yield put(setQuestions(data));
  } catch (error) {
    yield put(addQuestionFailure(error.message));
  }
}

export default function* questionSaga() {
  yield takeEvery(FETCH_QUESTIONS, fetchQuestionsSaga);
  yield takeEvery(ADD_QUESTION, addQuestionSaga);
}
