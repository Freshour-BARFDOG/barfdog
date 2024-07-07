import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
// import SurveyBubble from '/public/img/survey/survey_bubble_1.png';
import Image from 'next/image';
import SurveyInputMultipleSelected from '../SurveyInputMultipleSelected';
export default function SurveyStep17({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  //!!! [추후] 변경될 예정 !!!
  // let recommendRecipeIdList = [1, 2, 3, 4, 5, 6];
  let recommendRecipeIdList = [
    '관절',
    '모질',
    '피부',
    '구토',
    '빈혈',
    '영양보충',
  ];

  let recommendRecipeIdLabelList = [
    '관절',
    '모질',
    '피부',
    '구토',
    '빈혈',
    '영양보충',
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
    <section id="surveyPage" className={s.step17Page}>
      {/* <div className={s.survey_bubble_img}>
        <Image src={SurveyBubble} alt="SurveyBubble" />
      </div> */}
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
                  <div>{dog.recommendRecipeId?.split(',')[0] || ''}</div>
                </li>
                <li>
                  <span>2 순위 :</span>
                  <div>{dog.recommendRecipeId?.split(',')[1] || ''}</div>{' '}
                </li>
                <li>
                  <span>3 순위 :</span>
                  <div>{dog.recommendRecipeId?.split(',')[2] || ''}</div>{' '}
                </li>
              </ul>
            </div>

            <div className={s.recommendRecipeId_select_container}>
              <SurveyInputMultipleSelected
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
