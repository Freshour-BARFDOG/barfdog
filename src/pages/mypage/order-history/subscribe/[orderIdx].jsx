import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";

function SubScribe_OrderHistoryPage() {
  return (
    <>
      <MetaTitle title="마이페이지 주문내역: 정기구독" />
      <Layout>
        <Wrapper>
          <MypageWrapper>마이페이지 주문내역 - 정기구독 </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SubScribe_OrderHistoryPage;
