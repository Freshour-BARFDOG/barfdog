import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from './changePassword.module.scss';


function ChangePasswordPage() {
  return (
    <>
      <MetaTitle title="마이페이지 비밀번호변경" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
                <div>
                  비밀번호 변경
                </div>
            </section>

            <section className={s.content}>
              <div className={s.pass_box}>
                <label id='current_pass' className={s.label_box1}>
                  <div className={s.label_text}>
                    현재 비밀번호
                  </div>

                  <input className= {s.input_box} type="password" id='current_pass'/>
                </label>

                <label id='current_pass' className={s.label_box}>
                  <div className={s.label_text}>
                    새 비밀번호
                  </div>

                  <input className= {s.input_box} type="password" id='current_pass'/>
                </label>

                <label id='current_pass' className={s.label_box}>
                  <div className={s.label_text}>
                    새 비밀번호 확인
                  </div>

                  <input className= {s.input_box} type="password" id='current_pass'/>
                </label>
              </div>
            </section>

            <section className={s.btn}>
              <div className={s.btn_box}>
                <div className={s.left_box}>
                  취소
                </div>
                <div className={s.right_box}>
                  변경
                </div>
              </div>
            </section>
            
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default ChangePasswordPage;