import { HYDRATE } from 'next-redux-wrapper';

import user from './user';
import post from './post';
import { combineReducers } from 'redux';


// 리듀서를 합쳐주는 combineReducers
// 확장 가능한 형태로 변경 => SSR작업 진행 
const rootReducer = (state, action) => {
    switch(action.type) {
        //서버사이드 렌더링 
        case HYDRATE :
            console.log('HYDRATE', action);
            return action.payload;
        default: {
            const combinedReducer = combineReducers({
                user,
                post,
            });
            return combinedReducer(state,action);
        }
    }
}

export default rootReducer;