import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";

function CreateReviewPage() {
  return (
    <>
      <MetaTitle title="마이페이지 후기 작성" />
      <Layout>
        <Wrapper>
          <MypageWrapper>마이페이지 리뷰 작성</MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default CreateReviewPage;
