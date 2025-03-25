import s from '../reward.module.scss';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import transformDate from '/util/func/transformDate';
import { rewardStatusType } from '../../../../store/TYPE/rewardStatusType';
import { rewardType } from '../../../../store/TYPE/rewardType';

const ItemList = ({ item, number }) => {
  const DATA = {
    id: item.id,
    number,
    createdDate: transformDate(item.createdDate), // 발행일자
    name: item.name, // 적립금 발행 시, 발행적립금 타이틀
    rewardType: rewardType.KOR[item.rewardType], // 적립금 타입
    amount: transformLocalCurrency(item.amount) + '원', // 발행 금액
    memberName: item.memberName, // 적립금 발급자 (회원명)
    email: item.email, // 발급자 아이디
    issuerName: item.issuerName, // 적립금 수령자
    issuerEmail: item.issuerEmail, // 수령자 아이디
    rewardStatus: item.rewardStatus,
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`}>
      <span>{DATA.number}</span>
      <span>{DATA.createdDate}</span>
      <span>{DATA.name}</span>
      <span>{DATA.rewardType}</span>
      <span>
        {item.rewardStatus === rewardStatusType.SAVED ? '+' : '-'}
        {DATA.amount}
      </span>
      <span>{DATA.memberName}</span>
      <span>{DATA.email}</span>
      <span>{DATA.issuerName}</span>
      <span>{DATA.issuerEmail}</span>
    </li>
  );
};

export default function MemberList({ items, currentPage }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <ItemList
          key={`item-${item.id}`}
          index={item.id}
          number={index + 1 + (currentPage - 1) * 10}
          item={item}
        />
      ))}
    </ul>
  );
}
