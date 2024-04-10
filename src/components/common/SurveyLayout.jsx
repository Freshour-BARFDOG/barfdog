import React from 'react';
import s from './surveyLayout.module.scss';
import SurveyHeader from '../header/SurveyHeader';
import SurveyFooter from './SurveyFooter';

const SurveyLayout = ({
  id,
  className,
  prevBtnRef,
  nextBtnRef,
  submitBtnRef,
  progressbarRef,
  onNavButtonClick,
  ...props
}) => {
  return (
    <main id={id} className={className}>
      <div className={s.top_line_header}>
        <SurveyHeader />
      </div>
      <div className={s.layout_children}>{props.children}</div>
      <SurveyFooter
        progressbarRef={progressbarRef}
        prevBtnRef={prevBtnRef}
        nextBtnRef={nextBtnRef}
        submitBtnRef={submitBtnRef}
        onNavButtonClick={onNavButtonClick}
      />
    </main>
  );
};

export default SurveyLayout;
