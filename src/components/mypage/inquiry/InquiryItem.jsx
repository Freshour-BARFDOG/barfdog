import React from 'react';
import s from '/src/pages/mypage/inquiry/inquiry.module.scss';
import { QuestionAnswerStatusType } from '/store/TYPE/questionAnswerStatusType';
import Link from 'next/link';
import transformDate from "/util/func/transformDate";


export const InquiryItem = ({ data }) => {
  const {id, status, title, createdDate } = data;
  const statusIcon = {
    [QuestionAnswerStatusType.UNANSWERED]: (
      <i className={`${s.icon} ${s.UNANSWERED}`}>답변대기</i>
    ),
    [QuestionAnswerStatusType.ANSWERED]: (
      <i className={`${s.icon} ${s.ANSWERED}`}>답변완료</i>
    ),
    [QuestionAnswerStatusType.MULTIPLE_ANSWERED]: (
      <>
        <i className={`${s.icon} ${s.ANSWERED}`}>답변완료</i>
        <i className={`${s.icon} ${s.MULTIPLE_ANSWERED}`}>추가답변</i>
      </>
    ),
  };

  return (
    <Link href={`/mypage/inquiry/${id}`} passHref>
      <a>
        <li className={s.tr}>
          <span className={s.status}>{statusIcon[status]}</span>
            <div className={s.title}><span>{title}</span></div>
          <span className={s.date}>{transformDate(createdDate,'time', {seperator:'.'})}</span>
        </li>
      </a>
    </Link>

  );
};