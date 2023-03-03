import s from '/src/pages/mypage/orderHistory/orderHistory.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import React, {useCallback, useState} from 'react';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {orderStatus} from '/store/TYPE/orderStatusTYPE';
import {cancelSubscribeOrder} from "/util/func/order/cancelOrder";
import Spinner from "../../atoms/Spinner";


export const SubscribeItems = ({ itemList }) => {
  const [isLoading, setIsLoading] = useState( {cancelOrder: {}} );
  // console.log(itemList);

  const onCancelSubscribeOrder = useCallback(async (item) => {
    if(!confirm("결제 전 주문을 결제취소처리 하시겠습니까?")) return;
    
    
    const merchantUid = item.subscribeOrderDto.merchantUid;
    const orderId = item.subscribeOrderDto.orderId;
    try {
      setIsLoading(prevState=> ({
        ...prevState,
        cancelOrder:{
          [orderId]: true
        }
      }));
      const res = await cancelSubscribeOrder(orderId);
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
    <>
      <ul className={`${s['subscribeItem-container']}`}>
        {/* Styles["subscribeItem-container" 는 여러개X Styles.day부터 개체 복사 */}
        {itemList?.length > 0 &&
          itemList.map((item, index) => (
            <li key={`subscribe-item-${index}`}>
              <div className={s.day}>{transformDate(item.subscribeOrderDto.orderDate, 'total')}</div>
              <div className={s.content_body}>
                <div className={s.left_box}>
                  <figure className={`${s.image} img-wrap`}>
                    <Image
                      priority={false}
                      src={item.recipeDto.thumbnailUrl}
                      objectFit="cover"
                      layout="fill"
                      alt={`레시피 썸네일`}
                    />
                  </figure>

                  <div className={s.flex_box}>
                    <div className={s.text}>
                      <p>{item.subscribeOrderDto.dogName}</p>
                      <div className={s.last_text}>
                        {item.recipeDto.recipeName} ({item.subscribeOrderDto.subscribeCount}회차)
                      </div>
                    </div>

                    <div className={s.text2}>
                      <div>주문번호</div>
                      <div>{item.subscribeOrderDto.merchantUid}</div>
                      <div>결제금액</div>
                      <div>{transformLocalCurrency(item.subscribeOrderDto.paymentPrice)}원</div>
                    </div>
                  </div>
                </div>

                <div className={s.mid_box}>
                  {orderStatus.KOR[item.subscribeOrderDto.orderStatus]}
                </div>

                <div className={s.right_box}>
                  {item.subscribeOrderDto.orderStatus === orderStatus.BEFORE_PAYMENT
                    ? <button className={`${s.btn} ${s.cancelOrder}`} onClick={onCancelSubscribeOrder.bind(null, item)}>
                      {isLoading.cancelOrder[item.subscribeOrderDto.orderId] ? <Spinner style={{color:"#fff"}}/> : "결제 취소"}
                      </button>
                    :  <Link
                        href={`/mypage/orderHistory/subscribe/${item.subscribeOrderDto.orderId}`}
                        passHref
                      >
                        <a className={s.btn}>주문상세 </a>
                      </Link>
                  }
                  <a
                    href={`/mypage/subscribe/${item.subscribeOrderDto.subscribeId}`}
                    className={s.btn2}
                  >
                    구독관리
                  </a>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};
