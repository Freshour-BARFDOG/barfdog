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
  }, [formValues]);

  return (
    <section id="surveyPage" className={s.step9Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.status_container}>
          <div className={s.input_status_container}>
            <p className={s.input_title}>
              {dog.name} (이)의 간식량은 어떤가요 ?
            </p>
            <div className={s.input_snack_box}>
              <SurveyInputRadio
                formValueKey={'snackCountLevel'}
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
                // desc={[
                //   <span key={'desc-01'}>
                //     식사에 <br /> 상관없는 양
                //   </span>,
                //   <span key={'desc-02'}>
                //     식사에 어느정도
                //     <br /> 상관 있는 양
                //   </span>,
                //   <span key={'desc-03'}>
                //     식사에 상당한
                //     <br /> 영향이 있는 양
                //   </span>,
                // ]}
              />

              {/* <SurveyInputRadio
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
