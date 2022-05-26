import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

function SelectPlanPage() {
  return (
    <>
      <MetaTitle title="플랜 레시피 선택" />
      <Layout>
        <Wrapper>플랜 래시피 선택 페이지 </Wrapper>
      </Layout>
    </>
  );
}

export default SelectPlanPage;
