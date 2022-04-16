import React from 'react';
import Layout from '../../components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";

function Mypage() {
  return (
    <Layout>
      <Wrapper>
        <MypageWrapper>
          마이페이지 인덱스 내용물자리
        </MypageWrapper>
      </Wrapper>
    </Layout>
  );
}

export default Mypage;