import s from "../coupon.module.scss";






  const ItemList = ({ item }) => {
    console.log(item);
    
    let couponTarget;
    if(item.couponTarget === 'ALL'){
      couponTarget = '전체'
    } else  if(item.couponTarget === 'SUBSCRIBE'){
      couponTarget = '정기구독'
    } else if (item.couponTarget === 'GENERAL') {
      couponTarget = '일반상품'
    }

    // 쿠폰 타입 > AUTO_PUBLISHED : 자동발행 / 삭제불가
    // 쿠폰 타입 > GENERAL_PUBLISHED  : 직접발행 / 유저 쿠폰함에 쿠폰 생성시킴 (고객사와 협의 후, 사용하지 않기로 협의된 기능)
    // 쿠폰 타입 > CODE_PUBLISHED :  직접발행 / 유저가 코드 입력 후 쿠폰함에 생성
    const DATA = {
      id: item.id,
      type: item.type || "자동발행쿠폰",
      name: item.name,
      code: item.code || "-",
      description:
        item.description,
      discount: item.discount,
      couponTarget: couponTarget,
      amount: item.amount,
      expiredDate: item.expiredDate || "-",
      _links: {
        // query_member: {
        //   href: "http://localhost:8080/api/admin/members/91",
      },
    };


    return (
      <li className={s.item} key={`item-${DATA.id}`}>
        <span>{DATA.type}</span>
        <span>{DATA.code}</span>
        <span>{DATA.name}</span>
        <span><em className="overflow-x-scroll">{DATA.description}</em></span>
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