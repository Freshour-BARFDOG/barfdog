import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

function OrderSheepPage() {
  return (
    <>
      <MetaTitle title="주문서" />
      <Layout>
        <Wrapper>주문서 페이지 </Wrapper>
      </Layout>
    </>
  );
}

export default OrderSheepPage;
