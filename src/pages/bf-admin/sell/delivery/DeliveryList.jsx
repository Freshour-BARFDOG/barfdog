import React from 'react';
import s from './delivery.module.scss';
import transformDate from '/util/func/transformDate';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import popupWindow from '/util/func/popupWindow';

export default function SearchResultList({ items }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <ItemList key={`item-${item.id}-${i}`} index={i} item={item} />
      ))}
    </ul>
  );
}

const ItemList = ({ item, sortableItemRef }) => {
  console.log(item);
  const DATA = {
    id: item.id, // 주문 id => ! 주문 id로 주문정보를 조회가능
    orderItemId: item.orderItemId, // 주문한 상품의 id
    orderStatus: orderStatus.KOR[item.orderStatus],
    orderDate: transformDate(item.orderDate, 'time', { seperator: '/' }),
    orderType: item.orderType,
    deliveryNumber: item.deliveryNumber,
    deliveryStatus: orderStatus.KOR[item.orderStatus] || '-',
    buyerId: item.memberEmail,
    buyerName: item.memberName,
    buyerPhone: transformPhoneNumber(item.memberPhoneNumber),
    recipientName: item.recipientName,
    recipientPhoneNumber: transformPhoneNumber(item.recipientPhoneNumber),
    bundleStatus: item.packageDelivery ? 'Y' : 'N',
  };

  const onDetailInfoPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = `/bf-admin/sell/popup/${DATA.orderType}/${DATA.id}`;
    popupWindow(href, { width: 1000, height: 716 });
  };
  const onDeliveryPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return console.error('window is not defined');
    const href = e.currentTarget.href;
    popupWindow(href, { width: 540, height: 480, left: 200, top: 100 });
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`} ref={sortableItemRef} data-idx={DATA.id}>
      <span>
        <button
          className="admin_btn basic_s solid"
          data-order-id={DATA.id}
          onClick={onDetailInfoPopupHandler}
        >
          상세보기
        </button>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.id}</em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>
          <p>{DATA.orderStatus}</p>
          <p>{DATA.orderDate}</p>
        </em>
      </span>
      <span>{DATA.deliveryStatus}</span>
      <span>
        <a
          className={'overflow-x-scroll btn_link'}
          href={`https://trace.goodsflow.com/VIEW/V1/whereis/BARFDOG/CJGLS/${DATA.deliveryNumber}`}
          target="_blank"
          rel={'noreferrer'}
          onClick={onDeliveryPopupHandler}
        >
          {DATA.deliveryNumber}
        </a>
      </span>
      <span>{DATA.buyerId}</span>
      <span>
        {DATA.buyerName} {DATA.buyerPhone}
      </span>
      <span>
        {DATA.recipientName} {DATA.recipientPhoneNumber}
      </span>
      <span>{DATA.bundleStatus}</span>
    </li>
  );
};
