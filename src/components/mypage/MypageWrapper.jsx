import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import s from "../../../styles/css/mypage/MypageWrapper.module.scss";
import Dashboard from './Dashboard.tsx';
import Banner_event from '../atoms/Banner_event';


// import Menu from "./Menu";
const Menu = dynamic(() => {
  // SSR 랜더링 사용없이 랜더링함
  // menu 내부에 window객체의 undefined 오류를 방지하기 위함
  return import('./Menu');
}, { ssr: false})



function MypageWapper({children}) {

  return (
    <div className={s.mypageWrapper}>
      <Dashboard className={s.dashboard} />
      <Banner_event />
      <div className={`${s.contents_wrap} clearfix`}>
        <Menu className={s.menu} />
        <section className={`${s.contents} clearfix`}>{children}</section>
      </div>
    </div>
  );
  
}

export default MypageWapper;