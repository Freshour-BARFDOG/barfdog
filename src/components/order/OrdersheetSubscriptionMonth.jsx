import React, { useCallback, useEffect, useState } from 'react';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import { subscriptionMonthType } from '../../../store/TYPE/subscriptionMonthType';
import { OrdersheetReward } from '/src/components/order/OrdersheetReward';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import ToolTip from '/src/components/atoms/Tooltip';
import { ItemRecommendlabel } from '/src/components/atoms/ItemLabel';
import { calcOrdersheetPrices } from './calcOrdersheetPrices';

export default function OrdersheetSubscriptionMonth({
  info,
  form,
  setForm,
  orderType,
  subscriptionMonthTypeKey,
}) {
  const [isActive, setIsActive] = useState(form.subscriptionMonth);

  const calcResult = useCallback(
    calcOrdersheetPrices(
      form,
      orderType,
      {
        deliveryFreeConditionPrice: info.freeCondition,
      },
      info,
    ),
    [form, orderType, form.subscriptionMonth],
  );

  const getDeliveryCount = (type) => {
    if (type?.VALUE === null) {
      return 1;
    } else if (
      info.subscribeDto?.plan === 'FULL' ||
      info.subscribeDto?.plan === 'TOPPING_FULL'
    ) {
      return type.fullDeliveryCount;
    } else if (
      info.subscribeDto?.plan === 'HALF' ||
      info.subscribeDto?.plan === 'TOPPING_HALF'
    ) {
      return type.halfDeliveryCount;
    } else return 1;
  };

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      subscriptionMonth: form.subscriptionMonth,
      //! [리뉴얼 수정] orderPrice(원가) = originPrice * 배송횟수 --> 플랜 할인율은 적용됨!
      orderPrice:
        info.subscribeDto?.originPrice *
          getDeliveryCount(subscriptionMonthType[subscriptionMonthTypeKey]) -
        Math.floor(
          info.subscribeDto?.originPrice *
            getDeliveryCount(subscriptionMonthType[subscriptionMonthTypeKey]) *
            (info.subscribeDto?.discountPlan / 100),
        ),
      //! [리뉴얼 수정] paymentPrice = nextPaymentPrice * 배송횟수
      paymentPrice:
        info.subscribeDto?.originPrice *
          getDeliveryCount(subscriptionMonthType[subscriptionMonthTypeKey]) -
        calcResult?.discountTotal -
        Math.floor(
          info.subscribeDto?.originPrice *
            getDeliveryCount(subscriptionMonthType[subscriptionMonthTypeKey]) *
            (info.subscribeDto?.discountPlan / 100),
        ),
    }));
  }, []);

  const subscriptionMonthItems = Object.keys(subscriptionMonthType).map(
    (key) => {
      const type = subscriptionMonthType[key];

      return {
        id: key,
        value: type.VALUE,
        label: type.VALUE === 6 && 'best',
        title: type.KOR,
        discount: type.discount,
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
            type.fullDeliveryCount &&
            (info.subscribeDto?.plan === 'FULL' ||
              info.subscribeDto?.plan === 'TOPPING_FULL')
              ? `(${type.fullDeliveryCount}회 배송)`
              : type.fullDeliveryCount &&
                (info.subscribeDto?.plan === 'HALF' ||
                  info.subscribeDto?.plan === 'TOPPING_HALF')
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

    const deliveryCount = getDeliveryCount(subscriptionMonthType[item.id]);

    if (deliveryCount) {
      setForm((prevForm) => ({
        ...prevForm,
        subscriptionMonth: item.value,
        //! [리뉴얼 수정] orderPrice(원가) = originPrice * 배송횟수 --> 플랜 할인율은 적용됨!
        orderPrice:
          info.subscribeDto?.originPrice * deliveryCount -
          Math.floor(
            info.subscribeDto.originPrice *
              deliveryCount *
              (info.subscribeDto.discountPlan / 100),
          ),
      }));
    }
  };

  // subscriptionMonth가 변경된 후 calcResult를 반영하여 paymentPrice(최종 결제금액)를 업데이트
  useEffect(() => {
    if (calcResult && form.subscriptionMonth !== undefined) {
      const deliveryCount = getDeliveryCount(
        subscriptionMonthType[subscriptionMonthTypeKey],
      );

      setForm((prevForm) => ({
        ...prevForm,
        //! [리뉴얼 수정] paymentPrice(최종결제금액) = originPrice * 배송횟수 - 할인금액 - 플랜할인금액(1개원가*배송횟수*플랜할인율)
        paymentPrice:
          info.subscribeDto?.originPrice * deliveryCount -
          calcResult?.discountTotal -
          Math.floor(
            info.subscribeDto.originPrice *
              deliveryCount *
              (info.subscribeDto.discountPlan / 100),
          ),
      }));
    }
  }, [form.subscriptionMonth]);

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
              {item.label && (
                <ItemRecommendlabel
                  label="추천!"
                  style={{
                    backgroundColor: '#be1a21',
                  }}
                  packageLabel={true}
                />
              )}
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
