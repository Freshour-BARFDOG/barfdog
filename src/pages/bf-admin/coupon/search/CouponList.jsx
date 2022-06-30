import s from "../coupon.module.scss";






  const ItemList = ({ item }) => {
    

    const DATA = {
      id: item.id || 91,
      name: item.name || "견주 생일 쿠폰",
      code: item.code || "BA123456",
      sort: item.sort || "자동발행쿠폰",
      description:
        item.description ||
        "쿠폰설명..쿠폰설명..쿠폰설명..쿠폰설명..쿠폰설명..",
      discount: item.discount || "15%",
      couponTarget: item.couponTarget || "ALL",
      amount: item.amount || "무제한",
      expiredDate: item.expiredDate || "-",
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
        <span className={"overflow-x-scroll"}>{DATA.description}</span>
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