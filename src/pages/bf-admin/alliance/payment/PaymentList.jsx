import Link from 'next/link';
import s from './payment.module.scss';
import popupWindow from '@util/func/popupWindow';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';

function DateTimeDisplay({ dateTimeString }) {
  const dateTime = new Date(dateTimeString);

  const dateStr = dateTime.toLocaleDateString();
  const timeStr = dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateStr}${timeStr}`;
}

export default function PaymentList({ items }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <ItemList key={`item-${index}`} number={index + 1} item={item} />
      ))}
    </ul>
  );
}

const ItemList = ({ item, number }) => {
  const DATA = {
    number,
    orderId: item.orderId,
    merchantUid: item.merchantUid,
    email: item.email,
    dtype: item.dtype === 'general' ? '일반' : 'subscribe' ? '구독' : '-',
    orderStatus: orderStatus.KOR[item.orderStatus],
    orderConfirmDate: item.orderConfirmDate
      ? DateTimeDisplay({ dateTimeString: item.orderConfirmDate })
      : '-',
    paymentDate: item.paymentDate
      ? DateTimeDisplay({ dateTimeString: item.paymentDate })
      : '-',
    deliveryPrice: transformLocalCurrency(item.deliveryPrice),
    alliance: item.alliance === 'cb' ? '콕뱅크' : '-',
    discountCoupon: transformLocalCurrency(item.discountCoupon),
    discountGrade: transformLocalCurrency(item.discountGrade),
    discountReward: transformLocalCurrency(item.discountReward),
    allianceDiscount: transformLocalCurrency(item.allianceDiscount),
    discountTotal: transformLocalCurrency(item.discountTotal),
    orderPrice: transformLocalCurrency(item.orderPrice),
    paymentPrice: transformLocalCurrency(item.paymentPrice),
  };

  return (
    <li className={s.item} key={`item-${DATA.number}`}>
      <span>{DATA.number}</span>
      <span>{DATA.dtype}</span>
      <span>{DATA.merchantUid}</span>
      <span>{DATA.email}</span>
      <span>{DATA.orderStatus}</span>
      <span>{DATA.paymentDate}</span>
      <span>{DATA.paymentPrice}</span>
      <span>{DATA.alliance}</span>
      <span>{DATA.allianceDiscount}</span>
    </li>
  );
};
