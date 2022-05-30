import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import { Btn, Title } from "/src/components/atoms/Checkbox";
import Styles from "@styles/css/FindMyResult.module.scss";
import Image from "next/image";


function ValidSnsResultPage() {
  return (
    <>
      <MetaTitle title="SNS계정 연동결과" />
      <Layout>
        <Wrapper>
        <div className={Styles.flex_container}>
          <div className={Styles.titlebox}>
            <Title name='계정이 연동되었습니다.'></Title>
          </div>

          <div className={Styles.box}>
            <div className={Styles.linebox}>
              <div className={Styles.frontline}>가입된 이메일
                <p>barfdog2021@barfdog.com</p>
              </div>
              <div className={Styles.secondline}>
                연결된 SNS


              <p>현재 연결된 SNS가 없습니다.</p>

              <div className={`${Styles.image} img-wrap`}>
                <Image
                  priority
                  src={require("/public/img/icon/kakao.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>

              <div className={`${Styles.image} img-wrap`}>
                <Image
                  priority
                  src={require("/public/img/icon/naver.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>   
              {/* 연결된 sns가 있을때 새로 페이지? */}
              </div>
            </div>
          </div>
           <Btn name='로그인' style='red'></Btn>
        </div>
        </Wrapper>
      </Layout>
    </>
  );
}

export default ValidSnsResultPage;
