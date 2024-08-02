import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyCustomRadioTrueOrFalse from '/src/components/survey/SurveyCustomRadioTrueOrFalse';
import SurveyInputMultipleSelected from '../SurveyInputMultipleSelected';
import SurveyInputMultipleSelectedEtc from '../SurveyInputMultipleSelectedEtc';

export default function SurveyStep12({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
  errorInfo,
  setIsActiveNextBtn,
  mode,
}) {
  let supplementIdList = [
    '유산균',
    '오메가-3',
    '항산화',
    '관절',
    '눈',
    '피부',
    '면역력',
    '심장',
    '치아',
    '종합',
    'ETC',
  ];

  let supplementLabelList = [
    '유산균',
    '오메가-3',
    '항산화',
    '관절',
    '눈',
    '피부',
    '면역력',
    '심장',
    '치아',
    '종합',
    '기타',
  ];

  const [activeIndexList, setActiveIndexList] = useState([]);

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

  useEffect(() => {
    if (activeIndexList.length > 0) {
      setIsActiveNextBtn(false);
    }
  }, [activeIndexList]);

  return (
    <section id="surveyPage">
      {mode !== 'update' && (
        <p className={s.supplement_text}>
          * 과잉 영양 예방 및 충돌 영양제를 파악하기 위함이오니 <br />
          급여하는 제품이 있는 경우 체크해주세요!
        </p>
      )}
      {errorInfo.errorMessage && (
        <p className={s.error_message_text}>{errorInfo.errorMessage}</p>
      )}
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          {/* 1. 현재 상태 */}
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)가 현재 먹고 있는 영양제가 있나요 ?
            </p>

            <div className={s.input_supplement_box}>
              <SurveyCustomRadioTrueOrFalse
                title="supplement"
                value={dog.supplement}
                setFormValues={setFormValues}
                theme={'letter-in-shape'}
                labelList={['있어요', '없어요']}
                onInputChangeHandler={onInputChangeHandler}
                dogInfo={dog}
                dogInfoIndex={index}
                setActiveIndexList={setActiveIndexList}
                setIsActiveNextBtn={setIsActiveNextBtn}
              />
            </div>

            {activeIndexList.includes(index) && (
              <div className={s.supplement_select_container} key={index}>
                <SurveyInputMultipleSelectedEtc
                  formValueKey={'supplement'}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  dogInfo={dog}
                  dogInfoIndex={index}
                  onInputChangeHandler={onInputChangeHandler}
                  className={s.dogStatus}
                  idList={supplementIdList}
                  labelList={supplementLabelList}
                  setIsActiveNextBtn={setIsActiveNextBtn}
                  etcKey={'supplementEtc'}
                />
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
