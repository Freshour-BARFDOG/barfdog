import React from 'react';
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";



function CartPage() {
  return (
    <>
      <MetaTitle title="장바구니" />
      <Layout>
        <Wrapper>장바구니</Wrapper>
      </Layout>
    </>
  );
}

export default CartPage