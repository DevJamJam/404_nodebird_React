import { all, fork } from 'redux-saga/effects';
import postSaga from './post';
import axios from 'axios';
import userSaga from './user';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true ; //쿠키 허용 옵션 , 공통설정

export default function* rootSaga() {
    yield all([
        fork(postSaga),
        fork(userSaga),
    ]);
}