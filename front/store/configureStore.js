import {createWrapper} from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools} from 'redux-devtools-extension';
import reducer from '../reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

// logger를 찍는 middleware 구현 해보기 
const loggerMiddleware = ({dispatch, getState}) => (next) => (action) => {
    console.log(action);
    console.log("dispatch : " , dispatch);
    console.log("getState : " , getState);
    return next(action);
}

const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware,loggerMiddleware];
    const enhancer = process.env.NODE_ENV === 'production' 
    ? compose(applyMiddleware(...middlewares)) : composeWithDevTools(applyMiddleware(...middlewares))
    const store = createStore(reducer,enhancer);
    store.sagaTesk = sagaMiddleware.run(rootSaga);
    return store;
};

const wrapper = createWrapper(configureStore,{
    debug: process.env.NODE_ENV === 'development',
});

export default wrapper;