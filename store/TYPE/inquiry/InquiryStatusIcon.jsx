import {inquiryStatusType} from "./inquiryStatusType";
import * as s from './InquiryStatusIcon.module.scss';
import React from "react";


export const inquiryStatusIcon = {
  [inquiryStatusType.UNANSWERED]: (

    <i className={`${s.icon} ${s.UNANSWERED}`}>{inquiryStatusType.KOR.UNANSWERED}</i>
  ),
  [inquiryStatusType.ANSWERED]: (
    <i className={`${s.icon} ${s.ANSWERED}`}>{inquiryStatusType.KOR.ANSWERED}</i>
  ),
  [inquiryStatusType.MULTIPLE_ANSWERED]: (
    <>
      <i className={`${s.icon} ${s.ANSWERED}`}>{inquiryStatusType.KOR.ANSWERED}</i>
      <i className={`${s.icon} ${s.MULTIPLE_ANSWERED}`}>{inquiryStatusType.KOR.MULTIPLE_ANSWERED}</i>
    </>
  ),
};