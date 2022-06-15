import s from "../reward.module.scss";






  const ItemList = ({ item }) => {
    

    const DATA = {
      id: item.id || 91,
      reg_data: item.reg_data || "22-02-22",
      name: item.name || "친구초대 적립금",
      amount: item.amount || "3,000원",
      userName: item.userName || "김바프",
      email: item.email || "barf@",
      _links: {
        // query_member: {
        //   href: "http://localhost:8080/api/admin/members/91",
      },
    };


    return (
      <li className={s.item} key={`item-${DATA.id}`}>
        <span>{DATA.reg_data}</span>
        <span>{DATA.name}</span>
        <span>{DATA.amount}</span>
        <span>{DATA.userName}</span>
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