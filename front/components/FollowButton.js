import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({post}) => {
    const dispatch = useDispatch();
    const { me , followLoading, unfollowLoading } = useSelector((state)=> state.user);
    const isFollowing = me?.Followings.find((v)=> v.id === post.User.id);
    //게시글 작성자의 id가 내 Following리스트에 있다면 => 팔로잉 하고있는 상태 
    const onClickButton = useCallback(()=> {
        if (isFollowing) {
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: post.User.id,
            })
        } else {
            dispatch({
                type: FOLLOW_REQUEST,
                data: post.User.id
            })
        }
    },[isFollowing])
    return (
        <Button
            loading={followLoading || unfollowLoading}
            onClick={onClickButton}
        >
            {isFollowing ? '언팔로우' : '팔로우' }
        </Button>
    )
}

FollowButton.propTypes = {
    post: PropTypes.object.isRequired,
}

export default FollowButton;