import React from 'react';
import Head from 'next/head';


function MetaTitle(props) {
  return (
    <Head>
      <title>
        {`${props.title ? props.title : "바프독"} | Barf Dog`}
      </title>
    </Head>
  );
}

export default MetaTitle;