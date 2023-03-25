import React from 'react';
import { Avatar, Button, Card } from "antd";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me , logOutLoading } = useSelector((state)=> state.user);
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  },[]);

  const logOutStyle = useMemo(() => ({ marginLeft: 40, marginTop: 5 }), []);

  return (
    <>
      <Card
        actions={[
          <div key="twit">
            짹짹
            <br /> {me.Posts.length}
          </div>,
          <div key="followings">
            팔로잉
            <br /> {me.Followings.length}
          </div>,
          <div key="followings">
            팔로워
            <br /> {me.Followers.length}
          </div>,
        ]}
      >
        <Card.Meta avatar={<Avatar>{me.nickname[0]}</Avatar>} title={me.nickname} />
        <Button onClick={onLogOut} style={logOutStyle} loading={logOutLoading}>
          로그아웃
        </Button>
      </Card>
    </>
  );
};

export default UserProfile;
