import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from 'src/pages/mypage/orderHistory/ordersheet.module.scss';
import Image from 'next/image';

function SingleItem_OrderHistoryPage() {
  return (
    <>
      <MetaTitle title="마이페이지 주문내역: 일반상품" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={Styles.title}>주문상세정보</section>

            <section className={Styles.body}>
              <div className={Styles.flex_box}>
                <div className={Styles.body_title}>주문상품</div>
                <div className={Styles.btn}>주문취소</div>
              </div>

              <hr />

              <section className={Styles.body_content_4}>
                <div className={Styles.grid_box2}>
                  <div className={Styles.col_1}>상품 정보</div>
                  <div className={Styles.col_2}>수량</div>
                  <div className={Styles.col_3}>총 주문금액</div>
                  <div className={Styles.col_4}>쿠폰할인</div>
                  <div className={Styles.col_5}>주문상태</div>
                </div>

                <hr />

                <div className={Styles.grid_box2}>
                  <div className={Styles.col_6}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.inner_text}>
                      <p>
                        바프독 레시피 올인원 패키지 강아지 생식 닭 칠면......
                      </p>
                      <div className={Styles.mid_text}>
                        세트1) 스타터4+터키비프2+덕램2+램비프2 (+2900원) / 1개
                      </div>
                      <div>세트2) 스타터5+터키브프5팩 / 2개</div>
                    </div>
                  </div>
                  <div className={Styles.col_2}>3개</div>
                  <div className={Styles.col_3}>86,900원</div>
                  <div className={Styles.col_7}>-8,690원</div>
                  <div className={Styles.col_5}>결제완료</div>
                </div>

                <hr className={Styles.line2} />

                <div className={Styles.grid_box2}>
                  <div className={Styles.col_6}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.inner_text}>
                      <p>바프레드</p>
                    </div>
                  </div>
                  <div className={Styles.col_2}>1개</div>
                  <div className={Styles.col_3}>86,900원</div>
                  <div className={Styles.col_8}>0원</div>
                  <div className={Styles.col_5}>결제완료</div>
                </div>

                <hr className={Styles.line2} />

                <div className={Styles.grid_box2}>
                  <div className={Styles.col_6}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.inner_text}>
                      <p>바프레드</p>
                    </div>
                  </div>
                  <div className={Styles.col_2}>1개</div>
                  <div className={Styles.col_3}>86,900원</div>
                  <div className={Styles.col_8}>0원</div>
                  <div className={Styles.col_5}>결제완료</div>
                </div>

                <hr className={Styles.line2} />

                <div className={Styles.grid_box2}>
                  <div className={Styles.col_6}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.inner_text}>
                      <p>바프레드</p>
                    </div>
                  </div>
                  <div className={Styles.col_2}>1개</div>
                  <div className={Styles.col_3}>86,900원</div>
                  <div className={Styles.col_8}>0원</div>
                  <div className={Styles.col_5}>결제완료</div>
                </div>
              </section>
            </section>

            {/* 주문상품 결제정보 배송정보 */}
            <section className={Styles.body}>
              <div className={Styles.body_title}>주문정보</div>

              <hr />

              <div className={Styles.body_content_2}>
                <div className={Styles.grid_box}>
                  <div>주문번호</div>
                  <div>10000826742324</div>

                  <div>주문(결제)일시</div>
                  <div>2022/02/14 14:19</div>
                  <div>배송정보</div>
                  <div>정기 구독 배송</div>
                </div>
              </div>
            </section>

            <section className={Styles.body}>
              <div className={Styles.body_title}>배송조회</div>

              <hr />

              {/* 주문상품 결제정보 배송정보 */}
              <div className={Styles.body_content_3}>
                {false && <p>배송중 상태에서 조회가 가능합니다.</p>}
                {true && (
                  <div className={Styles.deliveryTracking}>
                    <span className={Styles.deliverytitle}>CJ대한통운</span>
                    <span data-delivery-trackingNumber={""}>
                      운송장번호<em>510017079554</em>
                    </span>
                    <span data-delivery-title={"배송상태"}>배송 중</span>
                    <button className={Styles.btn}>배송조회</button>
                  </div>
                )}
              </div>
            </section>

            {/* 주문상품 결제정보 배송정보 */}
            <section className={Styles.body}>
              <div className={Styles.body_title}>결제정보</div>

              <hr />

              <div className={Styles.body_content_2}>
                <div className={Styles.grid_box}>
                  <div>주문금액</div>
                  <div>193,400원</div>

                  <div>배송비</div>
                  <div>5,000원</div>

                  <div>할인금액</div>
                  <div>0원</div>

                  <div>적립금 사용</div>
                  <div>0원</div>

                  <div>쿠폰사용</div>
                  <div>0원</div>

                  <div>결제 금액</div>
                  <div>193,400원</div>

                  <div>적립예정금액</div>
                  <div>3,000원</div>

                  <div>결제방법</div>
                  <div>정기구독 카드결제</div>
                </div>
              </div>
            </section>

            <section className={Styles.body}>
              <div className={Styles.body_title}>배송정보</div>

              <hr />

              <div className={Styles.body_content_2}>
                <div className={Styles.grid_box}>
                  <div>받는 분</div>
                  <div>김바프</div>

                  <div>핸드폰</div>
                  <div>010-8888-8888</div>

                  <div>배송방법</div>
                  <div>택배배송</div>

                  <div>배송주소</div>
                  <div>충북 충주시 연수동 번영대로 프레쉬아워</div>
                  <div>배송요청사항</div>
                  <div>부재시 문 앞에 놔주세요</div>
                </div>
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SingleItem_OrderHistoryPage;
