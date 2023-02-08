import React, {useState} from "react";
import s from "../coupon.module.scss";
import {couponUseType, global_couponType} from "/store/TYPE/couponType";
import Spinner from "/src/components/atoms/Spinner";



export default function MemberList({
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
  
    const [submittedDeleteApi, setSubmittedDeleteApi] = useState( false );
    
    let couponTarget= '';
    if(item.couponTarget === couponUseType.ALL){
      couponTarget = couponUseType.KOR.ALL
    } else  if(item.couponTarget === couponUseType.SUBSCRIBE){
      couponTarget = couponUseType.KOR.SUBSCRIBE;
    } else if (item.couponTarget === couponUseType.GENERAL) {
      couponTarget = couponUseType.KOR.GENERAL;
    }
    
    let couponType;
    if(item.couponType === global_couponType.AUTO_PUBLISHED){
      couponType = global_couponType.KOR.AUTO_PUBLISHED;
    } else  if(item.couponType === global_couponType.CODE_PUBLISHED){
      couponType = global_couponType.KOR.CODE_PUBLISHED;
    } else if (item.couponType === global_couponType.GENERAL_PUBLISHED) {
      couponType = global_couponType.KOR.GENERAL_PUBLISHED;
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
      apiurl: {
          delete: `/api/admin/coupons/${item.id}/inactive`, // backend에서 전달되지 않
      },
    };
    
    const onDelete = (e) => {
      if ( submittedDeleteApi ) return console.error( "이미 제출된 양식입니다." );
      if ( !confirm( `선택된 쿠폰(${DATA.name})을 삭제하시겠습니까?` ) ) return;
      const apiUrl = e.currentTarget.dataset.apiUrl;
      onDeleteItem( apiUrl, DATA.id );
      setSubmittedDeleteApi( true );
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
          {couponType === global_couponType.KOR.AUTO_PUBLISHED ? <em className={'errorMSG'}>삭제불가</em> : <button
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
