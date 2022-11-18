import MetaTitle from "/src/components/atoms/MetaTitle";
import React from "react";

export default function UserInquiryPopupPage ({id}) {
    return <>
      <MetaTitle title={`1:1문의`}/>
      사용자 문의글 보기
      {id}번 글
    </>;
}


export async function getServerSideProps ({query}) {
  
  const { id } = query;
  
  return {
    props: { id}
  }
}