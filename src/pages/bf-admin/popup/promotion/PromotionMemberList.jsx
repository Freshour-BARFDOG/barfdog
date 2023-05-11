import React from 'react';
import s from './promotionInPopup.module.scss';
import transformDate from "/util/func/transformDate";

export default function PromotionMemberList({items}) {
  if (!items || !items.length) return;
  return (
    <ul className={s.table_body}>
      {items.map((item, index) => (
        <Item
          key={`item-${item.id}-${index}`}
          item={item}
        />
      ))}
    </ul>
  );
}


const Item = ({item}) => {
  const DATA = {
    id: item.id,
    email: item.email,
    name: item.name,
    createdDate: transformDate(item.createdDate),
    expiredDate: transformDate(item.expiredDate),
    amount: item.amount,
    isUsed: item.isUsed ? 'Y' : 'N',
  };


  return (
    <li className={s.item}>
      <span>{DATA.isUsed}</span>
      <span>{DATA.email}</span>
      <span>{DATA.name}</span>
      <span>{DATA.createdDate}</span>
      <span>{DATA.expiredDate}</span>
      <span>{DATA.amount}</span>
    </li>
  );
};
