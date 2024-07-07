import React, { useState } from 'react';
import s from './surveyResultFooter.module.scss';
import { SurveyPagination } from '../survey/SurveyPagination';
import { FaArrowRight } from 'react-icons/fa6';

export default function SurveyResultFooter({ surveyReportsId }) {
  return (
    <footer id={s.site_footer}>
      <a
        className={s.next_btn}
        href={`/order/subscribeShop?surveyReportsId=${surveyReportsId}`}
      >
        맞춤 플랜 확인하기
      </a>
      {/* <div className={s.next_btn} onClick={moveToPage}>
        다음
        <FaArrowRight />
      </div> */}
    </footer>
  );
}
