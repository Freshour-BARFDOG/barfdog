import transformDate from "../../../../util/func/transformDate";
import s from "../../../pages/bf-admin/community/inquiry/adminInquiryItems.module.scss";
import PureCheckbox from "../../atoms/PureCheckbox";
import {inquiryStatusIcon} from "../../../../store/TYPE/inquiry/InquiryStatusIcon";
import {InquiryAnswerItem} from "./InquiryAnswerItem";
import React from "react";

export const InquiryItem = ({item, onSelectedItem, selectedIdList}) => {
  
  const answerList = item.answerList?.length
    ? item.answerList.map( (a) => ({
      id: a.id,
      title: a.title,
      createdDate: transformDate( a.createdDate, 'time', {seperator: '.'} ),
    }) )
    : [];
  const DATA = {
    id: item.id,
    title: item.title,
    name: item.name,
    email: item.email,
    createdDate: transformDate( item.createdDate, 'time', {seperator: '.'} ),
    answerStatus: item.answerStatus,
    answerList: answerList,
  };
  
  return (
    <>
      <li className={s.item} data-idx={DATA.id}>
        <span>
          <PureCheckbox
            id={item.id}
            onClick={onSelectedItem}
            value={selectedIdList?.indexOf( item.id ) >= 0 || ''}
          />
        </span>
        <span className={`${s.title}`}>
          <a
            href={`/bf-admin/community/inquiry/${DATA.id}`}
            className={'overflow-x-scroll'}
          >
            <em className={`overflow-x-scroll`}>{DATA.title}</em>
          </a>
        </span>
        <span>
          <em className={'overflow-x-scroll'}>
            <p>{DATA.name}</p>
          </em>
        </span>
        <span>
          <em className={'overflow-x-scroll'}>
            <p>{DATA.email}</p>
          </em>
        </span>
        <span className={s.answerStatus}>
          {inquiryStatusIcon[DATA.answerStatus]}
        </span>
        <span className={s.flex_col}>{DATA.createdDate}</span>
      </li>
      {answerList.length > 0 &&
        answerList.map( (answer, index) => (
          <InquiryAnswerItem key={`answerList-${index}`} data={answer} onSelectedItem={onSelectedItem} selectedIdList={selectedIdList}/>
        ) )}
    </>
  );
};