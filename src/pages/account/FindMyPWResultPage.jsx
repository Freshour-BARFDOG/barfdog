import React from 'react';
import Layout from "/src/components/common/Layout";
import Wrapper from '/src/components/common/Wrapper';
import Styles from '../../styles/css/FindMyResult.module.scss';
import { Btn, Title } from "../../src/components/atoms/checkbox";

export default function FindMyPWResultPage() {
  return (
    <Layout>
      <Wrapper>
        <div className={Styles.flex_container}>
          <div className={Styles.titlebox}>
            <Title name='비밀번호 찾기'></Title>
          </div>

          <div className={Styles.box}>
            <div className={Styles.linebox}>
              <div className={`${Styles.frontline} ${Styles.pwline}`}>
                회원님 휴대폰으로
              </div>
              <div className={`${Styles.secondline} ${Styles.pwline}`}>
                임시비밀번호가 발급되었습니다.
              </div>
            </div>
          </div>
         
          <div className={Styles.btnbox}>
            <Btn name='임시비밀번호 재발급' style = 'white'></Btn>
          </div>
            <Btn name='로그인' style='red'></Btn>
          
         
        </div>
      </Wrapper>
    </Layout>
  );
}

