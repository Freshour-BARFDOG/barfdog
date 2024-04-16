import React from 'react';
import s from './delivery.module.scss';
import transformDate from '/util/func/transformDate';
import { deliveryStatus, orderStatus } from '/store/TYPE/orderStatusTYPE';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import popupWindow from '/util/func/popupWindow';
import PureCheckbox from '/src/components/atoms/PureCheckbox';

export default function SearchResultList({
  items,
  selectedIdList,
  onSelectedItem,
  currentPage,
}) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <ItemList
          key={`item-${item.id}-${i}`}
          index={i}
          number={i + 1 + (currentPage - 1) * 10}
          item={item}
          selectedIdList={selectedIdList}
          onSelectedItem={onSelectedItem}
        />
      ))}
    </ul>
  );
}

const ItemList = ({
  item,
  sortableItemRef,
  selectedIdList,
  onSelectedItem,
  number,
}) => {
  const DATA = {
    id: item.id, // 주문 id => ! 주문 id로 주문정보를 조회가능
    number,
    merchantUid: item.merchantUid, // 상품 주문 번호
    orderItemId: item.orderItemId, // 주문한 상품의 id
    orderStatus: orderStatus.KOR[item.orderStatus],
    createdDate: transformDate(item.createdDate, 'time', { seperator: '/' }),
    orderDate: transformDate(item.orderDate, 'time', { seperator: '/' }),
    orderType: item.orderType,
    deliveryNumber: item.deliveryNumber,
    deliveryCode: item.deliveryCode,
    deliveryStatus: deliveryStatus.KOR[item.deliveryStatus] || '-',
    buyerId: item.memberEmail,
    buyerName: item.memberName,
    buyerPhone: transformPhoneNumber(item.memberPhoneNumber),
    recipientName: item.recipientName,
    recipientPhoneNumber: transformPhoneNumber(item.recipientPhoneNumber),
    dogName: item.dogName,
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
    if (typeof window === 'undefined')
      return console.error('window is not defined');
    const href = e.currentTarget.href;
    popupWindow(href, { width: 540, height: 480, left: 200, top: 100 });
  };

  return (
    <li
      className={s.item}
      key={`item-${DATA.id}`}
      ref={sortableItemRef}
      data-idx={DATA.id}
    >
      <span>
        <PureCheckbox
          id={item.id}
          onClick={onSelectedItem}
          value={selectedIdList.indexOf(item.id) >= 0 || ''}
        />
      </span>
      <span>{DATA.number}</span>
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
        <em className={'overflow-x-scroll'}>{DATA.merchantUid}</em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>
          <p>{DATA.orderStatus}</p>
          <p>{DATA.orderDate}</p>
        </em>
      </span>
      <span>{DATA.deliveryStatus}</span>
      <span>{DATA.deliveryCode === 'EPOST' ? '우체국' : '대한통운'}</span>
      <span>
        <a
          className={'overflow-x-scroll btn_link'}
          href={`https://trace.goodsflow.com/VIEW/V1/whereis/${process.env.NEXT_PUBLIC_GOODSFLOW_SITECODE}/${DATA.deliveryCode}/${DATA.deliveryNumber}`}
          target="_blank"
          rel={'noreferrer'}
          onClick={onDeliveryPopupHandler}
        >
          {DATA.deliveryNumber}
        </a>
      </span>
      <span>{DATA.buyerId}</span>
      <span>
        <em className={'overflow-x-scroll'}>
          <p>{DATA.buyerName}</p>
          <p>{DATA.buyerPhone}</p>
        </em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>
          <p>{DATA.recipientName}</p>
          <p>{DATA.recipientPhoneNumber}</p>
        </em>
      </span>
      <span>{DATA.dogName}</span>
      <span>{DATA.bundleStatus}</span>
    </li>
  );
};
