export const initialState = {
    isLoggedIn: false,
    user:null,
    signUpData: {},
    loginData: {},
}

// action creator
export const loginAction = (data) => {
    return {
        type: 'LOG_IN',
        data,
    }
}
export const logoutAction = () => {
    return {
        type: 'LOG_OUT',
    }
}

//이전 state, action을 받아서 다음 state를 돌려주는 함수 
const reducer = (state= initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                isLoggedIn: true,
                user: action.data,
            };
        case 'LOG_OUT':
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        default:
            return state;
    }
};

export default reducer;

