import React, { useEffect, useState } from 'react';
import MetaTitle from '../components/atoms/MetaTitle';
import Styles from './mainPage.module.scss';
import Image from 'next/image';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import Barfraw from '/public/img/barfraw.png';
import Barfgood1 from '/public/img/barfgood1.png';
import Barfgood2 from '/public/img/barfgood2.png';
import Halftest from '/public/img/halftest.png';
import LeftPic from '/public/img/leftPic.png';
import midPic from '/public/img/midPic.png';
import rightPic from '/public/img/rightPic.png';
import barfPack from '/public/img/barfPack.png';
import { Swiper_sns } from '@src/components/home/Swiper_sns';
import { Swiper_review } from '@src/components/home/Swiper_review';
import { Swiper_recipe } from '@src/components/home/Swiper_recipe';
import { Swiper_main } from '@src/components/home/Swiper_main';
import {getDataSSR} from "@src/pages/api/reqData";
import Link from "next/link";

export default function Home({ data }) {
  
  console.log(data)
  // const DATA = {
  //   topBannerDto: data.topBannerDto,
  //   mainBannerDtoList: data.mainBannerDtoList,
  //   recipeDtoList: data.recipeDtoList,
  //   queryBestReviewsDtoList: data.queryBestReviewsDtoList,
  // }
  //
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);

  return (
    <>
      <MetaTitle title="바프독" />
      {/* <Layout id="mainpage"> */}
      <Layout>
        {/* <Wrapper bgColor="#fbf7f6" fullWidth={true}> */}
        <Wrapper fullWidth={true} rowStyle={{ padding: 0 }}>
          {/* 스와이프주석 */}
          <Swiper_main data={data?.mainBannerDtoList} isMobile={isMobile}/>
        </Wrapper>

        {/* 섹션1 레시피 4가지 소개*/}
        <Wrapper>
          <section className={`${Styles.recipe_info} $`}>
            <div className={Styles.inner}>
              <h2 className={Styles.recipe_title}>
                &quot;진짜 생식&#34; <br /> 바프독의 4가지 레시피
              </h2>
              <Swiper_recipe data={data?.recipeDtoList} isMobile={isMobile}/>
            </div>
          </section>
        </Wrapper>

        {/* 바프생식이란? */}
        <Wrapper bgColor="#F9F2EC">
          <section className={Styles.barfraw}>
            <div className={Styles.inner}>
              <div className={Styles.leftbox}>
                <Image src={Barfraw} objectFit="cover" layout="fill" alt="바프 생식 이미지" />
              </div>
              <div className={Styles.rightbox}>
                <p>ABOUT BARF</p>
                <h1>바프생식이란?</h1>
                <h3 className="font-NotoSans">
                  &nbsp;BARF(Biologi cally Appropriate Raw Food)는 생물학적으로 적절한 생식이라는
                  뜻으로, 생고기와 뼈, 야채를 적절히 배합하여 반려동물에게 단백질과 지방을 신선한
                  상태에서 섭취할 수 있도록 돕습니다. 바프독은 70%의 두 종류 고기와 칼슘이 풍부한
                  뼈, 내장, 신선한 야채를 배합해 완벽한 비율의 영양을 공급합니다.
                </h3>
              </div>
            </div>
            {/* inner end */}
          </section>
        </Wrapper>

        {/* 바프생식 바뀌는 점 */}
        <Wrapper>
          <section className={Styles.barfgood}>
            <ul className={Styles.inner}>
              <li className={Styles.leftbox}>
                <div className={Styles.barfgood_textbox}>
                  <h1>
                    생식을 하면
                    <br />
                    어떤점이 바뀔까요?
                  </h1>
                  <p>
                    &nbsp;BARF(Biologi cally Appropriate Raw Food)는 생물학적으로 적절한 생식이라는
                    뜻으로, 생고기와 뼈, 야채를 적절히 배합하여 반려동물에게 단백질과 지방을 신선한
                    상태에서 섭취할 수 있도록 돕습니다. 바프독은 70%의 두 종류 고기와 칼슘이 풍부한
                    뼈, 내장, 신선한 야채를 배합해 완벽한 비율의 영양을 공급합니다.
                  </p>
                </div>
              </li>
              <li className={Styles.rightbox}>
                <div className={Styles.barfgood_imgbox}>
                  <div className={Styles.barfood1}>
                    <Image
                      src={Barfgood1}
                      objectFit="fit"
                      width={560}
                      height={456}
                      alt="카드 이미지"
                    />
                  </div>
                  <div className={Styles.barfood2}>
                    <Image
                      src={Barfgood2}
                      objectFit="fit"
                      width={335}
                      height={635}
                      alt="카드 이미지"
                    />
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </Wrapper>

        {/* 바프독 선택해야하는 이유 */}
        <Wrapper>
          <section className={Styles.difference}>
            <div className={Styles.inner}>
              <p>CEHCK POINT</p>
              <h1>바프독을 선택해야 하는 이유</h1>
              <Image
                src={Halftest}
                objectFit="fit"
                width={560}
                height={560}
                alt="카드 이미지"
              ></Image>
            </div>
          </section>
        </Wrapper>

        {/* 차별점 그림 3개  */}
        <Wrapper bgColor="#F9F2EC">
          <section className={Styles.difference2}>
            {/* <ul className={Styles.inner}> */}
            <ul>
              <li className={Styles.firstbox}>
                <p className={Styles.title}>
                  완벽한 영양구성
                  <br />
                  real BARF
                </p>
                <Image src={LeftPic} objectFit="fit" width={260} height={260} alt="카드 이미지" />
                <p className={Styles.text}>
                  생고기, 칼슘이 풍부한 뼈, 신선한 야채를 완벽한 비율로 구성해 반려견이 필요한
                  영양분을 골고루 섭취 할 수 있습니다.
                </p>
              </li>

              <li className={Styles.midbox}>
                <p className={Styles.title}>
                  국내최초 국내유일
                  <br />
                  double meats
                </p>
                <Image src={midPic} objectFit="fit" width={260} height={260} alt="카드 이미지" />
                <p className={Styles.text}>
                  전문가들은 균형잡힌 식사를 위해 한끼에 두가지 이상의 고기를 섭취하도록 권장합니다.
                  바프독은 모든 레시피에 두가지 고기를 풍부하게 담았습니다.
                </p>
              </li>

              <li className={Styles.firstbox}>
                <p className={Styles.title}>
                  미국사료협회 영양기준
                  <br />
                  AAFCO
                </p>
                <Image src={rightPic} objectFit="fit" width={260} height={260} alt="카드 이미지" />
                <p className={Styles.text}>
                  미국 사료협회 AAFCO에서 제시한 펫푸드 영양성분 가이드라인을 충족하며 고단백,
                  고영양의 프리미엄 맞춤형 생식을 제공합니다.
                </p>
              </li>
            </ul>
          </section>
        </Wrapper>

        {/* 프리미엄바프 사진 설명 */}
        <Wrapper>
          <section className={Styles.difference3}>
            {/* <div className={Styles.} */}
            <h2 className={Styles.title}>
              PREMIUM <br />
              REAL BARF
            </h2>
            <div className={Styles.image}>
              <Image src={barfPack} alt="인공 조미료" />
              <div className={Styles.textbox}>
                <ul className={Styles.text}>
                  <li>영양보존 100%</li>
                  <li>100% 휴먼그레이드</li>
                  <li>인공화학물 FREE</li>
                  <li>인공감미료 FREE</li>
                </ul>
              </div>
            </div>
          </section>
        </Wrapper>

        {/* 고민 */}
        <Wrapper bgColor="#F9F2EC">
          <section className={Styles.clientWorry} style={{ backgroundColor: '#F9F2EC' }}>
            <div className={`${Styles.inner} clearfix`}>
              <div className={`${Styles['cont-left']} cont-left`}>
                <div className={Styles.title_section}>
                  <h2 className={Styles.title}>
                    혹시 이런 고민
                    <br />
                    해본적 있으신가요?
                  </h2>
                  <p className={Styles.subtitle}>
                    생고기, 칼슘이 풍부한 뼈, 신선한 야채를 완벽한 비율으로 구성해 반려견이 필요한
                    영양분을 골고루 섭취할 수 있습니다.완벽한 비율으로 구성해 반려견이 필요한
                    영양분을 골고루섭취할 수 있습니다. 완벽한 비율으로
                  </p>
                  <button type="button" className={`${Styles.btn_main}`}>
                    바프생식 둘러보기
                  </button>
                </div>
              </div>
              <div className={`${Styles['cont-right']} cont-right`}>
                <div className={Styles.cont_section}>
                  <ul className="clearfix">
                    <li>
                      <div className={Styles.card}>
                        <div className={`${Styles['img-wrap']} img-wrap`}>
                          <Image
                            src={require('/public/img/pages/home/home_clientWorry.png')}
                            objectFit="cover"
                            layout="fill"
                            alt="카드 이미지"
                          />
                        </div>
                        <p className={Styles.card_title}>견주님의 고민</p>
                        <div className={Styles.details}>
                          <ul>
                            <li>
                              생식을 시도하고 싶지만 공부해야할 것이 많아 확신이 서지 않고, 반려견의
                              적응이 두려워요
                            </li>
                            <li>
                              기존 화식이나 건식사료를 급여 중 건강이 나빠진 반려견을 위해서 생식을
                              시도해보고싶어요
                            </li>
                            <li>
                              생식을 시도하고 싶지만 공부해야할 것이 많아 확신이 서지 않고, 반려견의
                              적응이 두려워요
                            </li>
                            <li>
                              생식을 시도하고 싶지만 공부해야할 것이 많아 확신이 서지 않고, 반려견의
                              적응이 두려워요
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className={Styles.card}>
                        <div className={`${Styles['img-wrap']} img-wrap`}>
                          <Image
                            src={require('/public/img/pages/home/home_clientWorry.png')}
                            objectFit="cover"
                            layout="fill"
                            alt="카드 이미지"
                          />
                        </div>
                        <p className={Styles.card_title}>견주님의 고민</p>
                        <div className={Styles.details}>
                          <ul>
                            <li>눈물과 눈곱이 많고 눈물자국이 짙어져요</li>
                            <li>활동량이 줄고 잠이 많아졌어요</li>
                            <li>양치를 해도 입냄새가 심해요</li>
                            <li>입맛이 까다로워서 편식을 많이해요</li>
                            <li>모발이 푸석푸석해요</li>
                            <li>귀를 자주 긁어요. 가려운 곳이 많아요</li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </Wrapper>

        {/* 리뷰 후기 */}
        <Wrapper>
          <section className={Styles.review}>
            <div className={Styles.inner}>
              <h2 className={Styles.title}>
                수많은 후기가 증명하는 <br /> BARFDOG
              </h2>
              <div className={Styles.cont_body}>
                <Swiper_review data={data?.queryBestReviewsDtoList}/>
                <div className={Styles.redbox}>
                  <div className={Styles.red}></div>
                </div>
              </div>
            </div>
          </section>
        </Wrapper>

        {/* 이용방법 */}
        <Wrapper bgColor="#F9F2EC">
          <section className={Styles.Howtouse}>
            <div className={Styles.inner}>
              <h2 className={Styles.title}>바프독 이용방법</h2>
              <p>
                Start now 버튼을 통해 간편하게 반려동물 정보를 입력하고 계정에서 최신상태로 업데이트
                할 수 있습니다
                <br />
                간편하지만 완벽한 식단을 매달 원하는 날짜에 맞춰 받아보세요
              </p>
              <div className={Styles.cont_body}>
                <ul className={Styles.howtouse_box}>
                  <li>
                    <figure className={Styles.card}>
                      <div className={`${Styles['img-wrap']} img-wrap`}>
                        <Image
                          src={require('/public/img/pages/home/home_howtouse_1.png')}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <div className={Styles.details}>
                        <p className={Styles.title_1}>STEP 01</p>
                        <p className={Styles.title_2}>반려동물 정보 입력</p>
                        <p className={Styles.main_text}>
                          정확한 레시피를 위해 반려동물의 정보를 입력해주세요. 프레시아워는 신선하고
                          엄선된 재료를 바탕으로 반려동물의 맞춤형 신선사료를 추천 및 선택
                        </p>
                      </div>
                    </figure>
                  </li>
                  <li>
                    <figure className={Styles.card}>
                      <div className={`${Styles['img-wrap']} img-wrap`}>
                        <Image
                          src={require('/public/img/pages/home/home_howtouse_2.png')}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <div className={Styles.details}>
                        <p className={Styles.title_1}>STEP 02</p>
                        <p className={Styles.title_2}>맞춤형 신선사료 제작</p>
                        <p className={Styles.main_text}>
                          내 반려동물에 딱 맞는 레시피로 신선한 맞춤형 자연식(생식/화식)을
                          제작합니다. 내 반려동물에 맞는 한끼 정량으로 끼니별 급여가 가능하도록
                          포장합니다.
                        </p>
                      </div>
                    </figure>
                  </li>
                  <li>
                    <figure className={Styles.card}>
                      <div className={`${Styles['img-wrap']} img-wrap`}>
                        <Image
                          src={require('/public/img/pages/home/home_howtouse_3.png')}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <div className={Styles.details}>
                        <p className={Styles.title_1}>STEP 03</p>
                        <p className={Styles.title_2}>정기구독 배송</p>
                        <p className={Styles.main_text}>
                          급속냉동한 제품을 꼼꼼하게 포장해 고객님의 문앞까지 배송합니다. 원하는
                          날짜에 맞춰 정기 배송 서비스
                        </p>
                      </div>
                    </figure>
                  </li>
                </ul>
                <div className={Styles.btn_box}>
                  <Link href={'/surveyGuide'} passHref>
                    <a type="button" className={Styles.btn_main}>
                      정기구독 신청하러 가기
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Wrapper>

        {/* SNS */}
        <Wrapper>
          <section className={Styles.sns}>
            <div className={Styles.inner}>
              <h2 className={Styles.title}>INSTAGRAM</h2>
              <p>인스타그램에서 바프독의 최신 소식을 확인해보세요</p>
              <div className={Styles.cont_body}>
                <Swiper_sns />
              </div>
            </div>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}


const DUMMY_DATA = {
  "topBannerDto" : {
    "name" : "top Banner name",
    "backgroundColor" : "red",
    "fontColor" : "write",
    "pcLinkUrl" : "pc link url",
    "mobileLinkUrl" : "mobile link url"
  },
  "mainBannerDtoList" : [ {
    "id" : 1,
    "leakedOrder" : 1,
    "name" : "메인배너1",
    "pcFilename" : "aa402238-f0a7-43c0-a2a6-b297debf511c_mainBanner1.jpg",
    "pcImageUrl" : "https://shop-phinf.pstatic.net/20210930_23/16329707437275Bauq_PNG/pc.png",
    "pcLinkUrl" : "/admin",
    "mobileFilename" : "7292ae0e-bd45-4213-89ec-8733a8018a09_mainBanner1.jpg",
    "mobileImageUrl" : "https://shop-phinf.pstatic.net/20210930_23/16329707437275Bauq_PNG/pc.png",
    "mobileLinkUrl" : ""
  }, {
    "id" : 2,
    "leakedOrder" : 2,
    "name" : "메인배너2",
    "pcFilename" : "https://shop-phinf.pstatic.net/20220218_290/1645167736891rKnQ7_PNG/B4EBC1F6_1_BBE7BABB_5150x.png",
    "pcLinkUrl" : "",
    "mobileFilename" : "c9782799-f806-47bf-b146-992be5926c2e_mainBanner2.jpg",
    "pcImageUrl" : "https://shop-phinf.pstatic.net/20220218_290/1645167736891rKnQ7_PNG/B4EBC1F6_1_BBE7BABB_5150x.png",
    "mobileImageUrl" : "https://shop-phinf.pstatic.net/20220218_290/1645167736891rKnQ7_PNG/B4EBC1F6_1_BBE7BABB_5150x.png",
    "mobileLinkUrl" : ""
  }, {
    "id" : 3,
    "leakedOrder" : 3,
    "name" : "메인배너3",
    "pcFilename" : "882fa69b-1d10-4899-86f8-54a80fa717d9_mainBanner3.jpg",
    "pcImageUrl" : "https://shop-phinf.pstatic.net/20220126_205/1643164587468rOJb1_PNG/B4EBC1F6_1_BBE7BABB_4.png",
    "pcLinkUrl" : "",
    "mobileFilename" : "b0d23f3c-9a8d-4051-a7c1-f24d452718be_mainBanner3.jpg",
    "mobileImageUrl" : "https://shop-phinf.pstatic.net/20220126_205/1643164587468rOJb1_PNG/B4EBC1F6_1_BBE7BABB_4.png",
    "mobileLinkUrl" : ""
  }, {
    "id" : 4,
    "leakedOrder" : 4,
    "name" : "메인배너4",
    "pcFilename" : "https://images.unsplash.com/photo-1571562110290-08784605c218?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    "pcImageUrl" : "https://shop-phinf.pstatic.net/20211019_115/16346276123656K9V0_PNG/PC.png",
    "pcLinkUrl" : "",
    "mobileFilename" : "https://images.unsplash.com/photo-1571562110290-08784605c218?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    "mobileImageUrl" : "https://shop-phinf.pstatic.net/20211019_115/16346276123656K9V0_PNG/PC.png",
    "mobileLinkUrl" : ""
  } ],
  "recipeDtoList" : [ {
    "id" : 16,
    "name" : "램비프",
    "description" : "레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명",
    "uiNameKorean" : "레시피 한글",
    "uiNameEnglish" : "RECIPE ENGLISH",
    "filename1" : "램비프1.jpg",
    "imageUrl1" : "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    "filename2" : "램비프2.jpg",
    "imageUrl2" : "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
  }, {
    "id" : 15,
    "name" : "덕램",
    "description" : "레시피 설명",
    "uiNameKorean" : "레시피 한글",
    "uiNameEnglish" : "RECIPE ENGLISH",
    "filename1" : "덕램1.jpg",
    "imageUrl1" : "https://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    "filename2" : "덕램2.jpg",
    "imageUrl2" : "hhttps://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80g"
  }, {
    "id" : 14,
    "name" : "터키비프",
    "description" : "레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명",
    "uiNameKorean" : "레시피 한글",
    "uiNameEnglish" : "RECIPE ENGLISH",
    "filename1" : "터키비프1.jpg",
    "imageUrl1" : "https://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    "filename2" : "터키비프2.jpg",
    "imageUrl2" : "https://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
  }, {
    "id" : 13,
    "name" : "스타트",
    "description" : "레시피 설명222레시피 설명222레시피 설명222레시피 설명222레시피 설명222레시피 설명222",
    "uiNameKorean" : "레시피 한글",
    "uiNameEnglish" : "RECIPE ENGLISH",
    "filename1" : "스타트1.jpg",
    "imageUrl1" : "https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2092&q=80",
    "filename2" : "스타트2.jpg",
    "imageUrl2" : "https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2092&q=80g",
  } ],
  
  
  "queryBestReviewsDtoList" : [ {
    "id" : 1,
    "imageUrl" : "https://images.unsplash.com/photo-1422565096762-bdb997a56a84?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    "leakedOrder" : 1,
    "contents" : "열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1"
  }, {
    "id" : 2,
    "imageUrl" : "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    "leakedOrder" : 2,
    "contents" : "열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2"
  }, {
    "id" : 3,
    "imageUrl" : "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80",
    "leakedOrder" : 3,
    "contents" : "열글자 이상의 내용3"
  }, {
    "id" : 4,
    "imageUrl" : "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80",
    "leakedOrder" : 4,
    "contents" : "열글자 이상의 구독 리뷰4"
  }, {
    "id" : 5,
    "imageUrl" : "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1017&q=80",
    "leakedOrder" : 5,
    "contents" : "열글자 이상의 구독 리뷰5"
  }],
  "_links" : {
    "self" : {
      "href" : "http://localhost:8080/api/home"
    },
    "profile" : {
      "href" : "/docs/index.html#resources-home-page"
    }
  }
}



export async function getServerSideProps({ req }) {
  
  let DATA = null;
  const url = '/api/home';
  const res = await getDataSSR( req, url );
  console.log(res)
  const data = res?.data || null
  if(data){
    DATA = {
      topBannerDtoList: data.topBannerDto,
      mainBannerDtoList: data.mainBannerDtoList?.length > 0 && data.mainBannerDtoList.map(list=>({
        id: list.id,
        leakedOrder: list.leakedOrder,
        name: list.name,
        pcFilename: list.pcFilename,
        pcImageUrl: list.pcImageUrl,
        pcLinkUrl: list.pcLinkUrl,
        mobileFilename: list.mobileFilename,
        mobileImageUrl: list.mobileImageUrl,
        mobileLinkUrl: list.mobileLinkUrl,
      })),
      recipeDtoList: data.recipeDtoList?.length > 0 && data.recipeDtoList.map(list=>({
        id: list.id,
        name: list.id,
        description: list.description,
        uiNameKorean: list.uiNameKorean,
        uiNameEnglish: list.uiNameEnglish,
        filename1: list.filename1,
        imageUrl1: list.imageUrl1,
        filename2: list.filename2,
        imageUrl2: list.imageUrl2,
      })),
      queryBestReviewsDtoList: data.queryBestReviewsDtoList || [],
    }
  }
  
  console.log('MAIN DATA : " ', data);


  return { props: { data:DATA } };
}
