import React from 'react';
import SurveyHeader from '../header/SurveyHeader';
import SurveyFooter from './SurveyFooter';
import SurveyResultFooter from './SurveyResultFooter';
import s from './layout.module.scss';

const LayoutSurvey = ({
  id,
  className,
  prevBtnRef,
  nextBtnRef,
  submitBtnRef,
  progressbarRef,
  onNavButtonClick,
  resultPage,
  surveyReportsId,
  isActiveNextBtn,
  onSubmitHandler,
  ...props
}) => {
  return (
    <main
      id={id}
      className={`${className} ${s.main_wrapper}`}
      style={{
        position: 'relative',
        // width: '600px',
        minHeight: '100vh',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#fffafa',
      }}
    >
      <SurveyHeader />
      {props.children}
      {resultPage ? (
        <SurveyResultFooter surveyReportsId={surveyReportsId} />
      ) : (
        <SurveyFooter
          progressbarRef={progressbarRef}
          prevBtnRef={prevBtnRef}
          nextBtnRef={nextBtnRef}
          submitBtnRef={submitBtnRef}
          onNavButtonClick={onNavButtonClick}
          isActiveNextBtn={isActiveNextBtn}
          onSubmitHandler={onSubmitHandler}
        />
      )}
    </main>
  );
};

export default LayoutSurvey;
