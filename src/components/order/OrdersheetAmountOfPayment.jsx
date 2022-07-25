import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import React from 'react';
import PureCheckbox from '../atoms/PureCheckbox';
import ErrorMessage from '../atoms/ErrorMessage';

export const OrdersheetAmountOfPayment = ({ info, form, setForm, event, formErrors }) => {
  // ! 계산기를 할려면, 장바구니를  통과해야한다.
  return (
    <>
      <section className={s.payment}>
        <div className={s.title}>결제금액</div>

        <div className={s.flex_box}>
          <div>주문금액</div>
          <div>101,000원</div> {/* ! 아래의 상품 금액 총합-할인금액*/}
        </div>

        <div className={s.flex_box2}>
          <div>상품 금액</div>
          <div>199,000원</div> {/* ! 상품리스트 전체에 대한 총합 : 원래 전체 가격*/}
        </div>

        <div className={s.flex_box3}>
          <div>상품 할인</div>
          <div>- 98,000원</div> {/* ! 상품 리스트 전체에 대한 : 할인 가격*/}
        </div>

        <hr />

        <div className={s.flex_box4}>
          <div>쿠폰할인금액</div>
          <div>0원</div>
        </div>

        <div className={s.flex_box5}>
          <div>적립금사용</div>
          <div>8,000원</div>
        </div>

        <div className={s.flex_box6}>
          <div>배송비</div>
          <div>5,000원</div>
        </div>

        <hr />

        <div className={s.last_flex_box}>
          <div>최종결제금액</div>
          <div>101,000원</div>
        </div>

        {/* - 브로슈어 받은 적 있는지 true/false */}
        {!info.brochure && (
          <PureCheckbox
            id={'brochure'}
            className={s.check_box}
            value={form.brochure}
            setValue={setForm}
          >
            첫 구매 바프독 설명이 포함된 브로슈어를 받겠습니다.
          </PureCheckbox>
        )}
        <PureCheckbox
          id={'agreePrivacy'}
          className={`${s.check_box} mb-0`}
          value={form.agreePrivacy}
          setValue={setForm}
        >
          개인 정보 수집 이용 동의
          <button
            type={'button'}
            className={`${s['termsOfService']}`}
            data-modal-type={'termsOfService'}
            onClick={event.onActiveModal}
          >
            내용보기
          </button>
          {formErrors.agreePrivacy && <ErrorMessage>{formErrors.agreePrivacy}</ErrorMessage>}
        </PureCheckbox>
      </section>
      <section className={s.line}>
        <hr />
      </section>
    </>
  );
};
