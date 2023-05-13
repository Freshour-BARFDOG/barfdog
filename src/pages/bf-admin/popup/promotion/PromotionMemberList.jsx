import React from 'react';
import s from './promotionInPopup.module.scss';
import {couponUseType} from "/store/TYPE/couponType";
import {filterDateTimeSeperator} from "/util/func/filter_dateAndTime";

export default function PromotionMemberList({items}) {
  if (!items || !items.length) return;
  return (
    <ul className={s.table_body}>
      {items.map((item, index) => (
        <PromotionMember
          key={`item-${item.id}-${index}`}
          item={item}
        />
      ))}
    </ul>
  );
}


const PromotionMember = ({item}) => {
  const DATA = {
    id: item.id,
    email: item.email,
    name: item.name,
    createdDate: filterDateTimeSeperator(item.createdDate, "T",  " "),
    expiredDate: filterDateTimeSeperator(item.expiredDate, "T",  " "),
    status: couponUseType.KOR[item.status],
    remaining: item.remaining,
    amount: item.amount,
    used: item.used ? 'Y' : 'N',
  };


  return (
    <li className={s.item}>
      <span>{DATA.used}</span>
      <span>{DATA.email}</span>
      <span>{DATA.name}</span>
      <span>{DATA.createdDate}</span>
      <span>{DATA.expiredDate}</span>
      <span>{DATA.remaining}/{DATA.amount}</span>
    </li>
  );
};
