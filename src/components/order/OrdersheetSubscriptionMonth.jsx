import React, { useState } from 'react';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import { subscriptionMonthType } from '../../../store/TYPE/subscriptionMonthType';
import { OrdersheetReward } from '/src/components/order/OrdersheetReward';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import ToolTip from '/src/components/atoms/Tooltip';

export default function OrdersheetSubscriptionMonth({
  info,
  form,
  setForm,
  formErrors,
  setFormErrors,
}) {
  const [isActive, setIsActive] = useState(form.subscriptionMonth);
  const [discountPrice, setDiscountPrice] = useState(0);

  console.log(isActive);

  const getDeliveryCount = (type) => {
    if (info.subscribeDto.plan === 'FULL') {
      return type.fullDeliveryCount || 0;
    } else if (info.subscribeDto.plan === 'HALF') {
      return type.halfDeliveryCount || 0;
    }
    return 0;
  };

  const subscriptionMonthItems = Object.keys(subscriptionMonthType).map(
    (key) => {
      const type = subscriptionMonthType[key];
      const deliveryCount = getDeliveryCount(type); // 배송횟수

      return {
        id: key,
        value: type.VALUE,
        label: type.KOR === '6개월' && 'best',
        title: type.KOR,
        bodyDescHTML: {
          row1: type.discount && (
            <p>
              <span className={s.text_highlight}>{type.discount}%</span> 할인
            </p>
          ),
          row2: type.freeKit && (
            <p>
              진단 기기 <span>{type.freeKit}회</span> 무료
            </p>
          ),
          row3: type.freeTopper && (
            <p>
              토퍼 랜덤 <span>{type.freeTopper}회</span> 무료
            </p>
          ),
          row4: type.freeSkip && <p>건너 뛰기 무제한</p>,
          row5: type.freeDelivery && <p>무료 배송</p>,
          row6:
            type.fullDeliveryCount && info.subscribeDto.plan === 'FULL'
              ? `(${type.fullDeliveryCount}회 배송)`
              : type.fullDeliveryCount && info.subscribeDto.plan === 'HALF'
              ? `(${type.halfDeliveryCount}회 배송)`
              : '', // 배송횟수
          row7: type.freeKit && ( // 진단기기 가격 (하나당 98,000원)
            <div className={s.price_info}>
              <span>
                {/* {transformLocalCurrency(98000)} * {type.freeKit}회 ={' '} */}
                {transformLocalCurrency(98000 * type.freeKit)}원
              </span>
              <p className={s.origin_price}>0원</p>
            </div>
          ),
          row8: type.freeTopper && ( // 토퍼 가격 (하나당 16,000원)
            <div className={s.price_info}>
              <span>{transformLocalCurrency(16000 * type.freeTopper)}원</span>
              <p className={s.origin_price}>0원</p>
            </div>
          ),
          row9: type.freeDelivery && ( // 배송 가격
            <div className={s.price_info}>
              <span>
                {transformLocalCurrency(50000 * getDeliveryCount(type))}원
              </span>
              <p className={s.origin_price}>0원</p>
            </div>
          ),
          row10: type.freeSkip && (
            <div className={s.benefit_info}>
              <div className={s.benefit_title}>
                <p>구독 건너 뛰기</p>
              </div>
              <div className={s.price_info}>
                <p className={s.origin_price}>무제한</p>
              </div>
            </div>
          ),
        },
      };
    },
  );

  const monthSelectHandler = (item) => {
    setIsActive(item.value);

    setForm((prevForm) => ({
      ...prevForm,
      subscriptionMonth: item.value,
    }));
  };

  return (
    <>
      <section className={s.subscribe_month}>
        <h2>구독혜택 선택</h2>

        <div className={s.month_list_wrapper}>
          {subscriptionMonthItems.map((item, i) => (
            <div
              className={`${s.month_box} ${
                isActive === item.value ? s.active : ''
              }`}
              key={i}
              onClick={() => monthSelectHandler(item)}
            >
              <h4>{item.title}</h4>
              <p>{item.bodyDescHTML.row6}</p>
              <div className={s.divider}></div>
              <div className={s.text_list}>
                {item.bodyDescHTML.row1}
                {item.bodyDescHTML.row2}
                {item.bodyDescHTML.row3}
                {item.bodyDescHTML.row4}
                {item.bodyDescHTML.row5}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
