import MypageWrapper from '/src/components/mypage/MypageWrapper';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import MetaTitle from "/src/components/atoms/MetaTitle";
import React from "react";

export default function InquiryArticlePage() {
  return (
    <>
      <MetaTitle title="마이페이지 1:1 문의 확인" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            마이페이지 1:1문의 확인하기
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}




export async function getServerSideProps ({req, query}) {
  
  let DATA = null;
  const id = Number(query.id);
  
  
  // ! TODO: 추후 데이터가 없는 경우도 Redir
  if(typeof id !== 'number' || !id) {
    return {
      redirect : {
        destination: '/mypage/inquiry'
      }
    }
  }
  
  
  return {
    props: {data: DATA}
  }
  
}