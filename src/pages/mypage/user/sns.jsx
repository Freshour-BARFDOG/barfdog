import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from 'styles/css/mypage/user/sns.module.scss';

function SNSManagementPage() {
  return (
    <>
      <MetaTitle title="마이페이지 SNS연동"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
                <div>
                  연동SNS
                </div>
            </section>

            <section className={s.content}>
              <div className={s.gray_box}>

                <div className={s.row_1}>
                  연동된 SNS
                </div>
                <div className={s.row_2}>
                  네이버 <span>(barfdog@naver.com)</span>
                </div>

              </div>
            </section>
            
            <section className={s.btn}>
              <div className={s.btn_box}>
                <div className={s.red_btn}>
                  연동 해제하기
                </div>
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SNSManagementPage;