import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
export default function SurveyStep15({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  //!!! [추후] 변경될 예정 !!!
  let recommendRecipeIdList = [1, 2, 3, 4, 5, 6, 7, 8];

  let recommendRecipeIdLabelList = [
    '편안한 소화',
    '튼튼한 성장·발육',
    '에너지 보충',
    '피부·모질 강화',
    '추가 예정 1',
    '추가 예정 2',
    '추가 예정 3',
    '추가 예정 4',
  ];

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
    <section id="surveyPage" className={s.step15Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)에게 특별히 챙겨주고 싶은 것이 있나요 ?
            </p>

            <div className={s.recommendRecipeId_select_container}>
              <SurveyInputRadio
                formValueKey={'recommendRecipeId'}
                formValues={formValues}
                setFormValues={setFormValues}
                dogInfo={dog}
                dogInfoIndex={index}
                onInputChangeHandler={onInputChangeHandler}
                className={s.dogStatus}
                idList={recommendRecipeIdList}
                labelList={recommendRecipeIdLabelList}
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
