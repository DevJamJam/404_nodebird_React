import React, { useEffect, useState, useCallback } from 'react';
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import Router from "next/router";
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from "swr";

import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import { useSelector } from 'react-redux';
import { backUrl } from '../config/config';


//fetcher : 주소를 실제로 어떻게 가져올지 ! 
const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state)=> state.user);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  const [followersLimit, setFollowersLimit] = useState(3);
  //SWR 도 hook이다. 
  const { data: followingsData, error: followingError } = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`, fetcher);
  const { data: followersData, error: followerError } = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`, fetcher);
  
  useEffect(()=> {
    if (!(me && me.id)) {
      Router.push('/');
    }
  },[me && me.id]);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  // hook보다 return 이 위에 있으면 안된다 절대!!! 
  if (!me) {
    return <h1>내 정보를 불러오는 중 ....</h1>
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <h1>팔로잉 팔로워 도중 Error 발생 </h1>
  }
  
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={followingsData || []} onClickMore={loadMoreFollowings} loading={!followingError && !followingsData} />
        <FollowList header="팔로워" data={followersData || []} onClickMore={loadMoreFollowers} loading={!followerError && !followersData} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Profile;
