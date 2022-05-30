import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";

function Mypage() {

  return (
    <>
      <MetaTitle title={`정기구독 주문완료`} />
      <Layout>
        <Wrapper>
          구독해주셔서 감사합니다.
          <br />
          바프독은 배송 전 제조한 제품을 가장 신선한 상태로 배송해드립니다
        </Wrapper>
      </Layout>
    </>
  );
}

export default Mypage;
