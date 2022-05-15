import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from 'styles/css/mypage/order-history/subscribe/[orderIdx].module.scss';
import Image from 'next/image';


function SubScribe_OrderHistoryPage() {
  return (
    <>
      <MetaTitle title="마이페이지 주문내역: 정기구독" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={Styles.title}>
                주문내역
              </section>

              <section className={Styles.content_title}>
                <div className={Styles.flex_box}>
                  <div className={Styles.left_box}>
                    <div>
                      정기구독
                    </div>
                  </div>

                  <div className={Styles.right_box}>
                    일반주문
                  </div>
                </div>
              </section>

              <section className={Styles.content}>
                <div className={Styles.day}>
                  2022.02.14
                </div>

                <hr />

                <div className={Styles.content_body}>
                  <div className={Styles.left_box}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.flex_box}>
                      <div className={Styles.text}>
                        <p>시호</p>
                        <div className={Styles.line_box}>
                          <hr />
                        </div>
                        <div className={Styles.last_text}>믹스레시피 (8회차)</div>
                      </div>

                      <div className={Styles.text2}>
                        <div>주문번호</div>
                        <div>10000826742324</div>
                        <div>결제금액</div>
                        <div>84,000원</div>
                      </div>
                    </div>
                  </div>

                  <div className={Styles.mid_box}>
                    배송중
                  </div>

                  <div className={Styles.right_box}>
                    <div className={Styles.btn}>
                      주문상세
                    </div>
                    <div className={Styles.btn2}>
                      구독관리
                    </div>
                  </div>
                </div>
              </section>

              <section className={Styles.content}>
                <div className={Styles.day}>
                  2022.02.14
                </div>

                <hr />

                <div className={Styles.content_body}>
                  <div className={Styles.left_box}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_sample_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.flex_box}>
                      <div className={Styles.text}>
                        <p>시호</p>
                        <div className={Styles.line_box}>
                          <hr />
                        </div>
                        <div className={Styles.last_text}>믹스레시피 (8회차)</div>
                      </div>

                      <div className={Styles.text2}>
                        <div>주문번호</div>
                        <div>10000826742324</div>
                        <div>결제금액</div>
                        <div>84,000원</div>
                      </div>
                    </div>
                  </div>

                  <div className={Styles.mid_box}>
                    배송중
                  </div>

                  <div className={Styles.right_box}>
                    <div className={Styles.btn}>
                      주문상세
                    </div>
                    <div className={Styles.btn2}>
                      구독관리
                    </div>
                  </div>
                </div>
              </section>

              <section className={Styles.content}>
                <div className={Styles.day}>
                  2022.02.14
                </div>

                <hr />

                <div className={Styles.content_body}>
                  <div className={Styles.left_box}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_sample_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>

                    <div className={Styles.flex_box}>
                      <div className={Styles.text}>
                        <p>시호</p>
                        <div className={Styles.line_box}>
                          <hr />
                        </div>
                        <div className={Styles.last_text}>믹스레시피 (8회차)</div>
                      </div>

                      <div className={Styles.text2}>
                        <div>주문번호</div>
                        <div>10000826742324</div>
                        <div>결제금액</div>
                        <div>84,000원</div>
                      </div>
                    </div>
                  </div>

                  <div className={Styles.mid_box}>
                    배송중
                  </div>

                  <div className={Styles.right_box}>
                    <div className={Styles.btn}>
                      주문상세
                    </div>
                    <div className={Styles.btn2}>
                      구독관리
                    </div>
                  </div>
                </div>
              </section>


              <section className={Styles.pagination}>
                <div className={Styles.pagination_box}>
                  <div className={Styles.content}>
                    <div> &#60;</div>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>...</div>
                    <div>11</div>
                    <div> &#62;</div>
                  </div>
                </div>
              </section>
              
          </MypageWrapper>
        </Wrapper>


        <Wrapper>
          <MypageWrapper>
              <section className={Styles.title}>
                주문상세정보
              </section>

              <section className={Styles.body}>
                <div className={Styles.body_title}>
                  주문상품
                </div>
                
                <hr />

                <div className={Styles.body_content}>
                  <div className={Styles.left_box}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/order_history/subscribe_sample_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                  </div>

                  <div className={Styles.right_box}>
                    {/* 2가지로 나눔 */}
                    <div className={Styles.grid_box}>
                      <div>
                        구독정보
                      </div>
                      <div>
                        스타터 프리미엄(1회차)
                      </div>

                      <div>
                        반려견
                      </div>
                      <div>
                        시호
                      </div>

                      <div>
                        급여량  
                      </div>
                      <div>
                        272g
                      </div>

                      <div>
                        플랜  
                      </div>
                      <div>
                        풀플랜(28개)
                      </div>

                      <div>
                        레시피  
                      </div>
                      <div>
                        믹스레시피(스타터프리미엄, 덕&amp;램)
                      </div>

                      <div>
                        가격
                      </div>
                      <div>
                        193,400원
                      </div>

                    </div>
                  </div>
                </div>
              </section>


              {/* 주문상품 결제정보 배송정보 */}
              <section className={Styles.body}>
                <div className={Styles.body_title}>
                  주문정보
                </div>
                
                <hr />

                
                <div className={Styles.body_content_2}>
                  <div className={Styles.grid_box}>
                    <div>
                      주문번호
                    </div>
                    <div>
                      10000826742324
                    </div>

                    <div>
                      주문(결제)일시
                    </div>
                    <div>
                      2022/02/14 14:19
                    </div>
                    <div>
                      배송정보
                    </div>
                    <div>
                      정기 구독 배송
                    </div>
                    
                  </div>

                </div>
              </section>

              <section className={Styles.body}>
                <div className={Styles.body_title}>
                  배송조회
                </div>

                <hr />

                {/* 주문상품 결제정보 배송정보 */}
                <div className={Styles.body_content_3}>
                  <p>배송중 상태에서 조회가 가능합니다.</p>
                </div>
              </section>

              {/* 주문상품 결제정보 배송정보 */}
              <section className={Styles.body}>
                <div className={Styles.body_title}>
                  결제정보
                </div>
                
                <hr />

                
                <div className={Styles.body_content_2}>
                  <div className={Styles.grid_box}>
                    <div>
                      주문금액
                    </div>
                    <div>
                      193,400원
                    </div>

                    <div>
                      배송비
                    </div>
                    <div>
                      정기구독 무료
                    </div>

                    <div>
                      할인금액
                    </div>
                    <div>
                      0원
                    </div>

                    <div>
                      적립금 사용
                    </div>
                    <div>
                      0원
                    </div>

                    <div>
                      쿠폰사용
                    </div>
                    <div>
                      0원  
                    </div>

                    <div>
                      결제 금액
                    </div>
                    <div>
                      193,400원
                    </div>

                    <div>
                      적립예정금액
                    </div>
                    <div>
                      3,000원
                    </div>

                    <div>
                      결제방법
                    </div>
                    <div>
                      카드결제
                    </div>
                    
                  </div>

                </div>
              </section>

              <section className={Styles.body}>
                <div className={Styles.body_title}>
                  배송정보
                </div>
                
                <hr />

                
                <div className={Styles.body_content_2}>
                  <div className={Styles.grid_box}>
                    <div>
                      받는 분
                    </div>
                    <div>
                      김바프
                    </div>

                    <div>
                      핸드폰
                    </div>
                    <div>
                      010-8888-8888
                    </div>

                    <div>
                      배송방법
                    </div>
                    <div>
                      택배배송
                    </div>

                    <div>
                      배송주소
                    </div>
                    <div>
                      충북 충주시 연수동 번영대로 프레쉬아워
                    </div>
                    <div>
                      배송요청사항
                    </div>
                    <div>
                      부재시 문 앞에 놔주세요
                    </div>

                  </div>

                </div>
              </section>

              
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SubScribe_OrderHistoryPage;
