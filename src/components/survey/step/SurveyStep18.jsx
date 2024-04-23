import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyBubble from '/public/img/survey/survey_bubble_2.png';
import Image from 'next/image';

export default function SurveyStep18({
  formValues,
  setFormValues,
  surveyPageRef,
}) {
  // UI '짤림 현상'해결
  useEffect(() => {
    const swiperWrap = surveyPageRef.current;
    const slideWithDependencyElem = swiperWrap.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem.offsetHeight;
    const targetSwiperElem = swiperWrap.querySelector('.swiper-wrapper');
    targetSwiperElem.style.height = rem(activeSlideHeight);
  }, [formValues]);

  const onChangeHandler = (e) => {
    const { value } = e.target;

    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        return {
          ...item,
          messageToBarfdog: value,
        };
      });

      return newFormValues;
    });
  };

  return (
    <section id="surveyPage" className={s.step18Page}>
      <div className={s.input_name_container}>
        <div className={s.survey_bubble_img}>
          <Image src={SurveyBubble} alt="SurveyBubble" />
        </div>
        <p className={s.input_title_message}>
          팀 바프독에게 전하고 싶은 말이 있나요 ? <span>(선택사항)</span>
        </p>
        <div className={s.input_name_box}>
          <input
            id={`messageToBarfdog`}
            className={s.input_name}
            type="text"
            placeholder="자유롭게 작성해주세요 !"
            value={formValues[0].messageToBarfdog || ''}
            onChange={onChangeHandler}
          />
        </div>
      </div>
    </section>
  );
}
