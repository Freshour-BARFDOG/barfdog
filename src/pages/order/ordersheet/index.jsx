import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './ordersheet.module.scss';
import Image from 'next/image';
import Modal_termsOfSerivce from '/src/components/modal/Modal_termsOfSerivce';
import { Modal_coupon } from '/src/components/modal/Modal_coupon';

// 결제 타입
// 1. 정기구독
// 2. 일반

// ! 확인할 사항: 유저의 첫구매 여부 ( 첫구매 아닐 시, 첫구매 브로슈어 수령 checkbox란 ===>  hide 처리)

// 정기구독일 경우 나타나야하는 Component;
// 일반결제일 경우 나타나는 Component;
const global_productType = {
  SUBSCRIBE: 'SUBSCRIBE',
  GENERAL: 'GENERAL',
};

export default function OrderSheetPage() {
  const [productType, setProductType] = useState(global_productType.SUBSCRIBE);
  const [formValues, setFormValues] = useState({});
  const [activeModal, setActiveModal] = useState({
    termsOfService: false,
    coupon: false,
  });
  
  
  

  const TEST_change_productType = () => {
    setProductType((prevState) =>
      prevState === global_productType.SUBSCRIBE
        ? global_productType.GENERAL
        : global_productType.SUBSCRIBE,
    );
  };

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
        <div className={'mt-40 mb-20 ml-20'} style={{fontSize:'12px', color:'#555'}}>
          <button
            type={'button'}
            onClick={TEST_change_productType}
            className={'admin_btn line basic_l mb-10'}
          >
            주문서 유형 변경하기 버튼
          </button>
          <p className={'ml-20'}>현재주문서 유형: {productType}{productType === 'SUBSCRIBE'&& <span> (묶음 배송여부 체크박스 나타남)</span>}</p>
        </div>
        <div className={s.container_outer}>
          <div className={s.Wrapper}>
            <section className={s.title_box}>
              <div className={s.title}>주문서</div>
            </section>

            <section className={s.content_box}>
              <div className={s.title}>주문내역</div>
              <div className={s.flex_title_box}>
                <div>상품정보</div>
                <div>수량</div>
                <div>총 주문금액</div>
                <div>쿠폰할인</div>
                <div>쿠폰적용</div>
              </div>
              <div className={s.flex_box}>
                <div className={s.info_col}>
                  스타터프리미엄
                  <div className={s.info_inner}>옵션 : 옵션1 1개</div>
                  <div className={s.info_inner}>옵션 : 옵션2 2개</div>
                </div>

                <div className={s.count_col}>3개</div>

                <div className={s.title_col}>총 주문금액</div>
                <div className={s.price_col}>
                  <div className={s.price_inner}>98,000원</div>
                  <span>108,000원</span>
                </div>

                <div className={s.title_col}>배송비</div>
                <div className={s.del_col}>0원</div>
                <div className={s.coupon_col_red}>-9800원</div>

                <div className={s.title_col}>쿠폰할인</div>
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

            <section className={s.orderer_info}>
              <div className={s.title}>주문자 정보</div>
              <div className={s.grid_box}>
                <div>보내는 분</div>
                <div>김바프</div>
                <div>이메일</div>
                <div>freshour@naver.com</div>
                <div>연락처</div>
                <div>01012344911</div>
              </div>
            </section>

            <section className={s.line}>
              <hr />
            </section>

            <section className={s.reciever}>
              <div className={s.title}>받는 사람 정보</div>

              <div className={s.check_box}>
                <div className={s.auto__login__check}>
                  <label htmlFor="agree" className={s.chk__box}>
                    <input type="checkbox" id="agree" />
                    <span className={s.on} />
                    <div className={s.text}>주문자 정보와 같습니다.</div>
                  </label>
                </div>
              </div>

              <div className={s.grid_box}>
                <div>받는 분</div>
                <div className={s.input_col}>
                  <input className={s.input_box} placeholder="홍길동"></input>
                </div>

                <div>연락처</div>
                <div className={s.input_col}>
                  <input className={s.input_box} placeholder=""></input>
                </div>

                <div>주소</div>

                <div className={s.adress_box}>
                  <input className={s.input_box} placeholder="우편번호"></input>
                  <div className={s.btn_box}>주소검색</div>
                </div>

                <div></div>
                <div className={s.input_col}>
                  <input className={s.input_box} placeholder="주소"></input>
                </div>

                <div></div>
                <div className={s.input_col}>
                  <input className={s.input_box} placeholder="상세주소"></input>
                </div>

                <div>배송 요청사항</div>
                <div className={s.input_col}>
                  <input className={s.input_box} placeholder=""></input>
                </div>
              </div>
            </section>

            <section className={s.line}>
              <hr />
            </section>

            <section className={s.shipping}>
              <div className={s.title}>배송 정보</div>
              <div className={s.box}>
                <div className={s.grid_box}>
                  <div className={s.left_box}>
                    <span>단품</span>
                    <p>바프레드</p>
                  </div>

                  <div />

                  <div className={s.mid_box}>
                    <span>배송방법</span>
                    <p>배송 예정 일시</p>
                  </div>

                  <div className={s.right_box}>
                    <span>단품주문</span>
                    <p>
                      <span>2022-02-12</span> (배송 후 카톡 안내)
                    </p>
                  </div>
                </div>
              </div>

              {productType === global_productType.SUBSCRIBE && (
                <div className={s.box2}>
                  <div className={s.flex_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require('/public/img/cart/order_redcircle.png')}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                    <div className={s.text}>
                      정기구독 배송시 묶음 배송 신청
                      <p>배송비가 추가 되지 않아요</p>
                    </div>
                  </div>

                  <div className={s.flex_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require('/public/img/cart/order_circle.png')}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                    <div className={s.text}>
                      단품 주문으로 별도 배송 요청
                      <p>배송비가 추가 됩니다</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className={s.line}>
              <hr />
            </section>

            <section className={s.reserves}>
              <div className={s.title}>적립금</div>

              <div className={s.flex_box}>
                <p>적립금사용</p>
                <div className={s.input_box}>
                  <input placeholder="8,000"></input>
                </div>
                <div className={s.btn_box}>모두 사용</div>
                <div className={s.point}>사용 가능 포인트 98,000 P</div>
              </div>
            </section>

            <section className={s.line}>
              <hr />
            </section>

            <section className={s.method}>
              <div className={s.title}>결제수단</div>

              <div className={s.grid_box}>
                <div className={s.inner_box} onClick={Payment}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require('/public/img/cart/order_card.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                  신용카드
                </div>
                <div className={s.inner_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require('/public/img/cart/order_naver.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                  네이버페이
                </div>
                <div className={s.inner_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require('/public/img/cart/order_kakao.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                  카카오페이
                </div>
              </div>
            </section>

            <section className={s.line}>
              <hr />
            </section>

            <section className={s.payment}>
              <div className={s.title}>결제금액</div>

              <div className={s.flex_box}>
                <div>주문금액</div>
                <div>101,000원</div>
              </div>

              <div className={s.flex_box2}>
                <div>상품 금액</div>
                <div>199,000원</div>
              </div>

              <div className={s.flex_box3}>
                <div>상품 할인</div>
                <div>- 98,000원</div>
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

              <div className={s.check_box}>
                <label htmlFor="first_purchase" className={s.chk__box}>
                  <input type="checkbox" id="first_purchase" />
                  <span className={s.on} />
                  <p className={s.text}>첫 구매 바프독 설명이 포함된 브로슈어를 받겠습니다.</p>
                </label>
              </div>

              <div className={s.check_box}>
                <label htmlFor="personal_info" className={s.chk__box}>
                  <input type="checkbox" id="personal_info" />
                  <span className={s.on} />
                  <p className={s.text}>개인 정보 수집 이용 동의</p>
                </label>
                <button
                  type={'button'}
                  className={`${s['termsOfService']}`}
                  data-modal-type={'termsOfService'}
                  onClick={onActivleModalHandler}
                >
                  내용보기
                </button>
              </div>
            </section>
            <section className={s.line}>
              <hr />
            </section>

            <section className={s.final_btn}>
              <p>위 주문 내용을 확인 하였으며, 회원 본인은 결제에 동의합니다.</p>
              {/* 결제버튼 */}
              <Payment />
            </section>
          </div>
        </div>
      </Layout>
      {activeModal.termsOfService && (
        <Modal_termsOfSerivce
          modalState={activeModal.termsOfService}
          setModalState={setActiveModal}
        />
      )}
      {activeModal.coupon && (
        <Modal_coupon
          onModalActive={() => {
            setActiveModal((prevState) => ({
              ...prevState,
              coupon: false,
            }));
          }}
        />
      )}
    </>
  );
}

function Payment() {
  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';

    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';

    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  function onClickPayment() {
    /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'kcp', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: 1, // 결제금액
      name: '바프독 아임포트 결제 테스트', // 주문명
      buyer_name: 'username', // 구매자 이름
      buyer_tel: '01000000000', // 구매자 전화번호
      buyer_email: 'a@gmail', // 구매자 이메일
      buyer_addr: '센텀2로', // 구매자 주소
      buyer_postcode: '00000', // 구매자 우편번호
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
  }

  /* 3. 콜백 함수 정의하기 */
  function callback(response) {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
      // TODO: 결제 정보 전달
      alert('결제 성공');
    } else {
      alert(`결제 실패: ${error_msg}`);
      window.location.reload(); // 임시로 넣은 코드 :  결제취소시 , 전역에 import 결제 html이 잔류하여, 없애기위한 용도
    }
  }

  return (
    <button onClick={onClickPayment} className={s.btn_box}>
      결제하기
    </button>
  );
}
