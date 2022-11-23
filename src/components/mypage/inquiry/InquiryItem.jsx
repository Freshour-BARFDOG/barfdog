import React from 'react';
import s from '/src/pages/mypage/inquiry/inquiry.module.scss';
import Link from 'next/link';
import transformDate from "/util/func/transformDate";
import {inquiryStatusIcon} from "../../../../store/TYPE/inquiry/InquiryStatusIcon";


export const InquiryItem = ({ data }) => {
  const {id, answerStatus, title, createdDate } = data;

  return (
    <Link href={`/mypage/inquiry/${id}`} passHref>
      <a>
        <li className={s.tr}>
          <span className={s.status}>{inquiryStatusIcon[answerStatus]}</span>
            <div className={s.title}><span>{title}</span></div>
          <span className={s.date}>{transformDate(createdDate,'time', {seperator:'.'})}</span>
        </li>
      </a>
    </Link>

  );
};