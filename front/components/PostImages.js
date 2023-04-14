import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from './ImagesZoom';
//폴더를 부르면 자동으로 index를 불러온다.


const PostImages = ({ images }) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);
    console.log(images);
    const onZoom = useCallback(()=> {
        setShowImagesZoom(true);
    },[]);
    const onClose = useCallback(()=> {
        setShowImagesZoom(false);
    },[]);

    if (images.length === 1) {
        return(
            <>
                <img role="presentation" style={{ maxHeight: '200px', maxWidth: '200px'}} src={`${images[0].src.replace(/\/thumb\//, '/original/')}`} alt={images[0].src} onClick={onZoom} />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    }
    if (images.length === 2) {
        return(
            <>
                <img role="presentation" style={{width: '50%', display: 'inline-block'}} src={`${images[0].src.replace(/\/thumb\//, '/original/')}`} alt={images[0].src} onClick={onZoom} />
                <img role="presentation" style={{width: '50%', display: 'inline-block' }} src={`${images[1].src}`}alt={images[1].src.replace(/\/thumb\//, '/original/')} onClick={onZoom} />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    }
    return(
        <> 
            <div>
                <img role="presentation" width="50%" src={`${images[0].src.replace(/\/thumb\//, '/original/')}`} alt={images[0].src} onClick={onZoom} />
                <div
                    role="presentation"
                    style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
                    onClick={onZoom}
                >
                    <PlusOutlined />
                    <br />
                    {images.length - 1}
                    개의 사진 더보기
                </div>
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </div>
        </>
    )
}

PostImages.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object),
}

export default PostImages;