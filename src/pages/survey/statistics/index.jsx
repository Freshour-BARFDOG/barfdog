import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { SurveyStatistics } from '/src/components/survey/SurveyStatistics';
import s from "/src/components/survey/surveyStatistics.module.scss";
import Link from "next/link";

export default function SurveyStatisticsPage() {

  return (
    <>
      <MetaTitle title="설문조사 통계" />
      <Layout>
        <Wrapper>
          <SurveyStatistics dogId={10}/>
          <section className={s.last_text}>
            <div>
              ※ 해당 결과지는 바프독 고객을 대상으로한 참고용 결과이니, <br/>
            </div>
            <div>자세한 반려견의 건강상태는 수의사와 상담해 주세요.</div>
          </section>
  
          <section className={s.btn_box}>
            {/*<div className={s.btn}>맞춤 플랜 확인하기</div>*/}
            <Link href={'/order/subscribe'} passHref>
              <a className={s.btn} >맞춤 플랜 확인하기</a>
            </Link>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

//
// export async function getServerSideProps(context) {
//   const { req } = context;
//   const cookie = req.headers.cookie;
//   const key = 'userLoginCookie';
//   let token;
//   cookie.split(';').forEach((c) => {
//     if (c.indexOf(key) >= 0) {
//       const data = c.split('=')[1];
//       token = data;
//       console.log('dat: ', data);
//     }
//   });
//   const apiUrl = '/api/surveyReports/261';
//   // console.log(cookie)
//   return { props: { cookie } };
// }
