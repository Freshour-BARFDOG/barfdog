import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '@src/components/atoms/MetaTitle';
import s from './loading.module.scss';
import IconLeft from '/public/img/survey/survey_loading_left.svg';
import IconRight from '/public/img/survey/survey_loading_right.svg';
import Spinner from '/public/img/survey/spinner.gif';
import { useRouter } from 'next/router';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import Image from 'next/image';

export default function Loading() {
  // 설문조사 결과 분석 중 ...

  // - 강아지 등록 후에, 설문조사 ID (강아지 ID값을 받아야함)

  const [progress, setProgress] = useState(30);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        // prevProgress >= 100 ? 10 : prevProgress + 20,
        {
          const randomIncrement = [10, 20, 30, 40][
            Math.floor(Math.random() * 4)
          ];
          const newValue = prevProgress + randomIncrement;
          return newValue > 100 ? 100 : newValue;
        },
      );
    }, 600);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div className={s['loading-container']}>
        <section className={s.image_section}>
          <div className={s.spinner_wrapper}>
            <Image src={Spinner} alt="loading" width={200} height={200} />
          </div>
          {/* <i className={s['progress-bar']}></i>
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
          </div> */}
          <LinearProgressWithLabel value={progress} />
        </section>
        <section className={s.text_box}>
          <div className={s.text_row1}>
            고객님의 반려견의 정보를 수집하여
            <br />
            AI 표준화 작업 중입니다.
          </div>
          <div className={s.text_row2}>
            반려견 건강 레포트를 제작하고 있습니다.
            <br />
            잠시만 기다려주세요.
          </div>
        </section>
      </div>
      {/* <div className={s['loading-container']}>
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
      </div> */}
    </>
  );
}
