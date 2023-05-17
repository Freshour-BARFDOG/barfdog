import React from "react";
import s from "./promotion.module.scss";
import transformDate from "/util/func/transformDate";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import {discountUnitType} from "/store/TYPE/discountUnitType";
import {couponUseType} from "/store/TYPE/couponType";
import {promotionStatusType} from "../../../../store/TYPE/promotionStatusType";


export default function MyPagePromotionList({items}) {
  if (!items || !items.length) return;

  return <div>
    <ul className={s.coupon_content_grid_box}>
      {items.map((item, i) => (
        <ItemList
          key={`item-${item.id}-${i}`}
          item={item}
        />
      ))}
    </ul>
  </div>;
}

function ItemList({item}) {

  const promotion = item.promotionDto;
  const coupon = item.promotionCouponDto;


  const DATA = {
    id: promotion.promotionId,
    type: promotion.type,
    status: promotion.status,
    name: promotion.name,
    startDate: transformDate(promotion.startDate, "time", {seperator: "/"}),
    expiredDate: transformDate(promotion.expiredDate, "time", {seperator: "/"}),
    coupon: {
      id: coupon.couponId,
      code: coupon.code,
      name: coupon.name,
      couponTarget: couponUseType.KOR[coupon.couponTarget],
      discount: `${transformLocalCurrency(coupon.discountDegree)}${discountUnitType.KOR[coupon.discountType]}`,
      availableMinPrice: transformLocalCurrency(coupon.availableMinPrice),
      availableMaxDiscount: transformLocalCurrency(coupon.availableMaxDiscount),
      amount: transformLocalCurrency(coupon.amount),
      createdDate: transformDate(coupon.createdDate, "", {seperator: ". "}),
    }
  };

  return (
    <li className={`${s.promotion}`}>
      <div className={`${s.col} ${s.top}`}>
        <div className={`${s.spaceBetween} ${s.flex}`}>
          <span className={s.name}>{DATA.name}</span>
          <span className={s.progress}>프로모션 {promotionStatusType.KOR[DATA.status]}</span>
        </div>
        <span className={s.discount}>{DATA.coupon.discount}</span>
        <span className={s.availableMaxDiscount}>( 최대 {DATA.coupon.availableMaxDiscount}원 할인 )</span>
      </div>
      <div className={`${s.col} ${s.mid}`}>
        <span className={s.couponName}>{DATA.coupon.name}</span>
        <span className={s.couponTarget}>{DATA.coupon.couponTarget} 사용가능</span>
        <span className={s.couponAvailableMinPrice}>{DATA.coupon.availableMinPrice}원 이상 구매 시</span>
      </div>
      <div className={`${s.col} ${s.bottom}`}>
        <span className={`${s.left} ${s.couponCode}`}>
          <span className={s.progress}>프로모션 {promotionStatusType.KOR[DATA.status]}</span>
          <em className={s.code}>
            <div className={s.title}>
              <div>프로모션 코드</div>
              <div className={s.line}>
                <hr/>
              </div>
            </div>
            <b>{DATA.coupon.code}</b>
          </em>
        </span>

        <span className={`${s.right}`}>
          <em>사용한도
            <div className={s.line}>
              <hr/>
            </div>
            <b>{DATA.coupon.amount}회</b>
          </em>
          <em>등록일
            <div className={s.line}>
              <hr/>
            </div>
            <b>{DATA.coupon.createdDate}</b>
          </em>
        </span>


      </div>

    </li>
  );
}
