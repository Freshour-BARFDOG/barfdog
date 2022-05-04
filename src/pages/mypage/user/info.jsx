import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";


function UserInfoPage() {
  return (
    <>
      <MetaTitle title="마이페이지 회원정보변경"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>회원정보 변경</MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default UserInfoPage;