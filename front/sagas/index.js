import { all, fork } from 'redux-saga/effects';
import postSaga from './post';
import axios from 'axios';
import userSaga from './user';
import {backUrl} from '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true ; //쿠키 허용 옵션 , 공통설정

export default function* rootSaga() {
    yield all([
        fork(postSaga),
        fork(userSaga),
    ]);
}