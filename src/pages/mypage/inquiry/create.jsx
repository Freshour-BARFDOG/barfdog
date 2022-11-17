import MypageWrapper from '../../../components/mypage/MypageWrapper';
import Wrapper from '../../../components/common/Wrapper';
import Layout from '../../../components/common/Layout';
import MetaTitle from "../../../components/atoms/MetaTitle";
import React from "react";

export default function CreateInquiryPage() {
  return (
    <>
      <MetaTitle title="마이페이지 1:1문의 작성하기" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            마이페이지 1:1문의 작성하기
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}
