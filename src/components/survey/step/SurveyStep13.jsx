import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
import SurveyBirthday from '../SurveyBirthday';
import SurveyCustomRadioTrueOrFalse from '/src/components/survey/SurveyCustomRadioTrueOrFalse';
import SurveyInputMultipleSelected from '../SurveyInputMultipleSelected';
import SurveyInputMultipleSelectedEtc from '../SurveyInputMultipleSelectedEtc';

export default function SurveyStep13({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  let inedibleFoodIdList = [
    '닭',
    '칠면조',
    '오리',
    '양',
    '소',
    '캥거루',
    '토끼',
    '돼지',
    '말',
    '염소',
    '메추리',
    '연어',
    '황태',
    '타조',
    'ETC',
  ];

  let inedibleFoodLabelList = [
    '닭',
    '칠면조',
    '오리',
    '양',
    '소',
    '캥거루',
    '토끼',
    '돼지',
    '말',
    '염소',
    '메추리',
    '연어',
    '황태',
    '타조',
    '기타',
  ];

  const [activeIndexList, setActiveIndexList] = useState([]);

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
    <section id="surveyPage" className={s.step13Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          {/* 1. 현재 상태 */}
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)가 못 먹는 재료가 있나요 ?
            </p>

            <div className={s.input_supplement_box}>
              <SurveyCustomRadioTrueOrFalse
                title="inedibleFood"
                value={dog.inedibleFood}
                setFormValues={setFormValues}
                theme={'letter-in-shape'}
                labelList={['있어요', '없어요']}
                onInputChangeHandler={onInputChangeHandler}
                dogInfo={dog}
                dogInfoIndex={index}
                setActiveIndexList={setActiveIndexList}
              />
            </div>

            {activeIndexList.includes(index) && (
              <div className={s.inedibleFood_select_container} key={index}>
                <SurveyInputMultipleSelectedEtc
                  formValueKey={'inedibleFood'}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  dogInfo={dog}
                  dogInfoIndex={index}
                  onInputChangeHandler={onInputChangeHandler}
                  className={s.dogStatus}
                  idList={inedibleFoodIdList}
                  labelList={inedibleFoodLabelList}
                  etcKey={'inedibleFoodEtc'}
                />
                <div className={s.inedibleFood_text_box}>
                  <p className={s.inedibleFood_text}>
                    💡 바프독의 모든 생식 레시피에는 영양분이 가득한 <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 육고기, 뼈, 내장, 채소 등이
                    들어갑니다.
                    <br />⚠ 육고기와 뼈의 경우 알러지 분류에 들어가지만 <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 내장의 경우 알러지 분류에
                    들어가지 않으니 참고해주세요.
                  </p>
                </div>
              </div>
            )}
          </div>

          {formValues.length >= 2 && index !== formValues.length - 1 && (
            <div className={s.input_line}></div>
          )}
        </div>
      ))}
    </section>
  );
}
