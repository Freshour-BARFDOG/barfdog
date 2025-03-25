import s from './search.module.scss';
import transformDate from '/util/func/transformDate';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import popupWindow from '/util/func/popupWindow';
import React from 'react';

export default function SearchResultList({ items, currentPage }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <Item
          key={`item-${item.id}-${i}`}
          number={i + 1 + (currentPage - 1) * 50}
          index={i}
          item={item}
        />
      ))}
    </ul>
  );
}

const Item = ({ item, sortableItemRef, number }) => {
  const DATA = {
    number,
    id: item.id, // 주문 id => ! 주문 id로 주문정보를 조회가능
    merchantUid: item.merchantUid, // 상품 주문 번호
    orderStatus: orderStatus.KOR[item.orderStatus],
    createdDate: transformDate(item.createdDate, 'time', { seperator: '/' }),
    orderDate: transformDate(item.orderDate, 'time', { seperator: '/' }),
    orderType: item.orderType,
    buyerId: item.memberEmail,
    buyerName: item.memberName,
    buyerPhone: transformPhoneNumber(item.memberPhoneNumber),
    recipientName: item.recipientName,
    recipientPhoneNumber: transformPhoneNumber(item.recipientPhoneNumber),
    dogName: item.dogName,
    bundleStatus: item.packageDelivery ? 'Y' : 'N',
  };

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = `/sell/popup/${DATA.orderType}/${DATA.id}`;
    popupWindow(href, { width: 1000, height: 716 });
  };

  return (
    <li className={s.item} ref={sortableItemRef} data-idx={DATA.id}>
      <span>{DATA.number}</span>
      <span>
        <button
          className="admin_btn basic_s solid"
          data-order-id={DATA.id}
          onClick={onPopupHandler}
        >
          상세보기
        </button>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.merchantUid}</em>
      </span>
      {/*<span>*/}
      {/*  <em className={'overflow-x-scroll'}>{DATA.merchantUid}</em>*/}
      {/*</span>*/}
      <span>
        <em className={'overflow-x-scroll'}>
          <p>{DATA.orderStatus}</p>
          <p>{DATA.orderDate}</p>
        </em>
      </span>
      <span>{DATA.buyerId}</span>
      <span className={s.flex_col}>
        <p>{DATA.buyerName}</p>
        <p>{DATA.buyerPhone}</p>
      </span>
      <span className={s.flex_col}>
        <p>{DATA.recipientName}</p>
        <p>{DATA.recipientPhoneNumber}</p>
      </span>
      <span>{DATA.dogName}</span>
      <span>{DATA.bundleStatus}</span>
    </li>
  );
};
