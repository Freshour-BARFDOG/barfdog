import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";


function SNSManagementPage() {
  return (
    <>
      <MetaTitle title="마이페이지 SNS연동"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>간편로그인 SNS 변경</MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SNSManagementPage;