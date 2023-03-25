import React from 'react';
import { useSelector } from 'react-redux';

import AppLayout from "../components/AppLayout";
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

const Home = () => {
  const { me } = useSelector((state)=> state.user);
  // useSelector()사용 하여 가져온다. 사용자의 로그인 여부 
  const { mainPosts } = useSelector((state)=>state.post);
  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post}/>)}
    </AppLayout>
  );
};

export default Home;
