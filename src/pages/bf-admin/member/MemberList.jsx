import Link from "next/link";
import s from "./member.module.scss";
import popupWindow from "@util/func/popupWindow";
import transformLocalCurrency from "/util/func/transformLocalCurrency";

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

  const ItemList = ({ item }) => {
    

    const DATA = {
      id: item.id,
      grade: item.grade,
      name: item.name ,
      email: item.email,
      phoneNumber: item.phoneNumber,
      dogName: item.dogName,
      subscribe: item.subscribe ? 'Y' : 'N',
      accumulatedAmount: transformLocalCurrency(item.accumulatedAmount)+'원',
      longUnconnected: item.longUnconnected ? 'Y' : 'N',
    };


    const onPopupHandler = (e) => {
      e.preventDefault();
      if(typeof window === 'undefined') return;
      const href = e.currentTarget.href;
      popupWindow(href, {width:1000, height:716});
    }


    return (
      <li className={s.item} key={`item-${DATA.id}`}>
        <span>
          <Link href={`/bf-admin/popup/memberInfo/${DATA.id}`} passHref>
            <a
              target="_blank"
              className="admin_btn basic_s solid"
              onClick={onPopupHandler}
            >
              상세보기
            </a>
          </Link>
        </span>
        <span>{DATA.grade}</span>
        <span>{DATA.name}</span>
        <span>{DATA.email}</span>
        <span>{DATA.phoneNumber}</span>
        <span>{DATA.dogName}</span>
        <span>{DATA.subscribe}</span>
        <span>{DATA.accumulatedAmount}</span>
        <span>{DATA.longUnconnected}</span>
      </li>
    );
  };
