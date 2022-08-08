import React from 'react';
import s from './modal_subscribeCoupon.module.scss';

export const Modal_subscribeCoupon = () => {
  return (
    <>
      <section className={s.subscribeCoupon}>
        <div className={s.page_box}>
          <div className={s.title}>사용가능한 쿠폰</div>
          
          <div className={s.grid_box}>
            <div className={s.row_flex}>
              <div>쿠폰명</div>
              <div>적용가능수량</div>
              <div>유효기간</div>
              <div>할인금액</div>
            </div>
            
            <div className={s.row_flex2}>
              <div>
                <label>
                  <input type="radio" namne="13" id="12"/>
                </label>
                <div>정기구독 10%할인</div>
              </div>
              <div>
                <span>·</span> 99개
              </div>
              <div>
                <span>~</span>2022.12.31
              </div>
              <div>
                9,400원 <span>할인</span>
              </div>
            </div>
            
            <div className={s.row_flex2}>
              <div>
                <label>
                  <input type="radio" name="13" id="12"/>
                </label>
                <div>정기구독 10%할인</div>
              </div>
              <div>
                <span>·</span> 1개
              </div>
              <div>
                <span>~</span>2022.12.31
              </div>
              <div>
                9,400원 <span>할인</span>
              </div>
            </div>
          </div>
          
          <div className={s.price}>
            <div className={s.price_flex_box}>
              <div className={s.col_1}>
                <p>상품금액</p>
                <div className={s.text_price}>94,000원</div>
              </div>
              
              <div className={s.line}>
                <hr/>
              </div>
              
              <div className={s.col_2}>
                <p>할인금액</p>
                <div className={s.text_price}>9,400원</div>
              </div>
              
              <div className={s.vertical_line}>
                <hr/>
              </div>
              
              <div className={s.col_3}>
                할인 후 금액
                <span>84,600원</span>
              </div>
            </div>
          </div>
          
          <div className={s.coupon_btn_box}>
            <div className={s.btn}>취소</div>
            <div className={s.red_btn}>쿠폰선택</div>
          </div>
        </div>
      </section>
    </>
  );
};