import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
import SurveyCustomRadioTrueOrFalse from '/src/components/survey/SurveyCustomRadioTrueOrFalse';
import { dogGenderType } from '/store/TYPE/dogGenderType';

export default function SurveyStep3({
  formValues,
  setFormValues,
  onInputChangeHandler,
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
    // targetSwiperElem.style.minHeight = rem(400);
  }, [formValues]);

  return (
    <section id="surveyPage" className={s.step2Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.gender_neutralization_container}>
          <div className={s.input_neutralization_container}>
            <p className={s.input_title}>중성화 여부는 어떻게 되나요 ?</p>
            <div className={s.input_neutralization_box}>
              <SurveyCustomRadioTrueOrFalse
                title="neutralization"
                value={formValues.neutralization}
                setValue={setFormValues}
                theme={'letter-in-shape'}
                labelList={['했습니다', '안했습니다']}
                onInputChangeHandler={onInputChangeHandler}
                dogInfo={dog}
                dogInfoIndex={index}
              />
            </div>
          </div>
          {formValues.length >= 2 && index !== formValues.length - 1 && (
            <div className={s.input_line}></div>
          )}
        </div>
      ))}
    </section>
  );
}
