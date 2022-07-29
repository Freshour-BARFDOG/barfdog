import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from "./invite.module.scss";
import Pagination from "@src/components/atoms/Pagination";


function InvitePage() {
  return (
    <>
      <MetaTitle title="마이페이지 친구초대" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
              친구초대
            </section>
            
            <section className={s.text}>
              <div>
                친구가 내 추천코드로 가입하면 <span>친구에게 3000 포인트,</span><br />
                친구가 첫 주문하면 <span>나한테도 3,000 포인트</span> 선물을 드립니다!
              </div>
             
            </section>

            <section className={s.referral_code}>
              <label>
                <div className={s.referral_code_row1}>
                  추천코드
                </div>
                
                <div className={s.grid_box}>
                  <input className={s.input_box} type='text' placeholder='친구의 추천코드를 입력해주세요'/>

                  <div className={s.btn_box}>
                    <div className={s.btn}>
                      등록
                    </div>
                  </div>
                </div>
              </label>
            </section>

            <section className={s.count_box}>
              <div className={s.mid}>
                <div className={s.count_grid_box}>
                  <div className={s.count_flex_box}>
                    <div className={s.left_box}>
                      <p>가입한 친구</p>
                      <div className={s.count_text}>
                        0
                      </div>
                    </div>

                    <div className={s.mid_box}>
                      <p>주문한 친구</p>
                      <div className={s.count_text}>
                        0
                      </div>
                    </div>
                  </div>

                  <div className={s.mid_box}>
                    <p>총 적립 포인트</p>
                    <div className={s.count_text}>
                      3000<span>원</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={s.line}>
              <hr></hr>
            </section>


            <section className={s.content}>
              <div className={s.grid_box}>
                <div className={s.flex_box}>
                  <div className={s.day_text}>
                    21.04.01
                  </div>
                  <div className={s.content_text}>
                    [친구초대] 친구 초대 적립금 (김*프)
                  </div>
                </div>
                <div className={s.price_text}>
                  +3000 원
                </div>
              </div>

              <div className={s.grid_box}>
                <div className={s.flex_box}>
                  <div className={s.day_text}>
                    21.04.01
                  </div>
                  <div className={s.content_text}>
                    [친구초대] 친구 초대 적립금 (김*프)
                  </div>
                </div>
                <div className={s.price_text}>
                  +3000 원
                </div>
              </div>

              <div className={s.grid_box}>
                <div className={s.flex_box}>
                  <div className={s.day_text}>
                    21.04.01
                  </div>
                  <div className={s.content_text}>
                    [친구초대] 친구 초대 적립금 (김*프)
                  </div>
                </div>
                <div className={s.price_text}>
                  +3000 원
                </div>
              </div>

              <div className={s.grid_box}>
                <div className={s.flex_box}>
                  <div className={s.day_text}>
                    21.04.01
                  </div>
                  <div className={s.content_text}>
                    [친구초대] 친구 초대 적립금 (김*프)
                  </div>
                </div>
                <div className={s.price_text}>
                  +3000 원
                </div>
              </div>

            </section>


            <section className={s.pageline}>
              <Pagination itemCountPerGroup={1} itemTotalCount={1} />
            </section>

          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default InvitePage;