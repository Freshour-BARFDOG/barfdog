import React from 'react'
import { useRouter } from 'next/router';

function PostAll() {
  const router = useRouter();
  const { slug } = router.query;
  console.log(router);

  return (
    <div>
      <h2>Post: {slug}</h2>
    </div>
  )
}

export default PostAll