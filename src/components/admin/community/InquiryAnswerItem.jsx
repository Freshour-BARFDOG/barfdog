import s from "../../../pages/bf-admin/community/inquiry/adminInquiryItems.module.scss";
import React from "react";
import PureCheckbox from "../../atoms/PureCheckbox";
import {InquiryAnswerIcon} from "./InquiryAnswerIcon";

export const InquiryAnswerItem = ({data, onSelectedItem, selectedIdList}) => {
  const {id, title, createdDate} = data;
  return (
    <li className={s.item} data-idx={id}>
      <span>
        <PureCheckbox
          id={id}
          onClick={onSelectedItem}
          value={selectedIdList?.indexOf( id ) >= 0 || ''}
        />
      </span>
      <span className={`${s.title}`}>
        <a
          href={`/bf-admin/community/inquiry/${id}`}
          className={'overflow-x-scroll'}
        >
          <InquiryAnswerIcon/>
          <em>{title}</em>
        </a>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>
          <p>{'관리자'}</p>
        </em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>
          <p>{'-'}</p>
        </em>
      </span>
      <span className={s.answerStatus}>{'-'}</span>
      <span className={s.flex_col}>{createdDate}</span>
    </li>
  );
};
