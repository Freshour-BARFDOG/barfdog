import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
// import SurveyBubble from '/public/img/survey/survey_bubble_1.png';
// import Image from 'next/image';
import SurveyInputMultipleSelected from '../SurveyInputMultipleSelected';

export default function SurveyStep17({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
  errorInfo,
  setIsActiveNextBtn,
}) {
  let recommendRecipeIdList = [
    '구토·설사·복통',
    '체중 조절',
    '피로회복',
    '눈물·눈곱',
    '적은 음수량',
    '피부·모질',
    '관절 건강',
    '자견 발육',
    '노령견 건강',
  ];

  let recommendRecipeIdLabelList = [
    '구토·설사·복통',
    '체중 조절',
    '피로회복',
    '눈물·눈곱',
    '적은 음수량',
    '피부·모질',
    '관절 건강',
    '자견 발육',
    '노령견 건강',
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
    <section id="surveyPage" className={s.step17Page}>
      {/* <div className={s.survey_bubble_img}>
        <Image src={SurveyBubble} alt="SurveyBubble" />
      </div> */}
      {errorInfo.errorMessage && (
        <p className={s.error_message_text}>{errorInfo.errorMessage}</p>
      )}
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)에게 고민되는 항목 <br /> 우선 순위 3가지를
              선택해주세요
            </p>

            {/* 우선순위 */}
            <div className={s.priority_concerns_container}>
              <ul>
                <li>
                  <span>1 순위 :</span>
                  <div>{dog.priorityConcerns?.split(',')[0] || ''}</div>
                </li>
                <li>
                  <span>2 순위 :</span>
                  <div>{dog.priorityConcerns?.split(',')[1] || ''}</div>{' '}
                </li>
                <li>
                  <span>3 순위 :</span>
                  <div>{dog.priorityConcerns?.split(',')[2] || ''}</div>{' '}
                </li>
              </ul>
            </div>

            <div className={s.recommendRecipeId_select_container}>
              <SurveyInputMultipleSelected
                formValueKey={'priorityConcerns'}
                formValues={formValues}
                setFormValues={setFormValues}
                dogInfo={dog}
                dogInfoIndex={index}
                onInputChangeHandler={onInputChangeHandler}
                className={s.dogStatus}
                idList={recommendRecipeIdList}
                labelList={recommendRecipeIdLabelList}
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
