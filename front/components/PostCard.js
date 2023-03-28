import { RetweetOutlined,HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import { Avatar, Button, Card, Comment, List, Popover } from 'antd';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { REMOVE_POST_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';

const PostCard = ({post}) => {
    const id = useSelector((state)=> state.user.me?.id); //옵셔널체이닝 연산자
    const {removePostLoading} = useSelector((state)=>state.post);
    const dispatch = useDispatch();

    const [liked, setLiked] = useState(false);
    const [commentFormOpened, setCommentFormOpened] = useState(false);

    const onRemovePost = useCallback(()=> {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        });
    },[]);

    const onToggleLike = useCallback(() => {
        setLiked((prev) => !prev); // 이전 데이터를 기반으로 반대값을 만들어 준다.
    }, []);
    
    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);
    return(
        <div style={{marginBottom: 10}}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <RetweetOutlined key="retweet" />,
                    liked ? 
                    <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike} /> 
                    : <HeartOutlined key="heart" onClick={onToggleLike} />,
                    <MessageOutlined key="content" onClick={onToggleComment} />,
                    <Popover key="more" content={(
                        <Button.Group>
                            { id && post.User.id === id ? (
                                <>
                                    <Button>수정</Button>
                                    <Button 
                                        type="danger" 
                                        onClick={onRemovePost}
                                        loading={removePostLoading}
                                    >삭제</Button>
                                </>
                            ) : 
                            <Button>신고</Button>}
                        </Button.Group>
                    )}>
                        <EllipsisOutlined />
                    </Popover>,
                ]}
                //만약 작성글 id 와 내 id가 같을땐 팔로워 Button 뜨지 않도록
                extra={id && post.User.id !== id && <FollowButton post={post} />}
            >
                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>} 
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content} />}
                />
            </Card>
            {commentFormOpened && (
                <div>
                    <CommentForm post={post}/>
                    <List
                        header={`${post.Comments.length} 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments}
                        renderItem={(item) => (
                            <li>
                                <Comment
                                    author={item.User.nickname}
                                    avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </div>)}
            {/* <CommentForm />
            <Comments /> */}
        </div>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
};

export default PostCard;
