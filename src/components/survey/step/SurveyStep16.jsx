import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
import { dogSnackCountLevelType } from '/store/TYPE/dogSnackCountLevelType';

export default function SurveyStep16({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  let mealCountPerOneDayIdList = ['1', '2', '3'];

  let mealCountPerOneDayLabelList = ['한 번', '두 번', '세 번'];

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
    <section id="surveyPage" className={s.step16Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)는 보통 하루에 몇 끼를 먹나요 ?
            </p>
            <div className={s.input_mealCountPerOneDay_box}>
              <SurveyInputRadio
                formValueKey={'mealCountPerOneDay'}
                formValues={formValues}
                setFormValues={setFormValues}
                dogInfo={dog}
                dogInfoIndex={index}
                className={s.mealCountPerOneDay}
                onInputChangeHandler={onInputChangeHandler}
                idList={mealCountPerOneDayIdList}
                labelList={mealCountPerOneDayLabelList}
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
