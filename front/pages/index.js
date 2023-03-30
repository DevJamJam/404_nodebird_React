import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from "../components/AppLayout";
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import Swal from 'sweetalert2';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state)=> state.user);
  // useSelector()사용 하여 가져온다. 사용자의 로그인 여부 
  const { mainPosts , hasMorePosts, loadPostsLoading, retweetError } = useSelector((state)=>state.post);
    
  useEffect(()=>{
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  },[]);

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

export default Home;
