import { HYDRATE } from 'next-redux-wrapper';

import user from './user';
import post from './post';
import { combineReducers } from 'redux';


// 리듀서를 합쳐주는 combineReducers
const rootReducer = combineReducers({
    //서버사이드 렌더링을 위해서 
    index: (state = {}, action) =>  {
        switch (action.type) {
            case HYDRATE:
                console.log('HYDRATE', action);
                return { ...state, ...action.payload}
            default: 
                return state;
        }
    },
    user,
    post,
});

export default rootReducer;