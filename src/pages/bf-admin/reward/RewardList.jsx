import s from "./reward.module.scss";






  const ItemList = ({ item }) => {
    

    const DATA = {
      id: item.id || 91,
      reg_data: item.reg_data || "22-02-22",
      name: item.name || "견주 생일 쿠폰",
      amount: item.amount || "무제한",
      userName: item.userName || "김바프",
      userId: item.userId || "김바프",
      _links: {
        // query_member: {
        //   href: "http://localhost:8080/api/admin/members/91",
      },
    };


    return (
      <li className={s.item} key={`item-${DATA.id}`}>
        <span>{DATA.code}</span>
        <span>{DATA.sort}</span>
        <span>{DATA.name}</span>
        <span className={"text-transform-ellipsis"}>{DATA.description}</span>
        <span>{DATA.discount}</span>
        <span>{DATA.couponTarget}</span>
        <span>{DATA.amount}</span>
        <span>
          <button
            className="admin_btn basic_s solid"
            // onClick={onDeleteItemHandler}
            // data-apiurl={DATA.apiurl.delete}
          >
            삭제
          </button>
        </span>
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