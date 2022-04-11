import React, { useEffect } from "react";
import s from "/styles/css/mypage/MypageWrapper.module.scss";
import Menu from "./Menu";
import Dashboard from './Dashboard.tsx';
import Banner_event from '../atoms/Banner_event';
import IsMobileDevice from '/util/func/checkDevice';

function MypageWapper({children}) {
  useEffect(() => {
    console.log(window)
    console.log(IsMobileDevice());
  })
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