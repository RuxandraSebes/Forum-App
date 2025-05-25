import { all } from "redux-saga/effects";
import questionSaga from "./questionSaga";

export default function* rootSaga() {
  yield all([questionSaga()]);
}
