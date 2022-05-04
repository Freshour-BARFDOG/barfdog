import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";

function CouponPage() {
  return (
    <>
      <MetaTitle title="마이페이지 쿠폰" />
      <Layout>
        <Wrapper>
          <MypageWrapper>마이페이지 쿠폰</MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default CouponPage;
