import React, { useState } from 'react';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import { subscriptionMonthType } from '../../../store/TYPE/subscriptionMonthType';
import { OrdersheetReward } from '/src/components/order/OrdersheetReward';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import ToolTip from '/src/components/atoms/Tooltip';

export default function OrdersheetPaymentList({
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
      {/* 3. 할인 금액 */}
      <section className={s.discount}>
        {/* 1) 쿠폰 */}
        <div className={s.coupon_list}>
          <div>쿠폰</div>
          <div>
            <b>쿠폰 적용 &gt; </b>
          </div>
        </div>

        {/* 2) 적립금 */}
        {/* <div className={s.reward_list}>
          <div>적립금</div>
          <div>보유: {transformLocalCurrency(info.reward)}원 &gt; </div>
        </div> */}
        <OrdersheetReward
          orderType={'subscribe'}
          id={'discountReward'}
          info={info}
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />

        {/* 1) 할인 내역 */}
        <div className={s.benefit_discount_list}>
          {/* (1) 한 팩 가격 */}
          <div className={s.subscribe_discount}>
            <h4>
              {isActive === 12
                ? '20% 할인 혜택'
                : form.subscriptionMonth === 6
                ? '15% 할인 혜택'
                : form.subscriptionMonth === 3
                ? '5% 할인 할인 혜택'
                : form.subscriptionMonth === null
                ? '정기구독'
                : ''}
            </h4>
            <div className={s.per_pack_price}>
              <div>
                <span className={s.per_pack_discount_price}>00,000원</span> /
                1팩
              </div>
              <div className={s.per_pack_origin_price}>00,000원 / 1팩</div>
            </div>
          </div>

          {/* (2) 구독혜택 */}
          <div className={s.benefit_info_list}>
            {subscriptionMonthItems.map(
              (item, i) =>
                form.subscriptionMonth === item.value && (
                  <div key={i} className={s.benefit_wrapper}>
                    {/* 진단기기 */}
                    <div className={s.benefit_info}>
                      <div className={s.benefit_title}>
                        {item.bodyDescHTML.row2}{' '}
                        <ToolTip
                          message={`반려견의 장내 환경을 들여다 볼 수 있는 바프독 장내 미생물 진단키트를 무료로 제공해드립니다! (진단 시 보고서 기본 제공)`}
                          messagePosition={'left'}
                          wordBreaking={true}
                        />
                      </div>
                      {item.bodyDescHTML.row7}
                    </div>
                    {/* 토퍼 */}
                    <div className={s.benefit_info}>
                      <div className={s.benefit_title}>
                        {item.bodyDescHTML.row3}
                        <ToolTip
                          message={`식사 위에 토핑으로 올릴 수 있는 건강한 토퍼 제품을 무료로 제공해드립니다! (바프레드, 바프화이트, 터메릭슈퍼큐브, 치킨스프, 머쉬룸스프 중 랜덤 증정)`}
                          messagePosition={'left'}
                          wordBreaking={true}
                        />
                      </div>
                      {item.bodyDescHTML.row8}
                    </div>
                    {/* 무료배송 */}
                    <div className={s.benefit_info}>
                      <div className={s.benefit_title}>
                        {item.bodyDescHTML.row5}
                      </div>
                      {item.bodyDescHTML.row9}
                    </div>
                    {/* 건너뛰기 */}
                    {item.bodyDescHTML.row10}
                  </div>
                ),
            )}
          </div>
        </div>

        {/* 2) 총 할인금액 */}
        <div className={s.total_discount_list}>
          <h2>총 할인금액</h2>
          <p>-{transformLocalCurrency(discountPrice)}원</p>
        </div>
      </section>

      <section className={s.total_price}>
        <div className={s.total_price_wrapper}>
          <div className={s.total_price_text}>
            <h2>총 결제금액</h2>
            <div>
              {transformLocalCurrency(info.subscribeDto?.nextPaymentPrice)}원
            </div>
          </div>
          <div className={s.monthly_price}>
            일{' '}
            {form.subscriptionMonth
              ? transformLocalCurrency(
                  Math.round(
                    info.subscribeDto?.nextPaymentPrice /
                      form.subscriptionMonth /
                      30,
                  ),
                )
              : transformLocalCurrency(
                  info.subscribeDto?.nextPaymentPrice / 30,
                )}
            원 / 월{' '}
            {form.subscriptionMonth
              ? transformLocalCurrency(
                  Math.round(
                    info.subscribeDto?.nextPaymentPrice /
                      form.subscriptionMonth,
                  ),
                )
              : transformLocalCurrency(info.subscribeDto?.nextPaymentPrice)}
            원
          </div>
        </div>
        {/* 상세내역 */}
        <div className={s.detail_price_wrapper}>
          <div className={s.detail_price_text}>
            <div>상품금액</div>
            <div>
              {transformLocalCurrency(info.subscribeDto?.originPrice)}원
            </div>
          </div>
          <div className={s.detail_price_text}>
            <div>배송비</div>
            {/* 구독의 경우에는 모두 무료배송 */}
            <div>무료배송</div>
          </div>
          <div className={s.detail_price_text}>
            <div>할인 금액</div>
            <span>
              -
              {transformLocalCurrency(
                info.subscribeDto?.originPrice -
                  info.subscribeDto?.nextPaymentPrice,
              )}
              원
            </span>
          </div>
        </div>
        {/* <OrdersheetAmountOfPayment
                orderType={'subscribe'}
                info={info}
                form={form}
                setForm={setForm}
                event={{ onActiveModal: onActivleModalHandler }}
                formErrors={formErrors}
              /> */}
      </section>
    </>
  );
}
