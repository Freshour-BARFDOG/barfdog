import React from 'react';
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import { useRouter } from "next/router";


function EventPostPage() {
  const router = useRouter();
  if (!router.isReady) return;

  // console.log(router);
  const { eventId } = router.query;
  return (
    <Layout>
      <Wrapper>
        <div>
          EventPostPage
          <p>event pid: {eventId}</p>
        </div>
      </Wrapper>
    </Layout>
  );
}

export default EventPostPage;