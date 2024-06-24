import Link from 'next/link';
import s from './subscribes.module.scss';
import popupWindow from '@util/func/popupWindow';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { historyCategoryType } from '../../../../store/TYPE/historyCategoryType';

function DateTimeDisplay({ dateTimeString }) {
  const dateTime = new Date(dateTimeString);

  const dateStr = dateTime.toLocaleDateString();
  const timeStr = dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateStr}${timeStr}`;
}

export default function SubscribesList({ items, currentPage }) {
  if (!items || !items.length) return;
  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <ItemList
          key={index}
          number={index + 1 + (currentPage - 1) * 10}
          index={index}
          item={item}
        />
      ))}
    </ul>
  );
}

const ItemList = ({ item, number }) => {
  const DATA = {
    number,
    subscribeId: item.subscribeId,
    memberName: item.memberName || '-',
    email: item.email || '-',
    dogName: item.dogName,
    createdDate: item.createdDate
      ? DateTimeDisplay({ dateTimeString: item.createdDate })
      : '-',
    modifiedDate: item.modifiedDate
      ? DateTimeDisplay({ dateTimeString: item.modifiedDate })
      : '-',
    subscribeCount: item.subscribeCount,
    subscribePlan: item.subscribePlan || '-',
    recipeName: item.recipeName || '-',
    oneMealGramsPerRecipe: item.oneMealGramsPerRecipe || '-',
    nextPaymentPrice: item.nextPaymentPrice
      ? transformLocalCurrency(item.nextPaymentPrice)
      : '-',
    nextPaymentDate: item.nextPaymentDate
      ? DateTimeDisplay({ dateTimeString: item.nextPaymentDate })
      : '-',
    subscribeStatus:
      item.subscribeStatus === 'BEFORE_PAYMENT'
        ? '구독 전'
        : item.subscribeStatus === 'SURVEY_COMPLETED'
        ? '설문 완료'
        : item.subscribeStatus === 'SUBSCRIBE_CANCEL'
        ? '구독 취소'
        : item.subscribeStatus === 'SUBSCRIBING'
        ? '구독 중'
        : item.subscribeStatus === 'SUBSCRIBE_PENDING'
        ? '구독 보류'
        : '-',
    cancelReason: item.cancelReason || '-',
    countSkipOneTime: item.countSkipOneTime,
    countSkipOneWeek: item.countSkipOneWeek,
    memberCouponName: item.memberCouponName || '-',
    discountCoupon: item.discountCoupon,
    overDiscount: item.overDiscount,
    discountGrade: item.discountGrade,
    nextOrderMerchantUid: item.nextOrderMerchantUid || '-',
    historyCategory: historyCategoryType[item.historyCategory] || '-',
    deleted: item.deleted ? 'Y' : 'N',
  };

  return (
    <li className={s.item} key={`item-${DATA.number}`}>
      <span>{DATA.number}</span>
      <span>{DATA.deleted}</span>
      <span>{DATA.subscribeId}</span>
      <span>{DATA.memberName}</span>
      <span>{DATA.email}</span>
      <span>{DATA.dogName}</span>
      <span>{DATA.subscribeStatus}</span>
      <span>{DATA.createdDate}</span>
      <span>{DATA.modifiedDate}</span>
      <span>{DATA.historyCategory}</span>
      <span>{DATA.subscribeCount}</span>
      <span>{DATA.subscribePlan}</span>
      <span>{DATA.recipeName}</span>
      <span>{DATA.oneMealGramsPerRecipe}</span>
      <span>{DATA.nextPaymentPrice}</span>
      <span>{DATA.nextPaymentDate}</span>
      <span>{DATA.countSkipOneTime}</span>
      <span>{DATA.countSkipOneWeek}</span>
      <span>{DATA.memberCouponName}</span>
      <span>{DATA.discountCoupon}</span>
      <span>{DATA.overDiscount}</span>
      <span>{DATA.discountGrade}</span>
      <span>{DATA.nextOrderMerchantUid}</span>
      <span>{DATA.cancelReason}</span>
    </li>
  );
};
