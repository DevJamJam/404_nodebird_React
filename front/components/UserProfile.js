import { Avatar, Button, Card } from "antd";
import { useCallback, useMemo } from "react";
import { useDispatch } from 'react-redux';
import { logoutAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const onLogOut = useCallback(() => {
    dispatch(logoutAction());
  },[]);

  const logOutStyle = useMemo(() => ({ marginLeft: 40, marginTop: 5 }), []);

  return (
    <>
      <Card
        actions={[
          <div key="twit">
            짹짹
            <br /> 0{" "}
          </div>,
          <div key="followings">
            팔로잉
            <br /> 0{" "}
          </div>,
          <div key="followings">
            팔로워
            <br /> 0{" "}
          </div>,
        ]}
      >
        <Card.Meta avatar={<Avatar>SA</Avatar>} title="SaGongSa" />
        <Button onClick={onLogOut} style={logOutStyle}>
          로그아웃
        </Button>
      </Card>
    </>
  );
};

export default UserProfile;
