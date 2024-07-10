import React, { useState } from 'react';
import s from './surveyFooter.module.scss';
import { SurveyPagination } from '../survey/SurveyPagination';

export default function SurveyFooter({
  prevBtnRef,
  nextBtnRef,
  submitBtnRef,
  progressbarRef,
  onNavButtonClick,
  isActiveNextBtn,
  onSubmitHandler,
}) {
  const [isArrowActive, setIsArrowActive] = useState(false);

  return (
    <footer id={s.site_footer}>
      <SurveyPagination
        referrer={{
          prevBtn: prevBtnRef,
          nextBtn: nextBtnRef,
          submitBtn: submitBtnRef,
        }}
        onChangeStep={onNavButtonClick}
        isActiveNextBtn={isActiveNextBtn}
        onSubmitHandler={onSubmitHandler}
      />

      {/* <Wrapper bgColor="white">
        <section className={s.footer_area}>
          <div className={s.prev_btn}>
            <FaArrowLeft />
          </div>
          <div className={s.next_btn}>
            다음
            <FaArrowRight />
          </div>
        </section>
      </Wrapper> */}
    </footer>
  );
}
