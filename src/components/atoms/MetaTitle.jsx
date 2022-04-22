import React from 'react';
import Head from 'next/head';


function MetaTitle({title}) {
  return (
    <Head>
      <title>{`${title ? title : "바프독"} | Barf Dog`}</title>
    </Head>
  );
}

export default MetaTitle;