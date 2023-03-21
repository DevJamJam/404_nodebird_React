import { Avatar, Button, Card } from "antd";
import { useCallback, useMemo } from "react";

const UserProfile = ({ setIsLoggedIn }) => {
  const onLogOut = useCallback(() => {
    setIsLoggedIn(false);
  });

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
