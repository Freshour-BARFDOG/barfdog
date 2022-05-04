import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from "/src/components/atoms/MetaTitle";


function WithDrawalPage() {
  return (
    <>
      <MetaTitle title="회원탈퇴"/>
      <Layout>
        <Wrapper>
          회원탈퇴
        </Wrapper>
      </Layout>
    </>
  );
}

export default WithDrawalPage;