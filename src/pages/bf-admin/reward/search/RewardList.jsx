import s from "../reward.module.scss";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import transformDate from "/util/func/transformDate";
import {rewardStatusType} from "../../../../../store/TYPE/rewardStatusType";






  const ItemList = ({ item }) => {

    const DATA = {
      id: item.id,
      createdDate: transformDate(item.createdDate), // 발행일자
      name: item.name, // 적립금 발행 시, 발행적립금 타이틀
      amount: transformLocalCurrency(item.amount) + '원' , // 발행 금액
      memberName: item.memberName, // 회원명
      email: item.email,
      rewardStatus: item.rewardStatus,
    };


    return (
      <li className={s.item} key={`item-${DATA.id}`}>
        <span>{DATA.createdDate}</span>
        <span>{DATA.name}</span>
        <span>{item.rewardStatus === rewardStatusType.SAVED ? '+' : '-'}{DATA.amount}</span>
        <span>{DATA.memberName}</span>
        <span>{DATA.email}</span>
      </li>
    );
  };



export default function MemberList({items}) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item) => (
        <ItemList key={`item-${item.id}`} index={item.id} item={item} />
      ))}
    </ul>
  );
}