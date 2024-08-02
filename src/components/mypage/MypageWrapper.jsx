import React from 'react';
import dynamic from 'next/dynamic';
import s from './mypageWrapper.module.scss';
import Dashboard from './Dashboard';
import MypageBanner from '/src/components/atoms/MypageBanner';
import useDeviceState from '/util/hook/useDeviceState';
import BottomMenu from './BottomMenu';

function MypageWapper({ children }) {
  const isMobile = useDeviceState().isMobile;

  return (
    <>
      {isMobile ? (
        <>{children}</>
      ) : (
        <div className={s.mypageWrapper}>
          <section className={`${s.contents} clearfix`}>{children}</section>

          {/* ! [삭제예정] */}
          {/* <div className={`${s.contents_wrap} clearfix`}>
            <Menu className={s.menu} />
            <section className={`${s.contents} clearfix`}>{children}</section>
          </div> */}
        </div>
      )}
    </>
  );
}

export default MypageWapper;
