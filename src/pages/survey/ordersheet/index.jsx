import React, {useState} from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import Styles from "src/pages/survey/ordersheet/index.module.scss"
import Image from 'next/image';
import {Payment} from "../../api/payment";
import s from "../../cart/ordersheet.module.scss";

export default function SurveyOrderSheetPage() {
  
  const [activeModal, setActiveModal] = useState({
    termsOfService: false,
    coupon: false,
  });
  const [formValues, setFormValues] = useState({});
  
  const onActivleModalHandler = (e) => {
    const button = e.currentTarget;
    const modalType = button.dataset.modalType;
    
    setActiveModal((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };
  
  
  return (
    <>
      <MetaTitle title="주문서" />
      <Layout>
        <Wrapper>

          <section className={Styles.title_box}>
            <div className={Styles.title}>주문서</div>
          </section>

          <section className={Styles.content_box}>
            <div className={Styles.title}>
              주문내역
            </div>
            <div className={Styles.flex_title_box}>
              <div>상품정보</div>
              <div>수량</div>
              <div>총 주문금액</div>
              <div>쿠폰할인</div>
              <div>쿠폰적용</div>
            </div>
            <div className={Styles.flex_box}>
              <div className={Styles.info_col}>
                스타터프리미엄
                <div className={Styles.info_inner}>
                  옵션 : 옵션1 1개
                </div>
                <div className={Styles.info_inner}>
                  옵션 : 옵션2 2개
                </div>
              </div>
              <div className={Styles.count_col}>3개</div>

              <div className={Styles.price_col}>
                <div className={Styles.price_inner}>
                  98,000원
                </div>
                108,000원
              </div>

              <div className={Styles.coupon_col}>0원</div>
  
              <div className={s.apply_coupon_col}>
                <button
                  type={'button'}
                  className={`${s['btn']}`}
                  data-modal-type={'coupon'}
                  onClick={onActivleModalHandler}
                >
                  쿠폰 선택
                </button>
              </div>
            </div>
            
          </section>

          <section className={Styles.orderer_info}>
            <div className={Styles.title}>주문자 정보</div>
            <div className={Styles.grid_box}>
              <div>보내는 분</div>
              <div>김바프</div>
              <div>이메일</div>
              <div>freshour@naver.com</div>
              <div>연락처</div>
              <div>01012344911</div>
            </div>
          </section>

          <section className={Styles.line}>
            <hr />
          </section>

          <section className={Styles.reciever}>
            <div className={Styles.title}>
              받는 사람 정보
            </div>

            <div className={Styles.check_box}>
              <div className={Styles.auto__login__check}>
                <label htmlFor="agree" className={Styles.chk__box}>
                  <input type="checkbox" id="agree" />
                  <span className={Styles.on} />
                  <div className={Styles.text}>
                    주문자 정보와 같습니다.
                  </div>
                </label>
              </div>
            </div>

            <div className={Styles.grid_box}>
              <div>받는 분</div>
              <div className={Styles.input_col}>
                <input className={Styles.input_box} placeholder='홍길동'></input>
              </div>
              <div></div>

              <div>받는 분</div>
              <div className={Styles.input_col}>
                <input className={Styles.input_box} placeholder=''></input>
              </div>
              <div></div>

              <div>주소</div>
              <div className={Styles.input_col}>
                <input className={Styles.input_box} placeholder='placeholder'></input>
              </div>
              <div>
                <div className={Styles.btn_box}>
                  주소검색
                </div>
              </div>

              <div></div>
              <div className={Styles.input_col}>
                <input className={Styles.input_box} placeholder='상세주소'></input>
              </div>
              <div></div>

              <div>배송 요청사항</div>
              <div className={Styles.input_col}>
                <input className={Styles.input_box} placeholder=''></input>
              </div>
              <div></div>
            </div>
          </section>

          <section className={Styles.line}>
            <hr />
          </section>

          <section className={Styles.shipping}>
            <div className={Styles.title}>
              배송 정보
            </div>
            <div className={Styles.box}>
              <div className={Styles.grid_box}>
                <div className={Styles.left_box}>
                  <span>단품</span>
                  <p>바프레드</p>
                  
                </div>

                <div />

                <div className={Styles.mid_box}>
                  <span>배송방법</span>
                  <p>배송 예정 일시</p>
                </div>

                <div className={Styles.right_box}>
                  <span>단품주문</span>
                  <p><span>2022-02-12</span> (배송 후 카톡 안내)</p>
                </div>
              </div>
            </div>

          
          </section>

          <section className={Styles.line}>
            <hr />
          </section>

          <section className={Styles.reserves}>
            <div className={Styles.title}>
              적립금 
            </div>

            <div className={Styles.flex_box}>
              <p>
                적립금사용
              </p>
              <div className={Styles.input_box}>
                <input placeholder='8,000'></input>
              </div>
              <div className={Styles.btn_box}>
                모두 사용
              </div>
              <div className={Styles.point}>
                사용 가능 포인트  98,000 P
              </div>
            </div>
          </section>

          <section className={Styles.line}>
            <hr />
          </section>


          <section className={Styles.method}>
            <div className={Styles.title}>
              결제수단
            </div>

            <div className={Styles.grid_box}>
              <div className={Styles.inner_box}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("/public/img/cart/order_card.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                신용카드
              </div>
              <div className={Styles.inner_box}>
              <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("/public/img/cart/order_naver.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                네이버페이
              </div>
              <div className={Styles.inner_box}>
              <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("/public/img/cart/order_kakao.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                카카오페이
              </div>

            </div>
          </section>



          <section className={Styles.line}>
            <hr />
          </section>



          <section className={Styles.payment}>
            <div className={Styles.title}>
              결제금액
            </div>

            <div className={Styles.flex_box}>
              <div>
                주문금액
              </div>
              <div>
                101,000원
              </div>
            </div>

            <div className={Styles.flex_box2}>
              <div>
                상품 금액
              </div>
              <div>
                199,000원
              </div>
            </div>

            <div className={Styles.flex_box3}>
              <div>
                상품 할인
              </div>
              <div>
                - 98,000원
              </div>
            </div>

            <hr />

            <div className={Styles.flex_box4}>
              <div>
                쿠폰할인금액
              </div>
              <div>
                0원
              </div>
            </div>

            <div className={Styles.flex_box5}>
              <div>
                적립금사용
              </div>
              <div>
                8,000원
              </div>
            </div>

            <div className={Styles.flex_box6}>
              <div>
                배송비
              </div>
              <div>
                5,000원
              </div>
            </div>

            <hr />

            <div className={Styles.last_flex_box}>
              <div>
                최종결제금액
              </div>
              <div>
                101,000원
              </div>
            </div>

            <div className={Styles.check_box}>
              <div className={Styles.auto__login__check}>
                <label htmlFor="first_purchase" className={Styles.chk__box}>
                  <input type="checkbox" id="first_purchase" />
                  <span className={Styles.on} />
                  <div className={Styles.text}>
                    첫 구매 바프독 설명이 포함된 브로슈어를 받겠습니다.                     </div>
                </label>
              </div>
            </div>

            <div className={Styles.check_box}>
              <div className={Styles.auto__login__check}>
                <label htmlFor="personal_info" className={Styles.chk__box}>
                  <input type="checkbox" id="personal_info" />
                  <span className={Styles.on} />
                  <div className={Styles.text}>
                    개인 정보 수집 이용 동의 <span>내용보기</span>
                  </div>
                </label>
              </div>
            </div>
            
          </section>
          
          <section className={Styles.line}>
            <hr />
          </section>



          <section className={Styles.final_btn}>
            <p>위 주문 내용을 확인 하였으며, 회원 본인은 결제에 동의합니다.</p>
            <Payment />
          </section>
         
        
        </Wrapper>
    
      </Layout>
    </>
  );
}


