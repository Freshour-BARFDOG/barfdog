import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";

function Mypage() {

  return (
    <>
      <MetaTitle title={`정기구독 배송안내`} />
      <Layout>
        <Wrapper>
          정기구독 배송안내
        </Wrapper>
      </Layout>
    </>
  );
}

export default Mypage;
