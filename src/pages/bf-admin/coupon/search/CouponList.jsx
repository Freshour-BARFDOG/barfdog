import s from "../coupon.module.scss";
import {global_couponType} from "/store/TYPE/global_couponType";





  const ItemList = ({ item }) => {
    // console.log(item);
    
    let couponTarget= '';
    if(item.couponTarget === 'ALL'){
      couponTarget = '전체'
    } else  if(item.couponTarget === 'SUBSCRIBE'){
      couponTarget = '정기구독'
    } else if (item.couponTarget === 'GENERAL') {
      couponTarget = '일반상품'
    }
    
    let couponType;
    if(item.couponType === global_couponType.AUTO_PUBLISHED){
      couponType = '자동발행'
    } else  if(item.couponType === global_couponType.CODE_PUBLISHED){
      couponType = '코드발행'
    } else if (item.couponType === global_couponType.GENERAL_PUBLISHED) {
      couponType = '일반발행'
    }
  
    
    const DATA = {
      id: item.id,
      couponType: couponType,
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
        <span>{DATA.couponType}</span>
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