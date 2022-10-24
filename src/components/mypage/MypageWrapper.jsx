import React from 'react';
import dynamic from 'next/dynamic';
import s from './mypageWrapper.module.scss';
import Dashboard from './Dashboard';
import MypageBanner from '/src/components/atoms/MypageBanner';
import useDeviceState from '/util/hook/useDeviceState';


// const DUMMY_DATA = {
//   data: {
//     "mypageMemberDto" : {
//       "id" : 10,
//       "memberName" : "김회원",
//       "grade" : "더바프",
//       "myRecommendationCode" : "2BngT6yMM",
//       "reward" : 50000
//     },
//     "mypageDogDto" : {
//       "thumbnailUrl" : "https://images.unsplash.com/photo-1422565096762-bdb997a56a84?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
//       "dogName" : "강아지1"
//     },
//     "deliveryCount" : 4,
//     "couponCount" : 4,
//     "_links" : {
//       "self" : {
//         "href" : "http://localhost:8080/api/mypage"
//       },
//       "profile" : {
//         "href" : "/docs/index.html#resources-my-page"
//       }
//     }
//   }
//
// }





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
          <Dashboard className={s.dashboard}/>
          <MypageBanner />
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
