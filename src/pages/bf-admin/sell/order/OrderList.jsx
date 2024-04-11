import s from './order.module.scss';
import popupWindow from '/util/func/popupWindow';
import transformDate from '/util/func/transformDate';
import React from 'react';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import PureCheckbox from '/src/components/atoms/PureCheckbox';

export default function SearchResultList({
  items,
  selectedIdList,
  onSelectedItem,
  currentPage,
  pathname, // '판매관리 > 주문관리' 구분 위함
}) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <Item
          key={`item-${item.id}-${i}`}
          index={i}
          number={
            pathname.includes('order')
              ? i + 1 + (currentPage - 1) * 50 // '판매관리 > 주문관리'에서는 50개씩(size=50) 이므로, * 50
              : i + 1 + (currentPage - 1) * 10
          }
          item={item}
          selectedIdList={selectedIdList}
          onSelectedItem={onSelectedItem}
        />
      ))}
    </ul>
  );
}

const Item = ({
  item,
  number,
  sortableItemRef,
  selectedIdList,
  onSelectedItem,
}) => {
  const DATA = {
    id: item.id, // 주문 id => ! 주문 id로 주문정보를 조회가능
    number,
    orderItemId: item.orderItemId, // 주문한 상품의 id
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
      <span>{number}</span>
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
      <span>
        <em className={'overflow-x-scroll'}>
          <div>{DATA.orderStatus}</div>
          <div>{DATA.orderDate}</div>
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
