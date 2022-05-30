import React from 'react'
import MetaTitle from "/src/components/atoms/MetaTitle";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";



function ValidSnsPage() {
  return (
    <>
      <MetaTitle title="SNS계정 연동확인" />
      <Layout>
        <Wrapper>
          <h2>
            해당 번호는 이미 가입된 계정이 있습니다. 확인을 누르면 계정이
            연동됩니다.
          </h2>
        </Wrapper>
      </Layout>
    </>
  );
}

export default ValidSnsPage;