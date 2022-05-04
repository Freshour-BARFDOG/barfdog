
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

  return (
    <>
      <MetaTitle title={`설문수정: ${dogIdx}`} />
      <Layout>
        <Wrapper>
          <MypageWrapper>{`반려견 설문수정: ${dogIdx}`}</MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default Mypage;