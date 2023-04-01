import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import wrapper from '../store/configureStore';
import AppLayout from "../components/AppLayout";
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import Swal from 'sweetalert2';
import { END } from 'redux-saga';
import axios from 'axios';

const Home = () => { //프론트 ,브라우저 둘 다 실행되는부분 
  const dispatch = useDispatch();
  const { me } = useSelector((state)=> state.user);
  // useSelector()사용 하여 가져온다. 사용자의 로그인 여부 
  const { mainPosts , hasMorePosts, loadPostsLoading, retweetError } = useSelector((state)=>state.post);

  useEffect(()=> { //PostCard.js 에 넣으면 게시글 횟수만큼 리렌더링 되므로 여기다가 넣어준다. 
    if (retweetError) {
      return Swal.fire({ icon: 'error', title: 'Error', text: retweetError ,});
    }
  },[retweetError]);

  useEffect(()=>{
    function onScroll(){
      /*
        console.log(window.scrollY,document.documentElement.clientHeight, document.documentElement.scrollHeight);
        window.scrollY : 얼마나 내렸는지 
        document.documentElement.clientHeight : 화면 보이는 길이 
        document.documentElement.scrollHeight: 총 길이 

        scrollY + clientHeight = scrollHeight 
      */
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll',onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  },[hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post}/>)}
    </AppLayout>
  );
};

//해당부분이 Home 보다 먼저 실행된다. 
/*
  Redux SSR 
    init => 초기 상태로 있다가  ,
    getServerSideProps 실행되고 나면 그 실행된 결과를 Redux의 HYDRATE로 보내준다.
*/
export const getServerSideProps = wrapper.getServerSideProps(async(context)=>{ // context안에 store가 들어있다. 
  //프론트에서 실행 .. 
  const cookie = context.req ? context.req.headers.cookie : '';
  //프론트 서버에서 쿠키 공유 문제를 막아주기 위해 쿠키를 지웠다가, if문이 true일땐 넣어준다. 
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) { 
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  })
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END); // import { END } from 'redux-saga';
  await context.store.sagaTask.toPromise();
});

export default Home;
