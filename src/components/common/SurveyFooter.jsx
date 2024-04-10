import React, { useState } from 'react';

import s from './surveyFooter.module.scss';
import Wrapper from '/src/components/common/Wrapper';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { userType } from '/store/TYPE/userAuthType';
import { SurveyProgressbar } from '../survey/SurveyProgressbar';
import { SurveyPagination } from '../survey/SurveyPagination';

export default function SurveyFooter({
  prevBtnRef,
  nextBtnRef,
  submitBtnRef,
  progressbarRef,
  onNavButtonClick,
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
