import s from './order.module.scss';
import Link from "next/link";
import Checkbox from "/src/components/atoms/Checkbox";
import popupWindow from "/util/func/popupWindow";
import transformDate from "/util/func/transformDate";
import React from "react";
import {orderStatus} from "../../../../../store/TYPE/orderStatusTYPE";
import {transformPhoneNumber} from "../../../../../util/func/transformPhoneNumber";
import PureCheckbox from "../../../../components/atoms/PureCheckbox";




export default function SearchResultList({ items, selectedIdList, onSelectedItem }) {
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



const Item = ({ item, sortableItemRef, selectedIdList, onSelectedItem }) => {
  const DATA = {
    id: item.id, // 주문 id => ! 주문 id로 주문정보를 조회가능
    orderItemId: item.orderItemId, // 주문한 상품의 id
    // merchantUid: item.merchantUid, // 상품 주문 번호 // ! 개별 상품 취소 기능 삭제로 인하여, 해당 column 미노출
    orderStatus: orderStatus.KOR[item.orderStatus],
    orderDate: transformDate(item.orderDate, 'time', { seperator: '/' }),
    orderType: item.orderType,
    buyerId: item.memberEmail,
    buyerName: item.memberName,
    buyerPhone: transformPhoneNumber(item.memberPhoneNumber),
    recipientName: item.recipientName,
    recipientPhoneNumber: transformPhoneNumber(item.recipientPhoneNumber),
    bundleStatus: item.packageDelivery ? 'Y' : 'N',
  };
  
  
  
  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = `/bf-admin/sell/popup/${DATA.orderType}/${DATA.id}`;
    popupWindow(href, { width: 1000, height: 716 });
  };



  return (
    <li className={s.item} ref={sortableItemRef} data-idx={DATA.id}>
      <span>
        <PureCheckbox
          id={item.id}
          className={s.inner}
          onClick={onSelectedItem}
          value={selectedIdList.indexOf(item.id) >= 0 || ''}
        />
      </span>
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
        <em className={'overflow-x-scroll'}>{DATA.orderItemId}</em>
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
      <span>{DATA.bundleStatus}</span>
    </li>
  );
};
