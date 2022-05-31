import React from "react";
import Link from "next/link";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from "./surveyGuide.module.scss";
import Image from "next/image";

function SurveyGuidePage() {
  return (
    <>
      <MetaTitle title="설문조사 안내" />
      <Layout>
        <Wrapper>

          <div className={s.title_box}>
            <div className={s.inner_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/survey_guide.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
              <div className={s.text}>
              내 반려견에게 꼭 맞는 맞춤 플랜을 위한<br />
              정보작성이 1분가량소요됩니다.

              </div>
            </div>
          </div>
          <div className={s.btn_box}>
            <Link href="/survey" passHref>
              <a style={{padding:'10px 20px', maxWidth:'280px', height:'44px', backgroundColor:'var(--color-main)', borderRadius:'4px', color:"#fff", boxSizing:'border-box', textAlign:'center'}}>반려견 정보작성 시작하기</a>
            </Link>
          </div>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SurveyGuidePage;
