import React from 'react'
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";


function LoadingPage() {
  return (
    <>
      <MetaTitle title="로딩 중" />
      <Layout>
        <Wrapper>마이페이지 - 설문조사 - 로딩 페이지</Wrapper>
      </Layout>
    </>
  );
}

export default LoadingPage