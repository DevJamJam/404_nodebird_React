import AppLayout from "../components/AppLayout";
import Head from "next/head";

import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";

const Profile = () => {
  const followerList = [
    { nickname: "버본" },
    { nickname: "베르무트" },
    { nickname: "진" },
    { nickname: "공사버드오피셜" },
  ];
  const followingsList = [
    { nickname: "버본" },
    { nickname: "베르무트" },
    { nickname: "진" },
    { nickname: "공사버드오피셜" },
  ];
  return (
    <>
      <AppLayout>
        <Head>
          <title>My Profile | NodeBird</title>
        </Head>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingsList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
