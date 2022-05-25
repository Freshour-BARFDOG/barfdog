import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from "styles/css/mypage/reward/index.module.scss";
import Pagination from "@src/components/atoms/Pagination";

function RewardPage() {
  return (
    <>
      <MetaTitle title="마이페이지 적립금" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
              적립금 조회
            </section>

            <section className={s.reward_state}>
              <div className={s.box}> 
                <div className={s.flex_box}>
                  <div className={s.left_box}>
                    사용 가능 적립금 
                    <span>0 원</span>
                  </div>

                  <div className={s.mid_box}>
                    <hr className={s.line} />
                  </div>

                  <div className={s.right_box}>
                    소멸 예정 적립금
                    <span>0 원</span>
                  </div>
                </div>
              </div>  
            </section>

            <section className={s.content}>
              <div className={s.flex_box}>
                <div className={s.day_text}>
                  21.04.01
                </div>
                <div className={s.content_text}>
                  [친구초대] 친구 초대 적립금 만료
                </div>
                <div className={s.price_text_grey}>
                  -3000 원
                </div>
              </div>
              <div className={s.flex_box}>
                <div className={s.day_text}>
                  21.04.01
                </div>
                <div className={s.content_text}>
                  [친구초대] 친구 초대 적립금 (김*프)
                </div>
                <div className={s.price_text}>
                  +3000 원
                </div>
              </div>

              <div className={s.flex_box}>
                <div className={s.day_text}>
                  21.04.01
                </div>
                <div className={s.content_text}>
                  [친구초대] 친구 초대 적립금 (김*프)
                </div>
                <div className={s.price_text}>
                  +3000 원
                </div>
              </div>

              <div className={s.flex_box}>
                <div className={s.day_text}>
                  21.04.01
                </div>
                <div className={s.content_text}>
                  [친구초대] 친구 초대 적립금 (김*프)
                </div>
                <div className={s.price_text}>
                  +3000 원
                </div>
              </div>

              <div className={s.flex_box}>
                <div className={s.day_text}>
                  21.04.01
                </div>
                <div className={s.content_text}>
                  [친구초대] 친구 초대 적립금 (김*프)
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

export default RewardPage;
