import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import s from './orderFailed.module.scss'
import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";

export default function OrderFailedPage (props) {
  
    return (<>
      <MetaTitle title="결제 실패" />
      <Layout>
        <Wrapper>
          <h1>결제에 실패하였습니다.</h1>
        </Wrapper>
      </Layout>
    </>)
}