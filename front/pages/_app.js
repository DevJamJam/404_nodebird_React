import PropTypes from "prop-types";
import Head from "next/head";
import "antd/dist/antd.css";

import React from 'react';
import wrapper from '../store/configureStore';

const NodeBird = ({ Component }) => {
  // Component = pages의 파일 return 부분이 들어오게 된다.  
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>GongsaBird</title>
        <link rel='icon' href='/sagongsa_bird.png'/>
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);
