import React, { useState } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import styled from "styled-components";
import Modal_useCoupon from "@src/components/modal/modal_mypage_coupon";
import s from "styles/css/mypage/coupon/index.module.scss";
import Pagination from "@src/components/atoms/Pagination";


const Temp_button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #000;
  border-radius: 100px;
  color: #fff;
  font-size: 15px;
  padding: 5px 26px;
  font-weight: 500;
  cursor: pointer;
`;

function CouponPage() {
  const [isActiveModal, setIsActiveModal] = useState(false);

  const onActiveModalHandler = () => {
    setIsActiveModal(true);
  }





  return (
    <>
      <MetaTitle title="마이페이지 쿠폰" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
              쿠폰 조회
            </section>

            <section className={s.coupon_code}>
              <label>
                <div className={s.coupon_code_row1}>
                  쿠폰등록
                </div>
                
                <div className={s.flex_box}>
                  <input className={s.input_box} type='text' placeholder='쿠폰코드를 입력해주세요'/>

                  <div className={s.btn_box}>
                    <div className={s.btn}>
                      등록
                    </div>
                  </div>
                </div>
              </label>
            </section>

            <section className={s.coupon_state_section}>
              <div className={s.coupon_state_flex_box}>
                <div className={s.left_box}>
                  전체 쿠폰 : <span>2</span>개
                </div>
                <div className={s.line}>
                  <hr />
                </div>
                <div className={s.right_box}>
                  사용가능 쿠폰 : <span>2</span>개
                </div>
              </div>
              
              <div className={s.horizon}>
                <hr />
              </div>

              <div className={s.coupon_content_grid_box}>
                <div className={s.grid_box}>
                  <div className={s.left_top}>
                    신규회원 할인쿠폰
                  </div>
                  <div className={s.right_top}>
                    30%
                  </div>

                  <div className={s.left_bot}>
                    <div className={s.left_bot_text}>
                      신규 회원가입 할인쿠폰
                      <div className={s.inner_flex_box}>
                        <div className={s.left_text}>
                          사용기한 
                        </div>
                        
                        <div className={s.line}>
                          <hr />
                        </div>

                        <div>
                          무제한
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={s.right_bot}>
                    <Temp_button onClick={onActiveModalHandler}>
                      쿠폰 사용
                    </Temp_button>
                  </div>

                </div>


                <div className={s.grid_box}>
                  <div className={s.left_top}>
                    신규회원 할인쿠폰
                  </div>
                  <div className={s.right_top}>
                    30%
                  </div>

                  <div className={s.left_bot}>
                    <div className={s.left_bot_text}>
                      신규 회원가입 할인쿠폰
                      <div className={s.inner_flex_box}>
                        <div>
                          사용기한 
                        </div>
                        
                        <div>
                          <hr />
                        </div>

                        <div>
                          무제한
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={s.right_bot}>
                    <Temp_button onClick={onActiveModalHandler}>
                      쿠폰 사용
                    </Temp_button>
                  </div>
                </div>


                <div className={s.grid_box}>
                  <div className={s.left_top}>
                    신규회원 할인쿠폰
                  </div>
                  <div className={s.right_top}>
                    30%
                  </div>

                  <div className={s.left_bot}>
                    <div className={s.left_bot_text}>
                      신규 회원가입 할인쿠폰
                      <div className={s.inner_flex_box}>
                        <div>
                          사용기한 
                        </div>
                        
                        <div>
                          <hr />
                        </div>

                        <div>
                          무제한
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={s.right_bot}>
                    <Temp_button onClick={onActiveModalHandler}>
                      쿠폰 사용
                    </Temp_button>
                  </div>
                </div>

              </div>

            </section>


            <section className={s.pageline}>
              <Pagination itemCountPerGroup={1} itemTotalCount={1} />
            </section>


          </MypageWrapper>
        </Wrapper>
      </Layout>
      {isActiveModal && (
        <Modal_useCoupon
          isActiveModal={isActiveModal}
          setIsActiveModal={setIsActiveModal}
        />
      )}
    </>
  );
}

export default CouponPage;
