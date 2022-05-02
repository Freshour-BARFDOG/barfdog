import React from 'react';
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import { useRouter } from "next/router";


function NoticePostPage() {
    const router = useRouter();
    if(!router.isReady) return;
    const { noticeId } = router.query;
    

  return (
    <Layout>
      <Wrapper>
        <div>NoticePostPage POST ID: {noticeId}</div>
      </Wrapper>
    </Layout>
  );
}

export default NoticePostPage;