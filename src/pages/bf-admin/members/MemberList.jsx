import Link from "next/link";
import s from "./members.module.scss";






  const ItemList = ({ item }) => {
    

    const DATA = {
      id: item.id || 91,
      grade: item.grade || "BRONZE",
      name: item.name || "일반 회원3",
      email: item.email || "email@gmail.com3",
      phoneNumber: item.phoneNumber || "0101234553",
      dogName: item.dogName || "바둑이",
      subscribe: item.subscribe || "Y",
      accumulatedAmount: item.accumulatedAmount || "N",
      unconnected: item.unconnected || "N",
      _links: {
        query_member: {
          href: "http://localhost:8080/api/admin/members/91",
        },
      },
    };


    const popupWindow = (href, width, height) => {
      if (typeof window === "undefined") return;
      window.open(
        href,
        "popupWindow",
        `toolbar=no,
        location=no,
        width=${width},
        height=${height},
        left=150,
        top=250,
        status=no,
        menubar=no,
        scrollbars=yes,
        resizable=yes`
      );
      return false;
    };

    const onPopupHandler = (e) => {
      if(typeof window === 'undefined') return;
      const href = e.currentTarget.href;
      popupWindow(href, 1000, 668);
    }


    return (
      <li className={s.item} key={`item-${DATA.id}`}>
        <span>
          <Link href={`/bf-admin/members/popup/${DATA.id}`} passHref>
            <a target="_blank" onClick={onPopupHandler}>
              <button className="admin_btn basic_s solid">상세보기</button>
            </a>
          </Link>
        </span>
        <span>{DATA.grade}</span>
        <span>{DATA.name}</span>
        <span className={` ${s["text-transform-ellipsis"]}`}>{DATA.email}</span>
        <span>{DATA.phoneNumber}</span>
        <span>{DATA.dogName}</span>
        <span>{DATA.subscribe}</span>
        <span>{DATA.accumulatedAmount}</span>
        <span>{DATA.unconnected}</span>
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