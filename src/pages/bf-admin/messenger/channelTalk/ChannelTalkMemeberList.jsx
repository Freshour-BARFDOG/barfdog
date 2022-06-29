import s from './channelTalk.module.scss';
import getElemIdx from '@util/func/getElemIdx';
import transformDate from '/util/func/transformDate';

const ItemList = ({ item, sortableItemRef }) => {
  const DATA = {
    id: item.id || '0',
    name: item.name || '김바프',
    email: item.email || 'userId@gmail.com',
    phoneNumber: item.phoneNumber || '01012345678',
    isMember: item.isMember ? 'Y' : 'N',
    reg_date: transformDate(item?.reg_date) || '2022-06-21',
    didPay: item.didPay ? 'Y' : 'N',
    payment_date: transformDate(item?.payment_date) || '2022-08-12',
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`} ref={sortableItemRef}>
      <span>{DATA.name}</span>
      <span className={s.scrollBox}>{DATA.email}</span>
      <span>{DATA.phoneNumber}</span>
      <span>{DATA.isMember}</span>
      <span>{DATA.reg_date}</span>
      <span>{DATA.didPay}</span>
      <span>{DATA.payment_date}</span>
      <span>
        <button
          className="admin_btn basic_s solid"
          // onClick={onDeleteItemHandler}
          // data-apiurl={DATA.apiurl.delete}
        >
          상세보기
        </button>
      </span>
    </li>
  );
};

export default function ChannelTalkMemberList({ items, onDeleteItem }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <ItemList key={`item-${item.id}`} index={item.id} item={item} />
      ))}
    </ul>
  );
}
