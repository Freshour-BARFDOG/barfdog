import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";

function UpdateReviewPage() {
  return (
    <>
      <MetaTitle title="마이페이지 후기 수정" />
      <Layout>
        <Wrapper>
          <MypageWrapper>마이페이지 리뷰 수정 **** CREATE.jsx와 100% 동일 // 기존에 작성한 내용을 업데이트</MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default UpdateReviewPage;
