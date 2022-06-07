import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from "./withdrawal.module.scss";


function WithDrawalPage() {
  return (
    <>
      <MetaTitle title="회원탈퇴"/>
      <Layout>
        <Wrapper>
          <section className={s.title}>
            <div className={s.text}>
              회원 탈퇴
            </div>
          </section>

          <section className={s.content}>
            <div className={s.content_text}>
              정말 탈퇴하시겠습니까? 탈퇴 시 보유 적립금은 모두 삭제됩니다.  
              정말 탈퇴하시겠습니까? 탈퇴 시 보유 적립금은 모두 삭제됩니다.  
            </div>

            <label id='hi' className={s.labe_box}>
              <div className={s.label_text}>
                비밀번호 확인
              </div>

              <input className= {s.input_box} type="password" id='hi '/>
            </label>
          </section>

          <section className={s.btn}>
            <div className={s.btn_box}>
              <div className={s.btn_cancel}>
                취소
              </div>
              <div className={s.btn_withdraw}>
                탈퇴
              </div>
            </div>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default WithDrawalPage;