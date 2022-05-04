import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";


function Mypage() {
  return (
    <>
      <MetaTitle title="마이페이지 배송현황"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>마이페이지 배송현황</MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default Mypage;