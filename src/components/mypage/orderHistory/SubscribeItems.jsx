import s from '/src/pages/mypage/orderHistory/orderHistory.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';



export const SubscribeItems = ({ itemList }) => {
  // console.log(itemList);
  
  return (
    <>
      <ul className={`${s['subscribeItem-container']}`}>
        {/* Styles["subscribeItem-container" 는 여러개X Styles.day부터 개체 복사 */}
        {itemList?.length > 0 &&
          itemList.map((item, index) => (
            <li key={`subscribe-item-${index}`}>
              <div className={s.day}>{transformDate(item.subscribeOrderDto.orderDate)}</div>
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
                  <Link
                    href={`/mypage/orderHistory/subscribe/${item.subscribeOrderDto.orderId}`}
                    passHref
                  >
                    <a className={s.btn}>주문상세 </a>
                  </Link>
                  {/*<a href={`/mypage/subscribe/2924`} className={s.btn2}>구독관리</a>*/}
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
