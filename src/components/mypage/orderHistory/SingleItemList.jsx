import s from '/src/pages/mypage/orderHistory/orderHistory.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import {orderStatus} from "/store/TYPE/orderStatusTYPE";




export const SingleItemList = ({ itemList }) => {
  console.log(itemList);
  // ! 주문상세보기 링크????
  return (
    <ul className={s['generalItem-container']}>
      {itemList?.length > 0 &&
        itemList.map((item, index) => (
          <li key={`general-item-${index}`}>
            <div className={s.day}>{item.orderDto.orderDate && transformDate(item.orderDto.orderDate)}</div>
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
