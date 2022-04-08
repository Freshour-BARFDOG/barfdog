import React from 'react'
import s from '/styles/css/footer.module.scss';
import Wrapper from '/src/components/common/Wrapper';
import Link from 'next/link';
import Layout from '/src/components/common/Layout';


function privacy() {
  return (
    <Layout>
      <Wrapper>
        <h1 className="">개인정보처리방침</h1>
      </Wrapper>
    </Layout>
     
  )
}

export default privacy

