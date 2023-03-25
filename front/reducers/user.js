export const initialState = {
    logInLoading: false, //로그인 시도중 
    logInDone: false,
    logInError:null,
    logOutLoading: false, //로그아웃 시도중 
    logOutDone:false,
    logOutError: null,
    signUpLoading: false, // 회원가입 시도중
    signUpDone: false,
    signUpError: null,
    changeNicknameLoading: false, // 닉네임변경 시도중
    changeNicknameDone: false,
    changeNicknameError: null,
    me: null,
    signUpData: {},
    loginData: {},
}

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';
/* 
    user 리듀서에서는 user 데이터만 조작 가능 
    post 리듀서에서는 post 데이터만 조작 가능
    게시글 등록 삭제시 user 데이터도 변경이 가능해야 하는데.. 
    어떻게 해야할까.. user 리듀서 상태를 바꾸고 싶을땐 ?
    => 상태는 action을 통해서만 바꿀 수 있다. 
    => 그러니 action을 만들어 주자! 그리고 post 사가에서 해당 action을 호출! 

*/
const dummyUser = (data) => ({
    ...data,
    nickname: '사공사',
    id: 1,
    Posts: [{id: 1}],
    Followings: [
        { nickname: "버본" },
        { nickname: "베르무트" },
        { nickname: "진" },
        { nickname: "공사버드오피셜" },
    ],
    Followers: [
        { nickname: "버본" },
        { nickname: "베르무트" },
        { nickname: "진" },
        { nickname: "아카이슈이치" },
        { nickname: "공사버드오피셜" },
    ],
})
// action creator
export const loginRequestAction = (data) => {
    return {
        type: LOG_IN_REQUEST,
        data,
    }
}

export const logoutRequestAction = () => {
    return {
        type: LOG_OUT_REQUEST,
    }
}

//이전 state, action을 받아서 다음 state를 돌려주는 함수 
const reducer = (state= initialState, action) => {
    switch (action.type) {
        case LOG_IN_REQUEST:
            return {
                ...state,
                logInLoading: true,
                logInDone:false,
                logInError:null,
            };
        case LOG_IN_SUCCESS:
            return {
                ...state,
                logInLoading: false,
                logInDone: true,
                me: dummyUser(action.data),
            };
        case LOG_IN_FAILURE:
            return {
                ...state,
                logInLoading: false,
                logInError: action.error,
            };
        case LOG_OUT_REQUEST:
            return {
                ...state,
                logOutLoading: true,
                logOutDone:false,
                logOutError:null,
            };
        case LOG_OUT_SUCCESS:
            return {
                ...state,
                logOutLoading:false,
                logOutDone: true,
                me: null,
            };
        case LOG_OUT_FAILURE:
            return {
                ...state,
                logOutLoading: false,
                logOutError: action.error,
            };
        case SIGN_UP_REQUEST:
            return {
                ...state,
                signUpLoading: true,
                signUpDone:false,
                signUpError:null,
            };
        case SIGN_UP_SUCCESS:
            return {
                ...state,
                signUpLoading:false,
                signUpDone: true,
            };
        case SIGN_UP_FAILURE:
            return {
                ...state,
                signUpLoading: false,
                signUpError: action.error,
            };
        case CHANGE_NICKNAME_REQUEST:
            return {
                ...state,
                changeNicknameLoading: true,
                changeNicknameDone:false,
                changeNicknameError:null,
            };
        case CHANGE_NICKNAME_SUCCESS:
            return {
                ...state,
                changeNicknameLoading:false,
                changeNicknameDone: true,
            };
        case CHANGE_NICKNAME_FAILURE:
            return {
                ...state,
                changeNicknameLoading: false,
                changeNicknameError: action.error,
            };
        case ADD_POST_TO_ME:
            return {
                ...state,
                me: {
                    ...state.me,
                    Posts: [{ id: action.data }, ...state.me.Posts],
                }
            }
        case REMOVE_POST_OF_ME:
            return {
                ...state,
                me: {
                    ...state.me,
                    Posts: state.me.Posts.filter((v)=> v.id !== action.data)
                }
            }
        default:
            return state;
    }
};

export default reducer;

