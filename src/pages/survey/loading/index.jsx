import React, {useEffect, useState} from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '@src/components/atoms/MetaTitle';
import s from './loading.module.scss';
import IconLeft from '/public/img/survey/survey_loading_left.svg';
import IconRight from '/public/img/survey/survey_loading_right.svg';
import {useRouter} from "next/router";


export default function LoadingPage(props) {
  // console.log(props);
  
  
  const [isLoading, setIsLoading] = useState( false );
  const router = useRouter();
  useEffect( () => {
    const transitionPageDelay = 3000;
    setTimeout(()=>{
      // router.push('/survey/statistics');
    }, transitionPageDelay)
  }, [] );
  
  // - 강아지 등록 후에, 설문조사 ID (강아지 ID값을 받아야함)
  return (
    <>
      <MetaTitle title="Loading" />
      <Layout>
        <Wrapper>
          <section className={s.image_section}>
              <i className={s['progress-bar']}></i>
              <div className={s['ani-box-wrap']}>
                <span className={`${s['ani-box']} ${s.left}`}>
                  <IconLeft />
                </span>
                <span className={`${s['ani-box']} ${s.mid}`}>
                  <em className={`${s['ani-text']}`}>분석중</em>
                </span>
                <span className={`${s['ani-box']} ${s.right}`}>
                  <IconRight />
                </span>
              </div>
          </section>
          <section className={s.text_box}>
            <div className={s.text_row1}>
              고객님의 반려견에게
              <br />
              맞춤 레시피를 분석중입니다.
            </div>
            <div className={s.text_row2}>
              바프독은 특허받은 반려동물 정보를 기반으로
              <br />
              맞춤형 레시피를 도출하는 알고리즘 서비스를 제공합니다.
              <br />
              고객님의 반려견에게 가장 건강한 레시피를 추천드릴게요.
            </div>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}






export async function getServerSideProps(context) {
  const { req } = context;
  const cookie = req.headers.cookie;
  const key = 'userLoginCookie';
  let token;
  cookie.split(';').forEach((c) => {
    if (c.indexOf(key) >= 0) {
      const data = c.split('=')[1];
      token = data;
      console.log('dat: ', data)
    }
  });
  const apiUrl = '/api/surveyReports/261'
  // console.log(cookie)
  return { props: { cookie } };
}

