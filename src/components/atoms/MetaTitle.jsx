import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {pageAction} from "@store/page-slice";


function MetaTitle({title, admin}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const curPath = router.asPath;
  const isCurPathMypage = curPath.split('/')[1] === 'mypage';
  
  const [metaTitle, setMetaTitle] = useState( title );
  useEffect( () => {
  
    if(isCurPathMypage){
      const mypageTitle = title.split(' ')[1];
      setMetaTitle(mypageTitle);
      dispatch(pageAction.saveCurrentPageInfo({pageTitle: mypageTitle}))
    }
  }, [title] );
  
  


  return (
    <Head>
      <title>{`${metaTitle || "바프독"} | Barf Dog ${admin ? '관리자': ''}`}</title>
    </Head>
  );
}

export default MetaTitle;