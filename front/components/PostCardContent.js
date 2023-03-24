import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({postData}) => (
        <div>
            { postData.split(/(#[^\s#]+)/g).map((v,i)=> {
                if (v.match(/(#[^\s#]+)/)) {
                    return (
                        <Link href={`/hashtag/${v.slice(1)}`} key={i}>
                            <a>{v}</a>
                        </Link>
                    )
                }
                return v;
            })}
        </div>
);

PostCardContent.PropTypes = {
    postData: PropTypes.string.isRequired,
}
export default PostCardContent;