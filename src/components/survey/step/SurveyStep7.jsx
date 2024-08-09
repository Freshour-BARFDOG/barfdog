import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
import { dogPhysicalStatusType } from '/store/TYPE/dogPhysicalStatusType';
import { dogSpecificStatusType } from '/store/TYPE/dogSpecificStatusType.js';
import SurveyBirthdayInput from '../SurveyBirthdayInput';
import SurveyOptionalInputRadio from '../SurveyOptionalInputRadio';

export default function SurveyStep7({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
  setIsActiveNextBtn,
}) {
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
    if (
      (formValues[0].specificDogStatus.includes('PREGNANT') &&
        !formValues[0].expectedPregnancyDay) ||
      formValues[0].specificDogStatus === 'LACTATING' ||
      (formValues[0].specificDogStatus.includes('ETC') &&
        !formValues[0].specificDogStatusEtc)
    ) {
      setIsActiveNextBtn(false);
    } else if (
      formValues[0].specificDogStatus.includes('PREGNANT') &&
      formValues[0].expectedPregnancyDay
    ) {
      setIsActiveNextBtn(true);
    }
  }, [formValues]);

  return (
    <section id="surveyPage" className={s.step6Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          {/* 1. 현재 상태 */}
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)의 현재 상태는 어떤가요 ?
            </p>
            <div className={s.input_status_box}>
              <SurveyInputRadio
                formValueKey={'dogStatus'}
                formValues={formValues}
                setFormValues={setFormValues}
                dogInfo={dog}
                dogInfoIndex={index}
                className={s.dogStatus}
                onInputChangeHandler={onInputChangeHandler}
                idList={[
                  dogPhysicalStatusType.THIN,
                  dogPhysicalStatusType.HEALTHY,
                  dogPhysicalStatusType.NEED_DIET,
                  dogPhysicalStatusType.OBESITY,
                ]}
                labelList={[
                  dogPhysicalStatusType.KOR.THIN,
                  dogPhysicalStatusType.KOR.HEALTHY,
                  dogPhysicalStatusType.KOR.NEED_DIET,
                  dogPhysicalStatusType.KOR.OBESITY,
                ]}
              />
            </div>

            {/* ! 제거 */}
            {/* 1-1. 목표 체중 : 건강 이외 (말랐어요, 다이어트 필요, 비만) */}
            {/* {(dog.dogStatus === 'THIN' ||
              dog.dogStatus === 'NEED_DIET' ||
              dog.dogStatus === 'OBESITY') && (
              <div className={s.input_name_container} key={index}>
                <label htmlFor={'name'}>
                  <div className={s.input_target_weight_box}>
                    <input
                      id={`targetWeight`}
                      className={s.input_name}
                      type="text"
                      placeholder="목표 체중이 몇인가요?"
                      data-input-type={'number'}
                      value={dog.targetWeight || ''}
                      onChange={(e) => onInputChangeHandler(e, index)}
                    />
                    <em className={s.weight_unit}>kg</em>
                  </div>
                </label>
              </div>
            )} */}
          </div>

          {/* 2. 특별한 상태 (임신/수유) : 선택 */}
          <div className={s.specific_status_container}>
            <p className={s.sepcific_title}>
              그리고 현재 특별한 상태예요 <span>(선택사항)</span>
            </p>
            <div className={s.input_specific_status_box}>
              <SurveyOptionalInputRadio
                formValueKey={'specificDogStatus'}
                formValues={formValues}
                setFormValues={setFormValues}
                setIsActiveNextBtn={setIsActiveNextBtn}
                dogInfo={dog}
                dogInfoIndex={index}
                className={s.dogStatus}
                idList={[
                  dogSpecificStatusType.PREGNANT,
                  dogSpecificStatusType.LACTATING,
                  dogSpecificStatusType.ETC,
                ]}
                labelList={[
                  dogSpecificStatusType.KOR.PREGNANT,
                  dogSpecificStatusType.KOR.LACTATING,
                  dogSpecificStatusType.KOR.ETC,
                ]}
              />
            </div>

            {/* 2-1. 임신일 경우 : 임신 예상일 (expectedPregnancyDay) */}
            {(dog.specificDogStatus === 'PREGNANT' ||
              dog.specificDogStatus === 'PREGNANT_EARLY' ||
              dog.specificDogStatus === 'PREGNANT_LATE') && (
              <div className={s.pregnancy_date_container}>
                <p className={s.pregnancy_date_title}>
                  출산 예정일을 입력해주세요
                  <span> (정확히 모르는 경우 근접한 날로 입력) </span>
                </p>
                <SurveyBirthdayInput
                  className={s['birthday']}
                  type={'date'}
                  id={'expectedPregnancyDay'}
                  filteredType={'date'}
                  dogInfoIndex={index}
                  dogInfo={dog}
                  setFormValues={setFormValues}
                  // value={dog.expectedPregnancyDay || ''}
                  value={''}
                  setIsActiveNextBtn={setIsActiveNextBtn}
                />
              </div>
            )}

            {/* 2-2. 수유일 경우 : 마리수 (lactatingCount) */}
            {(dog.specificDogStatus === 'LACTATING' ||
              dog.specificDogStatus === 'LACTATING_ONE_TO_TWO' ||
              dog.specificDogStatus === 'LACTATING_THREE_TO_FOUR' ||
              dog.specificDogStatus === 'LACTATING_FIVE_TO_SIX' ||
              dog.specificDogStatus === 'LACTATING_OVER_SEVEN') && (
              <div className={s.lactating_count_container}>
                <SurveyInputRadio
                  formValueKey={'specificDogStatus'}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  dogInfo={dog}
                  dogInfoIndex={index}
                  onInputChangeHandler={onInputChangeHandler}
                  className={s.specificDogStatus}
                  idList={[
                    dogSpecificStatusType.LACTATING_ONE_TO_TWO,
                    dogSpecificStatusType.LACTATING_THREE_TO_FOUR,
                    dogSpecificStatusType.LACTATING_FIVE_TO_SIX,
                    dogSpecificStatusType.LACTATING_OVER_SEVEN,
                  ]}
                  labelList={[
                    dogSpecificStatusType.KOR.LACTATING_ONE_TO_TWO,
                    dogSpecificStatusType.KOR.LACTATING_THREE_TO_FOUR,
                    dogSpecificStatusType.KOR.LACTATING_FIVE_TO_SIX,
                    dogSpecificStatusType.KOR.LACTATING_OVER_SEVEN,
                  ]}
                />
              </div>
            )}

            {/* 3. 기타 */}
            {dog.specificDogStatus === 'ETC' && (
              <input
                id={`specificDogStatusEtc`}
                className={s.input_name}
                type="text"
                placeholder="별도의 상담이 필요할 수도 있습니다."
                data-input-type={'string'}
                value={
                  !dog.specificDogStatusEtc ||
                  dog.specificDogStatusEtc === 'NONE'
                    ? ''
                    : dog.specificDogStatusEtc
                }
                onChange={(e) => onInputChangeHandler(e, index)}
              />
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
