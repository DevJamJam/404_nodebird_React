import { all, fork, takeLatest } from 'redux-saga/effects';


function* watchAddPost() {
  yield takeLatest("ADD_POST_REQUEST", addPost);
}

export default function* postSaga() {
    yield all([
        fork(watchAddPost),
    ])
}