import React from 'react';
import s from './surveyLayout.module.scss';
import SurveyHeader from '../header/SurveyHeader';
import SurveyFooter from './SurveyFooter';
import SurveyResultFooter from './SurveyResultFooter';

const SurveyLayout = ({
  id,
  className,
  prevBtnRef,
  nextBtnRef,
  submitBtnRef,
  progressbarRef,
  onNavButtonClick,
  resultPage,
  surveyReportsId,
  ...props
}) => {
  return (
    <main id={id} className={className}>
      <div className={s.top_line_header}>
        <SurveyHeader />
      </div>
      <div className={s.layout_children}>{props.children}</div>
      {resultPage ? (
        <SurveyResultFooter surveyReportsId={surveyReportsId} />
      ) : (
        <SurveyFooter
          progressbarRef={progressbarRef}
          prevBtnRef={prevBtnRef}
          nextBtnRef={nextBtnRef}
          submitBtnRef={submitBtnRef}
          onNavButtonClick={onNavButtonClick}
        />
      )}
    </main>
  );
};

export default SurveyLayout;
