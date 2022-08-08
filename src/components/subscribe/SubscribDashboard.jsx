import s from '../../pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import React from 'react';

export const SubscribDashboard = () => {
  return (
    <>
      <section className={s.title}>
        <div className={s.title_text}>시호의 구독정보</div>
        
        <div className={s.flex_box}>
          <div className={s.text}>
            <span>구독변경 마감</span>
            <br/>
            2일 16:54:12 이후 구독정보 변경 불가
          </div>
          
          <div className={s.btn_box}>
            <div className={s.btn}>목록보기</div>
          </div>
        </div>
      </section>
      <section className={s.content_box}>
        <div className={s.top_flex_box}>
          <div className={s.top_left_box}>
            <div className={`${s.top_flex_box2} ${s.first}`}>
              <div className={s.left}>플랜</div>
              <div className={s.right}>풀플랜</div>
            </div>
            
            <div className={`${s.top_flex_box2} ${s.second}`}>
              <div className={s.left}>레시피</div>
              <div className={s.right}>
                스타터프리미엄
                <br/>
                덕&amp;램
              </div>
            </div>
            
            <div className={`${s.top_flex_box2} ${s.third}`}>
              <div className={s.left}>급여량</div>
              <div className={s.right}>272g</div>
            </div>
          </div>
          
          <div className={s.right_box}>
            <div className={s.flex_box3}>
              <div className={s.inner_left_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require( 'public/img/mypage/subscribe/dogldx/subscribe_ldx_calendar.png' )}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.row_1}>다음 결제일</div>
                <div className={s.row_2}>2022/03/14</div>
                <div className={s.row_3}>1회 건너뛰기 중</div>
              </div>
              
              <div className={s.inner_mid_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require( 'public/img/mypage/subscribe/dogldx/subscribe_ldx_pay.png' )}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.row_1}>결제 예정 금액</div>
                <div className={s.row_2}>94,000원</div>
                <div className={s.row_3}>쿠폰적용</div>
              </div>
              <div className={s.inner_right_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require( 'public/img/mypage/subscribe/dogldx/subscribe_ldx_delivery.png' )}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.row_1}>발송 예정일</div>
                <div className={s.row_2}>2022/03/16</div>
                <div className={s.row_3}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};