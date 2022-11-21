import React from 'react';
import s from './adminInquiryItems.module.scss';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import transformDate from '/util/func/transformDate';
import { inquiryStatusIcon } from '/store/TYPE/inquiry/InquiryStatusIcon';

export default function InquiryItemList({
  items,
  selectedIdList,
  onSelectedItem,
}) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <Item
          key={`item-${item.id}-${i}`}
          index={i}
          item={item}
          selectedIdList={selectedIdList}
          onSelectedItem={onSelectedItem}
        />
      ))}
    </ul>
  );
}


const Item = ({ item, onSelectedItem, selectedIdList }) => {
  const DATA = {
    id: item.id,
    title: item.title,
    name: item.name,
    email: item.email,
    createdDate: transformDate(item.createdDate, 'time', { seperator: '.' }),
    answerStatus: item.answerStatus,
  };

  return (
    <li className={s.item} data-idx={DATA.id}>
      <span>
        <PureCheckbox
          id={item.id}
          onClick={onSelectedItem}
          value={selectedIdList?.indexOf(item.id) >= 0 || ''}
        />
      </span>
      <span>
        <a
          href={`/bf-admin/community/inquiry/${DATA.id}`}
          className={'overflow-x-scroll'}
        >
          <em className={`${s.title} overflow-x-scroll`}>{DATA.title}</em>
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
  );
};
