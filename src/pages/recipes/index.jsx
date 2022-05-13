import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Modal_subscribe from "@src/components/modal/Modal_subscribe";


function CartPage() {
  return (
    <>
      <MetaTitle title="레시피" />
      <Layout>
        <Wrapper>레시피 - 인덱스 페이지</Wrapper>
      </Layout>
      <Modal_subscribe />
    </>
  );
}

export default CartPage;
