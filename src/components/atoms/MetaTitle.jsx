import React from 'react';
import Head from 'next/head';
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {pageAction} from "@store/page-slice";


function MetaTitle({title, admin}) {

  const router = useRouter();
  const curPath = router.asPath;
  const isCurPathMypage = curPath.split('/')[1] === 'mypage';
  if(isCurPathMypage){
    const mypageTitle = title.split(' ')[1];
    const dispatch = useDispatch();
    dispatch(pageAction.saveCurrentPageInfo({pageTitle: mypageTitle}))
  }


  return (
    <Head>
      <title>{`${title ? title : "바프독"} | Barf Dog ${admin ? '관리자': ''}`}</title>
    </Head>
  );
}

export default MetaTitle;