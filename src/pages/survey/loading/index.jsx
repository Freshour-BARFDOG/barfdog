import React from 'react'
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import s from './loading.module.scss';
import Image from 'next/image';

function LoadingPage() {
  return (
    <>
      <MetaTitle title="로딩 중" />
      <Layout>
        <Wrapper>
          <section className={s.image_section}>
            <div className={s.image_flex}>
            <i className={s.line}></i>

            <div className={s.image_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/survey/survey_loading_left.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="이전 화살표"
                  />
                </div>
              </div>

              <div className={s.image_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/survey/survey_loading_mid.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="이전 화살표"
                  />
                </div>
              </div>

              <div className={s.image_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/survey/survey_loading_right.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="이전 화살표"
                  />
                </div>
              </div>
              
            </div>
          </section>

          <section className={s.text_box}>
            <div className={s.text_row1}>
              고객님의 반려견에게<br />
              맞춤 레시피를 분석중입니다. 
            </div>
            <div className={s.text_row2}>
              바프독은 특허받은 반려동물 정보를 기반으로<br />
              맞춤형 레시피를 도출하는 알고리즘 서비스를 제공합니다.<br />
              고객님의 반려견에게 가장 건강한 레시피를 추천드릴게요.
            </div>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default LoadingPage