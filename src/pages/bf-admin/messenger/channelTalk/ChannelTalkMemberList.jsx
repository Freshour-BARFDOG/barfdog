import s from './channelTalk.module.scss';
import Link from 'next/link';
import transformDate from '/util/func/transformDate';
import popupWindow from '/util/func/popupWindow';
import {transformPhoneNumber} from "/util/func/transformPhoneNumber";


export default function ChannelTalkMemberList({ items }) {
  if (!items || !items.length) return;
  
  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <ItemList key={`item-${i}`} index={item.id} item={item} />
      ))}
    </ul>
  );
}


const ItemList = ({ item, sortableItemRef }) => {
  // console.log(item);
  const DATA = {
    memberId: item.memberId,
    guestName: item.guestName || '-', // 상담 시 입력한 이름
    guestEmail: item.guestEmail || '-', // 상담 시 입력한 이메일
    guestPhoneNumber: transformPhoneNumber(item.guestPhoneNumber) || '-', // 상담 시 입력한 전화번호
    joinDate: transformDate(item?.joinDate) ||'-', // 회원가입일자
    memberName: item.memberName ||'-', //  회원 이름 (미가입 시 null)
    memberEmail: item.memberEmail ||'-', // 회원 이메일 (미가입 시 null)
    memberPhoneNumber: transformPhoneNumber(item.memberPhoneNumber) ||'-' , // 회원 연락처 (미가입 시 null)
    createdDate: transformDate(item?.createdDate), // 채널톡 상담 시작 시작일자
    firstPaymentDate: transformDate(item?.firstPaymentDate) || '-', //  첫 결제 일자
    paid: item.didPay ? 'Y' : 'N', // 결제 여부, 미가입 or 미구매 시 false
  };

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`} ref={sortableItemRef}>
      <span>{DATA.createdDate}</span>
      <span>{DATA.guestName}</span>
      <span className={s.scrollBox}>{DATA.guestEmail}</span>
      <span>{DATA.guestPhoneNumber}</span>
      <span>{DATA.joinDate}</span>
      <span>{DATA.memberName}</span>
      <span className={s.scrollBox}>{DATA.memberEmail}</span>
      <span>{DATA.memberPhoneNumber}</span>
      <span>{DATA.firstPaymentDate}</span>
      <span>
        {DATA.memberId ? (
          <Link href={`/bf-admin/popup/memberInfo/${DATA.memberId}`} passHref>
            <a target="_blank" className="admin_btn basic_s solid" onClick={onPopupHandler}>
              상세보기
            </a>
          </Link>
        ) : '-'}
      </span>
    </li>
  );
};
