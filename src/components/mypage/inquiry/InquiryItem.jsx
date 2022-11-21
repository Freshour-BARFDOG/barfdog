import React from 'react';
import s from '/src/pages/mypage/inquiry/inquiry.module.scss';
import { inquiryStatusType } from '/store/TYPE/inquiry/inquiryStatusType';
import Link from 'next/link';
import transformDate from "/util/func/transformDate";


export const inquiryStatusIcon = {
  [inquiryStatusType.UNANSWERED]: (
    <i className={`${s.icon} ${s.UNANSWERED}`}>{inquiryStatusType.KOR.UNANSWERED}</i>
  ),
  [inquiryStatusType.ANSWERED]: (
    <i className={`${s.icon} ${s.ANSWERED}`}>{inquiryStatusType.KOR.ANSWERED}</i>
  ),
  [inquiryStatusType.MULTIPLE_ANSWERED]: (
    <>
      <i className={`${s.icon} ${s.ANSWERED}`}>{inquiryStatusType.KOR.UNANSWERED}</i>
      <i className={`${s.icon} ${s.MULTIPLE_ANSWERED}`}>{inquiryStatusType.KOR.MULTIPLE_ANSWERED}</i>
    </>
  ),
};


export const InquiryItem = ({ data }) => {
  const {id, status, title, createdDate } = data;

  return (
    <Link href={`/mypage/inquiry/${id}`} passHref>
      <a>
        <li className={s.tr}>
          <span className={s.status}>{inquiryStatusIcon[status]}</span>
            <div className={s.title}><span>{title}</span></div>
          <span className={s.date}>{transformDate(createdDate,'time', {seperator:'.'})}</span>
        </li>
      </a>
    </Link>

  );
};