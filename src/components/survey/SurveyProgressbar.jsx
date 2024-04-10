import s from '../../components/common/surveyFooter.module.scss';
import React from 'react';

export const SurveyProgressbar = ({ referrer }) => {
  const { progressbar } = referrer;

  return (
    <section className={s['swiper-pagination']}>
      <div
        className={s['swiper-pagination-progressbar']}
        ref={progressbar}
      ></div>
    </section>
  );
};
