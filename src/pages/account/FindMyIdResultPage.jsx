import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import { Btn, Title } from "/src/components/atoms/checkbox";
import Styles from "../../../styles/css/FindMyResult.module.scss";

export default function FindMyIdResultPage() {
  return (
    <Layout>
      <Wrapper>
        <div className={Styles.flex_container}>
          <div className={Styles.titlebox}>
            <Title name='아이디 찾기'></Title>
          </div>

          <div className={Styles.box}>
            <div className={Styles.linebox}>
              <div className={Styles.frontline}>가입된 이메일
                <p>barfdog2021@barfdog.com</p>
              </div>
              <div className={Styles.secondline}>
                연결된 SNS
              <p>현재 연결된 SNS가 없습니다.</p>
              {/* 연결된 sns가 있을때 새로 페이지? */}
              </div>
            </div>
          </div>
           <Btn name='로그인' style='red'></Btn>
        </div>
      </Wrapper>
    </Layout>
  );
}