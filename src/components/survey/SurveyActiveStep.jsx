import s from './surveyActiveStep.module.scss';
import React, { useEffect, useState } from 'react';

export const SurveyActiveStep = ({ curStep }) => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // if (curStep >= 1 && curStep <= 5) {
    if (curStep === 1) {
      setActiveStep(1);
      // } else if (curStep >= 6 && curStep <= 13) {
    } else if (curStep === 2) {
      setActiveStep(2);
    } else if (curStep === 3) {
      setActiveStep(3);
    }
  }, [curStep]);

  console.log('curStep', curStep);
  console.log('activeStep', activeStep);

  return (
    <section className={s.step_container}>
      <div className={s.step_line}></div>
      <div className={s.step_box}>
        <div
          className={`${s.step_circle} ${
            // curStep >= 1 && curStep <= 5 ? s.active : ''
            curStep === 1 ? s.active : ''
          }`}
        >
          <div className={s.step_number}>1</div>
        </div>
        <div className={s.step_text}>반려견 정보</div>
      </div>

      <div className={s.step_box}>
        <div
          className={`${s.step_circle} ${
            // curStep >= 6 && curStep <= 13 ? s.active : ''
            curStep === 2 ? s.active : ''
          }`}
        >
          <div className={s.step_number}>2</div>
        </div>
        <div className={s.step_text}>반려견 건강</div>
      </div>
      <div className={s.step_box}>
        <div
          className={`${s.step_circle}  ${
            // curStep >= 14 && curStep <= 16 ? s.active : ''
            curStep === 3 ? s.active : ''
          }`}
        >
          <div className={s.step_number}>3</div>
        </div>
        <div className={s.step_text}>추가 사항</div>
      </div>
    </section>
  );
};
