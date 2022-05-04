import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";

function CartPage() {
  return (
    <>
      <MetaTitle title="레시피" />
      <Layout>
        <Wrapper>레시피 - 터키 & 비프</Wrapper>
      </Layout>
    </>
  );
}

export default CartPage;
