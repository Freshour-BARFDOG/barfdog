import s from '../../pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import React from 'react';

export const SubscribeSkipPayment = () => {
  return (
    <>
      <div className={s.content_inner_box4}>
        <div className={s.text}>
          이번 구독만 잠시 쉬고 싶으신가요? <br/>
          건너뛰기 주기를 선택해주세요
        </div>
        
        <div className={s.radio_box}>
          <label>
            <input type="radio" name="slide4_radio1" id=""/>
            1회 건너뛰기
          </label>
          
          <label>
            <input type="radio" name="slide4_radio1" id=""/>
            1주일 건너뛰기
          </label>
        </div>
        
        <p className={s.d_day_text}>
          기존 발송 예정일은<span>3월 14일</span>입니다
        </p>
        <p className={s.d_day_text2}>
          변경 발송 예정일은<span className={s.red_span}>4월 14일</span>입니다
        </p>
        
        <div className={s.picture_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/mypage/subscribe/dogldx/subscribe_ldx_slide4.png' )}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
        </div>
        
        <div className={s.btn_box}>
          <div className={s.btn}>건너뛰기 적용하기</div>
        </div>
      </div>
    </>
  );
};