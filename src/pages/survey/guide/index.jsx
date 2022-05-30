import React from "react";
import Link from "next/link";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";

function SurveyGuidePage() {
  return (
    <>
      <MetaTitle title="설문조사 안내" />
      <Layout>
        <Wrapper>
          <div>
            내 반려견에게 꼭 맞는 맞춤 플랜을 위한 정보작성이 1분가량
            소요됩니다.
          </div>
          <Link href="/survey" passHref>
            <a style={{padding:'10px 20px', maxWidth:'280px', height:'44px', backgroundColor:'var(--color-main)', borderRadius:'4px', color:"#fff", boxSizing:'border-box', textAlign:'center'}}>반려견 정보작성 시작하기</a>
          </Link>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SurveyGuidePage;
