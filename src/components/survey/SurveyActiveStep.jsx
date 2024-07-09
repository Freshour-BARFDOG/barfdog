import s from './surveyActiveStep.module.scss';
import React, { useEffect, useState } from 'react';

export const SurveyActiveStep = ({ curStep, isValidPage }) => {
  const [activeStep, setActiveStep] = useState(1);

  // useEffect(() => {
  //   if ((curStep >= 1 && curStep <= 6) || isValidPage) {
  //     setActiveStep(1);
  //   } else if (curStep >= 7 && curStep <= 15 && !isValidPage) {
  //     setActiveStep(2);
  //   } else if (curStep >= 16 && curStep <= 17) {
  //     setActiveStep(3);
  //   }
  // }, [curStep, isValidPage]);

  console.log('isValidPage', isValidPage);

  return (
    <section className={s.step_container}>
      <div className={s.step_line}></div>
      <div className={s.step_box}>
        <div
          className={`${s.step_circle} ${
            (curStep >= 1 && curStep <= 6) || isValidPage === 6 ? s.active : ''
          }`}
        >
          <div className={s.step_number}>1</div>
        </div>
        <div className={s.step_text}>반려견 정보</div>
      </div>

      <div className={s.step_box}>
        <div
          className={`${s.step_circle} ${
            (curStep >= 7 && curStep <= 15 && isValidPage !== 6) ||
            isValidPage === 9
              ? s.active
              : ''
          }`}
        >
          <div className={s.step_number}>2</div>
        </div>
        <div className={s.step_text}>반려견 건강</div>
      </div>
      <div className={s.step_box}>
        <div
          className={`${s.step_circle}  ${
            curStep >= 16 && curStep <= 17 ? s.active : ''
          }`}
        >
          <div className={s.step_number}>3</div>
        </div>
        <div className={s.step_text}>추가 사항</div>
      </div>
    </section>
  );
};
