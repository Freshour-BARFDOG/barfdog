import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyCustomRadioTrueOrFalse from '/src/components/survey/SurveyCustomRadioTrueOrFalse';

export default function SurveyStep16({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  // UI '짤림 현상'해결
  useEffect(() => {
    const swiperWrap = surveyPageRef?.current;
    const slideWithDependencyElem = swiperWrap?.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem?.offsetHeight;
    const targetSwiperElem = swiperWrap?.querySelector('.swiper-wrapper');
    if (targetSwiperElem) {
      targetSwiperElem.style.height = rem(activeSlideHeight);
    }
  }, [formValues]);

  return (
    <section id="surveyPage" className={s.step2Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.gender_neutralization_container}>
          <div className={s.input_neutralization_container}>
            <p className={s.input_title}>
              {dog.name}(이)는 생식 급여가 처음인가요 ?
            </p>
            <div className={s.input_neutralization_box}>
              <SurveyCustomRadioTrueOrFalse
                title="newToRawDiet"
                value={formValues.newToRawDiet}
                setValue={setFormValues}
                theme={'letter-in-shape'}
                labelList={['네', '아니오']}
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
