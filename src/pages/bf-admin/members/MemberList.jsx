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


    return (
      <li className={s.item} key={`item-${DATA.id}`}>
        <span>
          <button className="admin_btn basic_s solid">상세보기</button>
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