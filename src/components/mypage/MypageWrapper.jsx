import React from 'react';
import dynamic from 'next/dynamic';
import s from './mypageWrapper.module.scss';
import Dashboard from './Dashboard';
import Banner_event from '/src/components/atoms/Banner_event';
import useDeviceState from '/util/hook/useDeviceState';

const Menu = dynamic(
  () => {
    // SSR 랜더링 사용없이 랜더링함
    // menu 내부에 window객체의 undefined 오류를 방지하기 위함
    return import('./MypageMenu');
  },
  { ssr: false },
);

function MypageWapper({ children }) {
  const isMobile = useDeviceState().isMobile;

  return (
    <>
      {isMobile ? (
        <>{children}</>
      ) : (
        <div className={s.mypageWrapper}>
          <Dashboard className={s.dashboard} />
          <Banner_event />
          <div className={`${s.contents_wrap} clearfix`}>
            <Menu className={s.menu} />
            <section className={`${s.contents} clearfix`}>{children}</section>
          </div>
        </div>
      )}
    </>
  );
}

export default MypageWapper;
