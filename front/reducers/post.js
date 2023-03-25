export const initialState = {
    mainPosts: [{
        id: 1,
        User:{
            id:1,
            nickname: '사공사',
        },
        content: '첫 번째 게시글 #해시태그 #익스프레쓰',
        Images: [{
            src: 'https://images.unsplash.com/photo-1618183507099-4fa269f9b0ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' 
        },{
            src: 'https://images.unsplash.com/photo-1544241907-f3f1f5ded15a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80'
        },{
            src: 'https://images.unsplash.com/photo-1618183507099-4fa269f9b0ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' 
        },{
            src: 'https://images.unsplash.com/photo-1544241907-f3f1f5ded15a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80'
        }],
        Comments: [{
            User: {
                nickname: '버본',
            },
            content: '오 이제 시작인가?',
        },{
            User: {
                nickname: '베르무트',
            },
            content: 'a secret makes a woman woman',
        }]
    }],
    imagePaths: [],
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
}

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const addPost =(data) =>  ({
    type: ADD_POST_REQUEST,
    data,
});

export const addComment =(data) =>  ({
    type: ADD_COMMENT_REQUEST,
    data,
});

const dummyPost = {
    id: 2,
    content: '더미데이터 인데요',
    User: {
        id: 1,
        nickname: '사공사',
    },
    Images: [],
    Comments:[],
};

const reducer = (state= initialState, action) => {
    switch (action.type) {
        case ADD_POST_REQUEST:
            return {
                ...state,
                addPostLoading:true,
                addPostDone:false,
                addPostError:null,
            }
        case ADD_POST_SUCCESS:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],
                addPostLoading:false,
                addPostDone: true,
            };
        case ADD_POST_FAILURE:
            return{
                ...state,
                addPostLoading:false,
                addPostError:action.error,

            }
        case ADD_COMMENT_REQUEST:
            return {
                ...state,
                addCommentLoading:true,
                addCommentDone:false,
                addCommentError:null,
            }
        case ADD_COMMENT_SUCCESS:
            return {
                ...state,
                addCommentLoading:false,
                addCommentDone: true,
            };
        case ADD_COMMENT_FAILURE:
            return{
                ...state,
                addCommentLoading:false,
                addCommentError:action.error,
            }
        default:
            return {
                ...state,
            }
    }
};

export default reducer;
