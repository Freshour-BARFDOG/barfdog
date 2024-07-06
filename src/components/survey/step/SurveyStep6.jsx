import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import { BsPlus } from 'react-icons/bs';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import { dogInedibleFoodType } from '/store/TYPE/dogInedibleFoodType';
import { dogCautionType } from '/store/TYPE/dogCautionType';

export default function SurveyStep6({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  const addDogInfoHandler = () => {
    setFormValues([...formValues, initialFormValue]);
  };

  const removeDogInfoHandler = (indexToRemove) => {
    setFormValues(formValues.filter((_, index) => index !== indexToRemove));
  };

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

  return (
    <section id="surveyPage" className={s.step5Page}>
      {formValues?.map((dog, index) => (
        <div className={s.input_weight_container} key={index}>
          <label htmlFor={'name'}>
            <p className={s.input_title}>
              {dog.name} (이)의 몸무게는 얼마인가요 ?
            </p>
            <div className={s.input_name_box}>
              <div className={s.input_weight_box}>
                <input
                  id={`weight`}
                  className={s.input_name}
                  type="text"
                  placeholder="몸무게를 입력해주세요"
                  data-input-type={'number'}
                  value={dog.weight || ''}
                  onChange={(e) => onInputChangeHandler(e, index)}
                />
                <em className={s.weight_unit}>kg</em>
              </div>
            </div>
          </label>
          {formValues.length >= 2 && index !== formValues.length - 1 && (
            <div className={s.input_line}></div>
          )}
        </div>
      ))}
    </section>
  );
}
