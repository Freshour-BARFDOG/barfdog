import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputMultipleSelected from '../SurveyInputMultipleSelected';

export default function SurveyStep13({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
  errorInfo,
  setIsActiveNextBtn,
}) {
  let currentMealOptions = [
    '건사료',
    '습식사료/캔',
    '생식',
    '화식',
    '수제사료',
    '동결건조사료',
  ];

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
    <section id="surveyPage" className={s.step11Page}>
      {errorInfo.errorMessage && (
        <p className={s.error_message_text}>{errorInfo.errorMessage}</p>
      )}
      <p className={s.supplement_text}>* 중복 선택 가능</p>

      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          {/* 1. 현재 상태 */}
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)가 현재 먹고 있는 식사는 어떤 것인가요 ?
            </p>

            <div className={s.currentMeal_select_container}>
              <SurveyInputMultipleSelected
                formValueKey={'currentMeal'}
                formValues={formValues}
                setFormValues={setFormValues}
                dogInfo={dog}
                dogInfoIndex={index}
                onInputChangeHandler={onInputChangeHandler}
                className={s.dogStatus}
                idList={currentMealOptions}
                labelList={currentMealOptions}
                setIsActiveNextBtn={setIsActiveNextBtn}
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
