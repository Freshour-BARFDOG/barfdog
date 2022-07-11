import React, { useState } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "./dogs.module.scss";
import Image from "next/image";
import Link from "next/link";


const EmptyCont = () => {
  return (
    <>
      <section className={Styles.body}>
        <div className={Styles.flex_box}>
          <div className={Styles.text}>
            아직 등록된 반려견이 없습니다
            <br />내 강아지 정보를 입력하고 맞춤 플랜을 확인하세요
          </div>

          <div className={Styles.btn_box}>
            <div className={Styles.btn}>맞춤플랜 확인하기</div>
          </div>
        </div>
      </section>
    </>
  );
}

const ItemList = ()=>{

  return (<>
    <div className={Styles['dogInfo-wrap']}>
      <div className={Styles.left_box}>
        <div className={`${Styles.image} img-wrap`}>
          <Image
              priority
              src={require("/public/img/mypage/dogs_info3.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
          />
        </div>
      </div>
      <div className={Styles.right_box}>
        <div className={Styles['dog-info']}>
          <div className={Styles.inner_flex}>
            <h5 className={Styles.dog_name}>
              바둑이 ( 3세 / 암컷 )
            </h5>
            <div className={Styles.tags}>
              <i className={Styles.before_pay}>결제전</i>
              <i className={Styles.subscribe}>구독중</i>
              <i className={Styles.representative}>대표견</i>
            </div>
          </div>
          <div className={`${Styles.image} img-wrap`}>
            <Image
                priority
                src={require("/public/img/mypage/dog_info_delete.png")}
                objectFit="cover"
                layout="fill"
                alt="삭제 아이콘"
            />
          </div>
        </div>

        <div className={Styles.controls}>
          <button>프로필사진 편집</button>
          <button>대표견 설정</button>
        </div>

        {/* 설문결과 설문수정 결제하기 버튼3개 */}
        
      </div>
      <div className={Styles.select_box}>
        <div className={Styles['btn-section']}>
            <Link href={"/mypage/dogs/[id]/statistic"} passHref>
              <a>설문결과</a>
            </Link>
            <Link href={"/mypage/dogs/[id]/updateSurvey"} passHref>
              <a>설문수정</a>
            </Link>
            <button className={Styles.payment}>결제하기</button>
          </div>
        </div>
    </div>
  </>)
}


function MypageDogInfoPage() {
  return (
    <>
      <MetaTitle title="마이페이지 반려견정보" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={Styles.title}>반려견정보</section>

            <section>
              {[1,2,3].map((item, index)=><ItemList key={index} data={{item}}/>)}
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default MypageDogInfoPage;