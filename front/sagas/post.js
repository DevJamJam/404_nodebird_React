import axios from 'axios';
import { all, call, fork, put, takeLatest, throttle } from 'redux-saga/effects';
import { 
    ADD_COMMENT_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_POST_FAILURE,
    ADD_POST_REQUEST,
    ADD_POST_SUCCESS, 
    LIKE_POST_FAILURE, 
    LIKE_POST_REQUEST, 
    LIKE_POST_SUCCESS, 
    LOAD_HASHTAG_POSTS_FAILURE, 
    LOAD_HASHTAG_POSTS_REQUEST, 
    LOAD_HASHTAG_POSTS_SUCCESS, 
    LOAD_POSTS_FAILURE, 
    LOAD_POSTS_REQUEST, 
    LOAD_POSTS_SUCCESS, 
    LOAD_POST_FAILURE, 
    LOAD_POST_REQUEST, 
    LOAD_POST_SUCCESS, 
    LOAD_USER_POSTS_FAILURE, 
    LOAD_USER_POSTS_REQUEST, 
    LOAD_USER_POSTS_SUCCESS, 
    REMOVE_POST_FAILURE,
    REMOVE_POST_REQUEST,
    REMOVE_POST_SUCCESS, 
    RETWEET_FAILURE, 
    RETWEET_REQUEST, 
    RETWEET_SUCCESS, 
    UNLIKE_POST_FAILURE, 
    UNLIKE_POST_REQUEST,
    UNLIKE_POST_SUCCESS,
    UPDATE_POST_FAILURE,
    UPDATE_POST_REQUEST,
    UPDATE_POST_SUCCESS,
    UPLOAD_IMAGES_FAILURE,
    UPLOAD_IMAGES_REQUEST,
    UPLOAD_IMAGES_SUCCESS
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0 }`);
  // get방식은 data를 넣으려면 쿼리스트링 사용 , 주소뒤에 ? key=value 형식 구분은 & 
}

function* loadPosts(action) {
  try {
      const result = yield call(loadPostsAPI, action.lastId);
      yield put({
        type: LOAD_POSTS_SUCCESS,
        data: result.data,
      });
  } catch(err) {
      yield put({
        type: LOAD_POSTS_FAILURE,
        error: err.response.data,
      });
  }
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
  //한글 들어갈때 error 나므로 encodeURIComponent()
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data);
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);
}

function* retweet(action) {
  try {
    console.log(action.data);
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data,
    });
  }
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`); 
}

function* likePost(action) {
  try {
      const result = yield call(likePostAPI, action.data);
      yield put({
        type: LIKE_POST_SUCCESS,
        data: result.data,
      });
  } catch(err) {
      yield put({
        type: LIKE_POST_FAILURE,
        error: err.response.data,
      });
  }
}
function unLikePostAPI(data) {
  return axios.delete(`/post/${data}/like`); 
}

function* unLikePost(action) {
  try {
      const result = yield call(unLikePostAPI, action.data);
      yield put({
        type: UNLIKE_POST_SUCCESS,
        data: result.data,
      });
  } catch(err) {
      console.error(err);
      yield put({
        type: UNLIKE_POST_FAILURE,
        error: err.response.data,
      });
  }
}

function addPostAPI(data) {
    return axios.post('/post', data); //formData는 {} 감싸면 안된다. 바로 데이터로 넣어줘야한다.
}

function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({
          type: ADD_POST_SUCCESS,
          data: result.data,
        });
        yield put({
          type: ADD_POST_TO_ME,
          data: result.data.id,
        })
    } catch(err) {
        yield put({
          type: ADD_POST_FAILURE,
          error: err.response.data,
        });
    }
}

function updatePostAPI(data) {
  return axios.patch(`/post/${data.PostId}` , data);
}

function* updatePost(action) {
  try {
      const result = yield call(updatePostAPI, action.data);
      yield put({
        type: UPDATE_POST_SUCCESS,
        data: result.data,
      });
  } catch(err) {
      yield put({
        type: UPDATE_POST_FAILURE,
        error: err.response.data,
      });
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function* removePost(action) {
  try {
      const result = yield call(removePostAPI,action.data);
      //post 리듀서 조작
      yield put({
        type: REMOVE_POST_SUCCESS,
        data: result.data,
      });
      //user 리듀서 조작 
      yield put({
        type: REMOVE_POST_OF_ME,
        data: result.data,
      })
  } catch(err) {
      yield put({
        type: REMOVE_POST_FAILURE,
        error: err.response.data,
      });
  }
}


function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data); //POST /post/1/comment 
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}


function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnLikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}


function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchUpdatePost() {
  yield takeLatest(UPDATE_POST_REQUEST, updatePost);
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
    yield all([
        fork(watchLoadPosts),
        fork(watchLoadPost),
        fork(watchLoadUserPosts),
        fork(watchLoadHashtagPosts),
        fork(watchUploadImages),
        fork(watchRetweet),
        fork(watchLikePost),
        fork(watchUnLikePost),
        fork(watchAddPost),
        fork(watchUpdatePost),
        fork(watchRemovePost),
        fork(watchAddComment),
    ])
}