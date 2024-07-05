// import s from '../../pages/survey/survey.module.scss';

import s from '../../components/common/surveyFooter.module.scss';
import Image from 'next/image';
import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

export const SurveyPagination = ({ referrer, onChangeStep }) => {
  const { prevBtn, nextBtn, submitBtn } = referrer;

  return (
    <section className={s['swiper-navigation-container']}>
      <button className={s['swiper-button-prev']} ref={prevBtn}>
        {/* <figure className={s.image_box}>
          <Image
            src={require('public/img/survey_left_arrow.png')}
            objectFit="cover"
            layout="fill"
            alt="이전 화살표"
          />
        </figure>   이전*/}
        <FaArrowLeft />
      </button>
      <button
        className={s['swiper-button-next']}
        ref={nextBtn}
        onClick={onChangeStep}
      >
        다음
        <FaArrowRight />
        {/* <figure className={s.image_box}>
          <Image
            src={require('public/img/survey_right_arrow.png')}
            objectFit="cover"
            layout="fill"
            alt="이전 화살표"
          />
        </figure> */}
      </button>
      <button
        className={s['swiper-button-submit']}
        ref={submitBtn}
        onClick={onChangeStep}
      >
        제출하기
        <figure className={s.image_box}>
          <Image
            src={require('public/img/survey_right_arrow.png')}
            objectFit="cover"
            layout="fill"
            alt="이전 화살표"
          />
        </figure>
      </button>
    </section>
  );
};
