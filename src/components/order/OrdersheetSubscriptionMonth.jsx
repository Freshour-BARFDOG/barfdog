import React, { useState } from 'react';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import { subscriptionMonthType } from '../../../store/TYPE/subscriptionMonthType';
import { OrdersheetReward } from '/src/components/order/OrdersheetReward';

export default function OrdersheetSubscriptionMonth({
  info,
  form,
  setForm,
  formErrors,
  setFormErrors,
}) {
  const [isActive, setIsActive] = useState(form.subscriptionMonth);

  console.log(isActive);

  const subscriptionMonthItems = Object.keys(subscriptionMonthType).map(
    (key) => {
      const type = subscriptionMonthType[key];

      return {
        id: key,
        value: type.VALUE,
        label: type.KOR === '6개월' && 'best',
        title: type.KOR,
        bodyDescHTML: {
          row1: type.discount && (
            <p>
              <span>{type.discount}%</span> 할인
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
              <h4>{item.title} 구독</h4>
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

      {/* 3. 할인 금액 */}
      <section className={s.discount}>
        {/* 1) 할인 내역 */}
        <div className={s.benefit_discount_list}>
          {/* (1) 배송비 */}
          <div className={s.delivery_discount}>
            <h4>
              {isActive === 12
                ? '배송마다 20% 할인'
                : form.subscriptionMonth === 6
                ? '배송마다 15% 할인'
                : form.subscriptionMonth === 3
                ? '배송마다 5% 할인'
                : form.subscriptionMonth === null
                ? '정기구독'
                : ''}
            </h4>
            <div>
              <p>00,000원 빨강</p>
              <p>00,000원 회색</p>
            </div>
          </div>

          {/* (2) 구독혜택 */}
          <div className={s.benefit_info_list}>
            {subscriptionMonthItems.map(
              (item, i) =>
                form.subscriptionMonth === item.value && (
                  <div key={i} className={s.benefit_info}>
                    {item.bodyDescHTML.row1}
                    {item.bodyDescHTML.row2}
                    {item.bodyDescHTML.row3}
                    {item.bodyDescHTML.row4}
                    {item.bodyDescHTML.row5}
                  </div>
                ),
            )}
            <div>
              <p>00,Btn_0100원 빨강</p>
              <p>00,000원 회색</p>
            </div>
          </div>
        </div>

        {/* 2) 총 할인금액 */}
        <div className={s.total_discount_list}>
          <div>총 할인금액</div>
          <div>-00,000원</div>
        </div>

        {/* 3) 쿠폰 */}
        <div className={s.coupon_list}>
          <div>쿠폰</div>
          <div>쿠폰 적용 </div>
        </div>

        {/* 4) 적립금 */}
        <div className={s.reward_list}>
          <div>적립금</div>
          <div>보유: 0원 </div>
          <OrdersheetReward
            orderType={'subscribe'}
            id={'discountReward'}
            info={info}
            form={form}
            setForm={setForm}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
        </div>
      </section>
    </>
  );
}
