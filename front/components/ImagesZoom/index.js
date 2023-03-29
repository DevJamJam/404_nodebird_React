import PropTypes from 'prop-types';
import React,{ useState } from 'react';
import Slick from 'react-slick';
import { CloseBtn, Global, Header, ImgWrapper, Indicator, OverLay, SlickWrapper } from './style';


const ImagesZoom = ({images, onClose}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <OverLay>
            <Global />
            <Header>
                <h1>상세 이미지</h1>
                <CloseBtn onClick={onClose} >X</CloseBtn>
            </Header>
            <SlickWrapper>
                <div>
                    <Indicator>
                        <div>
                            {currentSlide +1}
                            {'  '}
                            /
                            {images.length}
                        </div>
                    </Indicator>
                    <Slick
                        initialSlide={0}
                        afterChange={(slide) => setCurrentSlide(slide)}
                        infinite
                        arrows={false}
                        slidesToShow={1}
                        slidesToScroll={1}
                    >
                        {images.map((v)=>(
                            <ImgWrapper key={v.src}>
                                <img src={`http://localhost:3065/${v.src}`} alt={v.src} />
                            </ImgWrapper>
                        ))}
                    </Slick>
                </div>
            </SlickWrapper>
        </OverLay>
    )
}

ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;