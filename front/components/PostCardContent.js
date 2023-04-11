import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {Button, Input} from 'antd';
import { useSelector } from 'react-redux';

const {TextArea} = Input;
const PostCardContent = ({postData, editMode, onCancelModify, onModifyPost }) => {
    const {updatePostLoading, updatePostDone} = useSelector((state)=> state.post);
    const [modifyText, setModifyText] = useState(postData);

    useEffect(()=> {
        if (updatePostDone) {
            onCancelModify();
        }
    },[updatePostDone]);
    
    const onChangeText = useCallback((e)=> {
        setModifyText(e.target.value);
    });

    return (
        <div>
            { editMode 
                ? (
                    <>
                        <TextArea value={modifyText} onChange={onChangeText} />
                        <Button.Group>
                            <Button loading={updatePostLoading} onClick={onModifyPost(modifyText)}>수정</Button>
                            <Button type="danger" onClick={onCancelModify}>취소</Button>
                        </Button.Group>
                    </>
                )
                : postData.split(/(#[^\s#]+)/g).map((v,i)=> {
                if (v.match(/(#[^\s#]+)/)) {
                    return <Link href={`/hashtag/${v.slice(1)}`} key={i}> <a>{v}</a> </Link>
                }
                return v;
            })}
        </div>
    )
};

PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired,
    editMode: PropTypes.bool,
    onCancelModify: PropTypes.func.isRequired,
    onModifyPost: PropTypes.func.isRequired,
};
PostCardContent.propTypes = {
    editMode: false, //isRequired 안 쓸때는 기본값 명시해주자
};

export default PostCardContent;