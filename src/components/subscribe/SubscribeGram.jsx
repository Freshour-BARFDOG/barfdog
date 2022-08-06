import s from '../../pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import React from 'react';

export const SubscribeGram = () => {
  return (
    <>
      <div className={s.content_inner_box}>
        <div className={s.flex_box}>
          <div className={s.content_left_box}>
            <div className={s.btn}>A유형</div>
          </div>
          <div className={s.content_right_box}>
            <div className={s.flex_box}>
              <div className={s.text1}>반려견이 성견이에요</div>
              <div className={s.text2}>반려견이 성견인데 몸무게 변화가 있으신가요?</div>
            </div>
            <div className={s.text3}>
              아래 무게 변경 수정 설정 후 저장 버튼 눌러 주세요. 제조 전 등록해주셔야 변경사항이
              적용 됩니다.
            </div>
            
            <div className={s.grid_box}>
              <div className={s.grid_1}>
                <p className={s.top_text}>기존 그람(g)</p>
                <div className={s.bot_1}>120g</div>
              </div>
              <div className={s.grid_2}>
                <p className={s.top_text}>변경할 그람(g)</p>
                <div className={s.bot_2}>
                  +5%
                  <div className={`${s.image2} img-wrap`}>
                    <Image
                      priority
                      src={require( 'public/img/mypage/subscribe/dogldx/subscribe_ldx_red_arrow.png' )}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>
              </div>
              <div className={s.grid_3}>
                <p className={s.top_text}>변경 적용 그람(g)</p>
                <div className={s.bot_1}>120g</div>
              </div>
              <div className={s.grid_4}>
                <p className={s.top_text}>변경 전 결제 금액(1팩당)</p>
                <div className={s.bot_1}>1,550원</div>
              </div>
              <div className={s.grid_5}>
                <p className={s.top_text}>변경 결제 금액(1팩당)</p>
                <div className={s.bot_1}>
                  1,790원<span>+240원</span>
                </div>
              </div>
              <div className={s.grid_6}>
                <p className={s.top_text}>플랜 적용 금액</p>
                <div className={s.bot_1}>
                  50,260원<span>풀플랜</span>
                </div>
              </div>
            </div>
            
            <div className={s.red_btn_box}>
              <div className={s.red_btn}>무게 변경 적용하기</div>
            </div>
          </div>
          {/* right_grid */}
        </div>
        
        <div className={`${s.flex_box} ${s.second}`}>
          <div className={s.content_left_box}>
            <div className={s.btn}>B유형</div>
          </div>
          <div className={s.content_right_box}>
            <div className={s.flex_box}>
              <div className={s.text1}>반려견이 성장 중이에요</div>
              {/* <div className={Styles.text2}>반려견이 성견인데 몸무게 변화가 있으신가요?</div> */}
            </div>
            <div className={s.text3}>맞춤 설문에서 반려견 체중을 수정해주세요</div>
            
            <div className={s.red_btn_box2}>
              <div className={s.red_btn2}>맞춤설문 재등록 바로가기</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};