import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
import { dogSnackCountLevelType } from '/store/TYPE/dogSnackCountLevelType';

export default function SurveyStep10({
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
    <section id="surveyPage" className={s.step9Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)의 음수량은 어떤가요 ?
            </p>
            <div className={s.input_snack_box}>
              <SurveyInputRadio
                formValueKey={'waterCountLevel'}
                formValues={formValues}
                setFormValues={setFormValues}
                dogInfo={dog}
                dogInfoIndex={index}
                className={s.snackCountLevel}
                onInputChangeHandler={onInputChangeHandler}
                idList={[
                  dogSnackCountLevelType.LITTLE,
                  dogSnackCountLevelType.NORMAL,
                  dogSnackCountLevelType.MUCH,
                ]}
                labelList={[
                  dogSnackCountLevelType.KOR.LITTLE,
                  dogSnackCountLevelType.KOR.NORMAL,
                  dogSnackCountLevelType.KOR.MUCH,
                ]}
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
