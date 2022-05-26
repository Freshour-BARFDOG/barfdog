import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

function OrderCompletedPage() {
  return (
    <>
      <MetaTitle title="주문완료" />
      <Layout>
        <Wrapper>주문완료 페이지 </Wrapper>
      </Layout>
    </>
  );
}

export default OrderCompletedPage;
