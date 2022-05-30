import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";



function ValidSnsResultPage() {
  return (
    <>
      <MetaTitle title="SNS계정 연동결과" />
      <Layout>
        <Wrapper>
          <h2>계정이 연동되었습니다.</h2>
          <p>가입된 이메일</p>
          <p>연결된 SNS</p>
        </Wrapper>
      </Layout>
    </>
  );
}

export default ValidSnsResultPage;
