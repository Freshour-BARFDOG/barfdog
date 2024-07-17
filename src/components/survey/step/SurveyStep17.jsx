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
    '관절',
    '피부·모질',
    '소화력부족',
    '빈혈',
    '피로회복',
    '체중조절',
    '음수량 부족',
  ];

  let recommendRecipeIdLabelList = [
    '관절',
    '피부·모질',
    '소화력부족',
    '빈혈',
    '피로회복',
    '체중조절',
    '음수량 부족',
  ];

  // 조건과 추천 레시피 ID를 매핑한 객체
  const conditionRecipeMap = {
    관절: [7, 9],
    '피부·모질': [8, 11],
    소화력부족: [5, 9],
    빈혈: [6, 12],
    피로회복: [7, 11],
    체중조절: [8, 12],
    '음수량 부족': [5, 9],
  };

  // inedibleFood에 따른 레시피 제외 조건
  const inedibleFoodRecipeMap = {
    닭: [5, 9],
    칠면조: [5, 6, 10],
    소: [6, 8, 12],
    오리: [7],
    양: [7, 8, 11],
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
                conditionRecipeMap={conditionRecipeMap}
                inedibleFoodRecipeMap={inedibleFoodRecipeMap}
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
