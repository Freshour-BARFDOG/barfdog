import React, {useState} from "react";
import s from "../coupon.module.scss";
import {couponUseType, global_couponType} from "/store/TYPE/couponType";
import Spinner from "/src/components/atoms/Spinner";
import transformDate from "/util/func/transformDate";



export default function CouponList({
                                     items,
                                     onDeleteItem,
                                     isLoading
}) {
  if (!items || !items.length) return;
  
  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <ItemList
          key={`item-${item.id}-${i}`}
          item={item}
          onDeleteItem={onDeleteItem}
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
}


const ItemList = ({item, onDeleteItem, isLoading }) => {

  const [isSubmitted, setIsSubmitted] = useState( false );

  const DATA = {
    id: item.id,
    couponType: item.couponType,
    name: item.name,
    code: item.code || "-",
    description:
      item.description,
    discount: item.discount,
    couponTarget: item.couponTarget,
    amount: item.amount,
    expiredDate: transformDate(item.expiredDate) || "-",
    apiurl: {
        delete: `/api/admin/coupons/${item.id}/inactive`
    },
  };

  const onDelete = (e) => {
    if ( isSubmitted ) return console.error( "이미 제출된 양식입니다." );
    if ( !confirm( `선택된 쿠폰(${DATA.name})을 삭제하시겠습니까?` ) ) return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onDeleteItem( apiUrl, DATA.id );
    setIsSubmitted( true );
  };


  return (
    <li className={s.item} key={`item-${DATA.id}`}>
      <span>{global_couponType.KOR[DATA.couponType]}</span>
      {DATA.couponType !== global_couponType.AUTO_PUBLISHED && <span>{DATA.code}</span>}
      {DATA.couponType !== global_couponType.AUTO_PUBLISHED && <span>{DATA.expiredDate}</span>}
      <span>{DATA.name}</span>
      <span><em className="overflow-x-scroll">{DATA.description}</em></span>
      <span>{DATA.discount}</span>
      <span>{couponUseType.KOR[DATA.couponTarget]}</span>
      <span>{DATA.amount}</span>
      <span>
        {DATA.couponType === global_couponType.AUTO_PUBLISHED
          ? <em className={'errorMSG'}>삭제불가</em>
          : <button
          className="admin_btn basic_s solid"
          onClick={onDelete}
          data-api-url={DATA.apiurl.delete}
        >
          {(isLoading?.delete && isLoading.delete[DATA.id]) ? <Spinner style={{color: "white"}}/> : "삭제"}
        </button>}
      </span>
    </li>
  );
};
