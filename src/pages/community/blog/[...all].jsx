import React, { useEffect } from 'react';
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import { useRouter } from "next/router";



function BlogPostPage() {
  const router = useRouter();
  // ! 렌더링 2번 중, 첫번째 될 때 URL값이 없으므로 ,undefined
  if (!router.isReady) return;
  const { all } = router.query;
  const type = all[0];
  const pid = all[1];
  // console.log(type, pid);

  return (
    <Layout>
      <Wrapper>
        <div>
          BlogPostPage
          <p>event Type: {type}</p>
          <p>event pid: {pid}</p>
        </div>
      </Wrapper>
    </Layout>
  );
}

export default BlogPostPage