import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";


function OrderHistoryPage() {
  return (
    <>
      <MetaTitle title="마이페이지 주문내역"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>
            마이페이지 주문내역
            {/* 일반결제/정기결제 리스트 모두 한페이지 내에 존재 */}
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default OrderHistoryPage;