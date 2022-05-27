import React from 'react'
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";


function LoadingPage() {
  return (
    <>
      <MetaTitle title="설문조사 통계" />
      <Layout>
        <Wrapper>설문조사 통계 페이지

          시호의 맞춤 레포트
        </Wrapper>
      </Layout>
    </>
  );
}

export default LoadingPage