import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
import CustomRadioTrueOrFalse from '/src/components/admin/form/CustomRadioTrueOrFalse';
import { dogPhysicalStatusType } from '/store/TYPE/dogPhysicalStatusType';
import { dogSpecificStatusType } from '/store/TYPE/dogSpecificStatusType.js';

export default function SurveyStep6({
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
    <section id="surveyPage" className={s.step6Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)의 현재 상태는 어떤가요 ?
            </p>
            <div className={s.input_status_box}>
              {/* <SurveyInputRadio
                formValueKey={'gender'}
                formValues={formValues}
                setFormValues={setFormValues}
                dogInfo={dog}
                dogInfoIndex={index}
                className={s.radio_gender}
                idList={[dogGenderType.MALE, dogGenderType.FEMALE]}
                labelList={['수컷', '암컷']}
                onInputChangeHandler={onInputChangeHandler}
              /> */}

              <SurveyInputRadio
                formValueKey={'dogStatus'}
                formValues={formValues}
                setFormValues={setFormValues}
                dogInfo={dog}
                dogInfoIndex={index}
                className={s.dogStatus}
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
            <div className={s.input_name_container} key={index}>
              <label htmlFor={'name'}>
                <div className={s.input_name_box}>
                  <div>
                    <input
                      id={`weight`}
                      // className={`${s.input_underLine} ${s['focus-underline']}`}
                      className={s.input_name}
                      type="text"
                      placeholder="목표 체중이 몇인가요?"
                      data-input-type={'number'}
                      value={dog.weight || ''}
                      onChange={(e) => onInputChangeHandler(e, index)}
                    />
                    <em className={s.unit}>kg</em>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div className={s.input_neutralization_container}>
            <p className={s.input_title}>그리고 현재 특별한 상태예요</p>
            <span className={s.input_title}>(선택사항)</span>
            <div className={s.input_neutralization_box}>
              <SurveyInputRadio
                formValueKey={'dogStatus'}
                formValues={formValues}
                setFormValues={setFormValues}
                dogInfo={dog}
                dogInfoIndex={index}
                className={s.dogStatus}
                idList={[
                  dogSpecificStatusType.PREGNANT,
                  dogSpecificStatusType.LACTATING,
                ]}
                labelList={[
                  dogSpecificStatusType.KOR.PREGNANT,
                  dogSpecificStatusType.KOR.LACTATING,
                ]}
              />
              {/* <CustomRadioTrueOrFalse
                title="neutralization"
                value={formValues.neutralization}
                setValue={setFormValues}
                theme={'letter-in-shape'}
                labelList={['했습니다', '안했습니다']}
                onInputChangeHandler={onInputChangeHandler}
                dogInfo={dog}
                dogInfoIndex={index}
              /> */}
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
