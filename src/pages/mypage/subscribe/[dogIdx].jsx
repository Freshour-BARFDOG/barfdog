import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import { useRouter } from "next/router";

function SubscribeInfoPage() {
  const router = useRouter();
  if(!router.isReady) return;
  const { dogIdx } = router.query;
  
  return (
    <>
      <MetaTitle title="마이페이지 구독관리" />
      <Layout>
        <Wrapper>
          <MypageWrapper>마이페이지 구독정보: 반려견 IDX: {dogIdx}</MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SubscribeInfoPage;
