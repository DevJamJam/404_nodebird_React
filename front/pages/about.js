import React from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { END } from 'redux-saga';

import { Avatar, Card } from 'antd';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_USER_REQUEST } from '../reducers/user';

const About = () => {
//getStaticProps 사용해보기 위해 페이지 구성 
    const { userInfo } = useSelector((state) => state.user);

    return (
        <AppLayout>
            <Head>
                <title>SaGongSa | NodeBird</title>
            </Head>
            {userInfo
                ? (
                    <Card
                        actions={[
                        <div key="twit">
                            꽥꽥
                            <br />
                            {userInfo.Posts}
                        </div>,
                        <div key="following">
                            팔로잉
                            <br />
                            {userInfo.Followings}
                        </div>,
                        <div key="follower">
                            팔로워
                            <br />
                            {userInfo.Followers}
                        </div>,
                        ]}
                    >
                        <Card.Meta
                            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                            title={userInfo.nickname}
                            description="노드버드 프로젝트 만드는 사공사"
                        />
                    </Card>
                )
                : null}
    </AppLayout>
    );
};
//getStaticProps : 언제 접속해도 데이터가 바뀔 일이 없을때 
//getServerSideProps : 접속할때 마다 접속한 상황에 따라서 화면이 바뀌어야 할때 
export const getStaticProps = wrapper.getStaticProps(async (context) => {
    console.log('getStaticProps');
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: 1,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default About;