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
          주문완료
        </Wrapper>
      </Layout>
    </>
  );
}

export default Mypage;
