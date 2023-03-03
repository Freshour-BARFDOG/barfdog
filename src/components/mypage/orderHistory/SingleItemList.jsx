import s from '/src/pages/mypage/orderHistory/orderHistory.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import React, {useCallback, useState} from 'react';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import {orderStatus} from "/store/TYPE/orderStatusTYPE";
import {cancelGeneralOrder} from "/util/func/order/cancelOrder";
import Spinner from "../../atoms/Spinner";


export const SingleItemList = ({ itemList }) => {
  const [isLoading, setIsLoading] = useState( {cancelOrder: {}} );
  
  // console.log(itemList);
  const onCancelGeneralOrder = useCallback(async (item) => {
    if(!confirm("결제 전 주문을 결제취소처리 하시겠습니까?")) return;
    
    
    const merchantUid = item.orderDto.merchantUid;
    const orderId = item.orderDto.id;
    try {
      setIsLoading(prevState=> ({
        ...prevState,
        cancelOrder:{
          [orderId]: true
        }
      }));
  
      const res = await cancelGeneralOrder(orderId);
      console.log(res);
      if ( res.isDone ) {
        alert(`결제취소처리가 완료되었습니다. \n주문번호: ${merchantUid}`);
        window.location.reload();
      } else{
        alert(`결제취소처리에 실패하였습니다.`);
      }
      
    } catch (err) {
      alert(`결제취소 처리 중 오류가 발생하였습니다.\n 지속적으로 에러가 발생할 경우, 관리자에게 문의바랍니다.`);
      console.error(err)
      
    } finally {
      setIsLoading(prevState=> ({
        ...prevState,
        cancelOrder:{
          [orderId]: false
        }
      }))
    }
  },[itemList]);
  
  return (
    <ul className={s['generalItem-container']}>
      {itemList?.length > 0 &&
        itemList.map((item, index) => (
          <li key={`general-item-${index}`}>
            <div className={s.day}>{item.orderDto.orderDate && transformDate(item.orderDto.orderDate, 'total')}</div>
            <hr className={s.hr1} />
            <div className={s['item-container']}>
              <div className={s.left_box}>
                <figure className={`${s.image} img-wrap`}>
                  {item.thumbnailUrl && (
                    <Image
                      priority
                      src={item.thumbnailUrl}
                      objectFit="cover"
                      layout="fill"
                      alt="레시피 이미지"
                    />
                  )}
                </figure>
                <div className={s.flex_box}>
                  <div className={s.text}>
                    <span className={s.last_text}>
                      {item.itemNameList[0]}&nbsp;
                      {item.itemNameList.length > 1 && `외 ${item.itemNameList.length - 1}건`}
                    </span>
                  </div>
                  <div className={s.text2}>
                    <span>주문번호</span>
                      <span>{item.orderDto.merchantUid}</span>
                    <span>결제금액</span>
                      <span>{transformLocalCurrency(item.orderDto.paymentPrice)}원</span>
                  </div>
                </div>
              </div>
              <span className={s.mid_box}> {orderStatus.KOR[item.orderDto.orderStatus]}</span>
              <div className={s.right_box}>
                {item.orderDto.orderStatus === orderStatus.BEFORE_PAYMENT &&
                  <button className={`${s.btn} ${s.cancelOrder}`} onClick={onCancelGeneralOrder.bind(null, item)}>
                    {isLoading.cancelOrder[item.orderDto.id] ? <Spinner style={{color:"#fff"}}/> : "결제 취소"}
                </button>}
                <Link href={`/mypage/orderHistory/single/${item.orderDto.id}`} passHref>
                  <a className={s.btn}>주문상세</a>
                </Link>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};
