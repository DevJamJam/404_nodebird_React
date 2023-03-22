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
        }, {
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
    postAdded: false,
}

const ADD_POST = 'ADD_POST';
export const addPost = {
    type: ADD_POST,
}
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
        case ADD_POST:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],
                postAdded: true,
            };
        default:
            return {
                ...state,
            }
    }
};

export default reducer;
