import React, { useCallback } from 'react';
import PropTypes from "prop-types";
import Link from "next/link";
import { Input, Menu, Row, Col } from "antd";
import {useSelector} from 'react-redux';

import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import styled, { createGlobalStyle } from 'styled-components';
import useInput from '../hooks/useInput';
import Router from 'next/router';

const SearchWrapper = styled(Input.Search)`vertical-align: middle`;

//gutter 설정으로 인한 가로 스크롤 생기는 부분 처리를 위해 글로벌 스타일 사용
const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .ant-col:first-child {
    padding-left: 0 !important;
  }
  .ant-col:last-child {
    padding-right: 0 !improtant;
  }
`
const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = useInput('');
  const { me } = useSelector((state)=>state.user);

  const onSearch = useCallback(()=> {
    Router.push(`/hashtag/${searchInput}`);
  },[searchInput]);

  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="search">
          <SearchWrapper 
            enterButton 
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
        <Menu.Item key="signup"><Link href="/signup"><a>회원가입</a></Link></Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://sagongsa-404.tistory.com/" target="_blank" rel="noreferrer noopener">
            Made by SaGongSa
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
