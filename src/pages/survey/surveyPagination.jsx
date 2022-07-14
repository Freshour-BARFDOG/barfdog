import s from './survey.module.scss';
import Image from 'next/image';
import React from 'react';

export const SurveyPagination = ({ referrer, step, onSubmit }) => {
  const { prevBtn, nextBtn } = referrer;

  const lastStep = '3'; // str
  const curStep  = step;
  
  return (
    <section className={s['swiper-navigation-container']}>
      <button className={s['swiper-button-prev']} ref={prevBtn}>
        <figure className={s.image_box}>
          <Image
            priority
            src={require('public/img/survey_left_arrow.png')}
            objectFit="cover"
            layout="fill"
            alt="이전 화살표"
          />
        </figure>
        이전
      </button>
      <button className={s['swiper-button-next']} ref={nextBtn} onClick={onSubmit}> {/* swiper자체적으로 마지막*/}
        {curStep === lastStep ? '제출하기': '다음'}
        <figure className={s.image_box}>
          <Image
            priority
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
