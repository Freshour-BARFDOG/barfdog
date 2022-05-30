
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
          <MypageWrapper>
            {/* {`반려견 설문수정: ${dogIdx}`} */}
            <br />
            <h2>결과지를 종합해본 결과</h2>
            <br />
            시호에게는 안정적인 첫 생식 적응이 필요한 스타터프리미엄 레시피를
            추천합니다.
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default Mypage;