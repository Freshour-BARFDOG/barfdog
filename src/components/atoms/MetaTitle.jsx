import React from 'react';
import Head from 'next/head';


function MetaTitle({title, admin}) {
  return (
    <Head>
      <title>{`${title ? title : "바프독"} | Barf Dog ${admin ? '관리자': ''}`}</title>
    </Head>
  );
}

export default MetaTitle;