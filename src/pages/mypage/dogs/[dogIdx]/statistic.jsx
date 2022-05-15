import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import { useRouter } from "next/router";

function Mypage() {
  const router = useRouter();
  if (!router.isReady) return;
  const { dogIdx } = router.query;



  // 이페이지는 설문결과 구독중회원 
  return (
    <>
      <MetaTitle title={`설문결과: ${dogIdx}`} />
      <Layout>
        <Wrapper>
          <MypageWrapper>{`설문결과(통계): ${dogIdx}`}</MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default Mypage;
