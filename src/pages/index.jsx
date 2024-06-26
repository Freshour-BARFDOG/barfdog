import React, { useRef, useEffect, useState } from 'react';
import MetaTitle from '../components/atoms/MetaTitle';
import s from './mainPage.module.scss';
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
import { FaArrowRight } from 'react-icons/fa6';
import { Swiper_sns } from '/src/components/home/Swiper_sns';
import { Swiper_review } from '/src/components/home/Swiper_review';
import { Swiper_recipe } from '/src/components/home/Swiper_recipe';
import { Swiper_survey } from '/src/components/home/Swiper_survey';
import { Main_top } from '/src/components/home/Main_top';
import { Main_wedo } from '/src/components/home/Main_wedo';
import { Main_family } from '/src/components/home/Main_family';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Modal_tempPasswrod } from '/src/components/modal/Modal_tempPasswrod';
import { Modal_Popup } from '/src/components/modal/Modal_Popup';
import useDeviceState from '/util/hook/useDeviceState';
import { getTokenFromServerSide } from '/src/pages/api/reqData';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ImageWithLoadingSpinner from '/src/components/atoms/ImageWithLoadingSpinner';

import { getData, postData, postObjData, putObjData } from './api/reqData';
import { deleteCookie, getCookie, setCookie } from '@util/func/cookie';

export default function MainPage({ data }) {
  // // console.log(data)
  const router = useRouter();
  const isMobile = useDeviceState().isMobile;
  const [activeTempPasswordModal, setActiveTempPasswordModal] = useState(false);

  useEffect(() => {
    const { query } = router;
    const isTempPassword = !!query.tempPw;
    setActiveTempPasswordModal(isTempPassword);
    // 임시비밀번호 조회
  }, []);

  const onClickModalButtons = async (confirm) => {
    if (confirm) {
      await router.push('/mypage/user/changePassword');
    } else {
      setActiveTempPasswordModal(false);
    }
  };

  useEffect(() => {
    AOS.init();
  });

  // YYL 콕뱅크 쿠키 관련
  useEffect(() => {
    const alliance = router.query.alliance;

    if (alliance === 'cb') {
      setCookie('alliance', 'cb', 'hour', 1);

      // 메인으로 리다이렉트
      router.push('/');

      // (async () => {
      //   try {
      //     const url = '/api/planDiscountTest';
      //     const res = await getData(url);

      //     if (res?.status === 200) {
      //       const dataToAssign = res.data ?? {};
      //       setDataBase(dataToAssign);
      //     }
      //   } catch (err) {
      //     console.error(err);
      //   }
      // })();

      // (async () => {
      //   try {
      //     const url = '/api/alliance?alliance=cb';
      //     const res = await getData(url);

      //     // console.log(res)

      //     // console.log(document.cookie);

      //     if (res?.status === 200) {
      //       const dataToAssign = res.data ?? {};
      //       setDataBase(dataToAssign);
      //     }
      //   } catch (err) {
      //     console.error(err);
      //   }
      // })();
    }
  });

  return (
    <>
      <MetaTitle title="바프독" />
      <Layout>
        {activeTempPasswordModal && (
          <Modal_tempPasswrod isConfirm={onClickModalButtons} />
        )}

        {/* 1. 영상 소개 */}
        <Wrapper fullWidth={true} rowStyle={{ padding: 0 }}>
          <Main_top />
        </Wrapper>

        {/* [BEFORE] 메인배너 스와이퍼 */}
        {/*  <Swiper_main data={data?.mainBannerDtoList} isMobile={isMobile} /> */}

        {/* 2. 맞춤 건강문제 */}
        <Wrapper>
          <section className={`${s.recipe_info}`}>
            <div className={s.inner}>
              <h2 className={s.recipe_title}>반려견 건강에 고민이 있다면?</h2>
              <h4>75만 데이터를 분석한 AI 추천 맞춤 식단 구독</h4>
              {/* <Swiper_recipe data={data?.recipeDtoList} isMobile={isMobile} /> */}
              <Swiper_recipe
                // data={data?.queryItemsDtoList}
                isMobile={isMobile}
              />
            </div>
          </section>
        </Wrapper>

        {/* 3. 리뷰 */}
        <Wrapper>
          <section className={s.review}>
            <div className={s.inner}>
              <h2 className={s.title}>
                160,000마리 <br /> 보호자 리얼 리뷰!
              </h2>
              <div className={s.cont_body}>
                <Swiper_review data={data?.queryBestReviewsDtoList} />
                <div className={s.btn_box}>
                  <Link href="/review">
                    <a>
                      최근 리뷰 더보기
                      <FaArrowRight />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Wrapper>

        {/* 4. 따져볼수록 */}
        <Wrapper>
          <section className={s.wedo}>
            <div className={s.inner}>
              <h2 className={s.title}>
                따져볼수록 <br />
                결론은 바프독
              </h2>
              <p>늘 곁에서 함께 도와드릴게요</p>
              <div className={s.wedo_cont_body}>
                <Main_wedo />
              </div>
            </div>
          </section>
        </Wrapper>

        {/* 5. 설문조사 */}
        <Wrapper>
          <section className={s.survey}>
            <div className={s.inner}>
              <h2 className={s.title}>
                75만건의 빅데이터로 만드는 <br /> 나만의 AI 맞춤 식단
              </h2>
              <div className={s.cont_body}>
                <Swiper_survey />
              </div>
              <div className={s.text_box}>
                바프독 AI 맞춤 설문을 통해 <br />
                우리 아이의 평소 모습을 알려주세요 <br />
                (설문 소요시간 5분 내외)
              </div>
              <div className={s.btn_box}>
                <Link href="/survey">
                  <a>AI 추천 문진 START!</a>
                </Link>
              </div>
            </div>
          </section>
        </Wrapper>

        {/* 6. 인증 */}
        <Wrapper>
          <section className={s.family}>
            <div className={s.inner}>
              <h2 className={s.title}>
                내 가족이 먹는 <br /> 안심 식단
              </h2>
              <p>
                비교해 볼수록, 고민해 볼수록, 찾아볼수록,
                <br />
                바프독은 최고의 서비스를 제공합니다
              </p>
              <Main_family />
              <h3>
                바프독의 제품 안심하고 드실 수 있도록 <br /> 항상 최선을 다해
                만들겠습니다
              </h3>
            </div>
          </section>
        </Wrapper>

        {/* [삭제예정] 이미지 */}
        {/* 
        <Wrapper bgColor="#F9F2EC">
          <section className={s.barfraw}>
            <div className={s.inner}>
              <div className={s.leftbox}>
                <div className={s.image_wrap}>
                  <ImageWithLoadingSpinner
                    src={Barfraw}
                    objectFit="cover"
                    layout="fill"
                    alt="바프 생식 이미지"
                  />
                </div>
              </div>
              <div className={s.rightbox}>
                <p>ABOUT BARF</p>
                <h1>바프식이란?</h1>
                <h3>
                  &nbsp;B.A.R.F.(Biologically Appropriate Raw Food)는
                  생물학적으로 적절한 생식이라는 뜻으로, 생고기와 뼈, 야채를
                  적절히 배합하여 반려동물에게 단백질과 지방을 신선한 상태에서
                  섭취할 수 있도록 돕는 식단을 뜻합니다.
                  <br />
                  바프독의 모든 레시피는 고기와 뼈, 내장, 신선한 야채를 완벽한
                  비율로 배합하여 건강한 영양을 공급합니다.
                </h3>
              </div>
            </div>
          </section>
        </Wrapper> */}

        {/* [삭제] 바프생식 바뀌는 점 */}
        {/* <Wrapper>
          <section className={s.barfgood}>
            <ul className={s.inner}>
              <li className={s.leftbox}>
                <div className={s.barfgood_textbox}>
                  <h1>
                    생식을 하면
                    <br />
                    어떤점이 바뀔까요?
                  </h1>
                  <p>
                    &nbsp;BARF(Biologically Appropriate Raw Food)는 생물학적으로
                    적절한 생식이라는 뜻으로, 생고기와 뼈, 야채를 적절히
                    배합하여 반려동물에게 단백질과 지방을 신선한 상태에서 섭취할
                    수 있도록 돕습니다. 바프독은 70%의 두 종류 고기와 칼슘이
                    풍부한 뼈, 내장, 신선한 야채를 배합해 완벽한 비율의 영양을
                    공급합니다.
                  </p>
                </div>
              </li>
              <li className={s.rightbox}>
                <div className={s.barfgood_imgbox}>
                  <div className={s.barfood1}>
                    <ImageWithLoadingSpinner
                      src={Barfgood1}
                      objectFit="fit"
                      width={560}
                      height={456}
                      alt="카드 이미지"
                    />
                  </div>
                  <div className={s.barfood2}>
                    <ImageWithLoadingSpinner
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
        </Wrapper> */}

        {/* 차별점 그림 3개  */}
        {/* <Wrapper bgColor="#F9F2EC">
          <div className={s.difference2_inner}>
            <p>CEHCK POINT</p>
            <h1>바프독을 선택해야 하는 이유</h1>
          </div>
          <section className={s.difference2}>

            <ul>
              <li className={s.firstbox}>
                <p className={s.title}>
                  완벽한 영양구성
                  <br />
                  Real B.A.R.F.
                </p>
                <ImageWithLoadingSpinner
                  src={LeftPic}
                  objectFit="fit"
                  width={260}
                  height={260}
                  alt="카드 이미지"
                />
                <p className={s.text}>
                  생고기, 뼈, 내장, 채소와 과일을
                  <br />
                  완벽한 비율로 구성한 건강한 한끼
                </p>
              </li>

              <li className={s.midbox}>
                <p className={s.title}>
                  국내최초 국내유일
                  <br />
                  Double meats
                </p>
                <ImageWithLoadingSpinner
                  src={midPic}
                  objectFit="fit"
                  width={260}
                  height={260}
                  alt="카드 이미지"
                />
                <p className={s.text}>
                  모든 레시피에 두 가지 고기를
                  <br />
                  풍부하게 담은 균형잡힌 한끼
                </p>
              </li>

              <li className={s.firstbox}>
                <p className={s.title}>
                  미국사료협회 영양기준
                  <br />
                  AAFCO
                </p>
                <ImageWithLoadingSpinner
                  src={rightPic}
                  objectFit="fit"
                  width={260}
                  height={260}
                  alt="카드 이미지"
                />
                <p className={s.text}>
                  국제 기준(AAFCO)부터 NRC, fediaf까지
                  <br />
                  모든 영양 가이드라인을 준수
                </p>
              </li>
            </ul>
          </section>
        </Wrapper> */}

        {/* [삭제] 고민 */}
        {/* <Wrapper bgColor="#F9F2EC">
          <section
            className={s.clientWorry}
            style={{ backgroundColor: '#F9F2EC' }}
          >
            <div className={`${s.inner} clearfix`}>
              <div className={`${s['cont-left']} cont-left`}>
                <div className={s.title_section}>
                  <h2 className={s.title}>
                    혹시 이런 고민
                    <br />
                    해본적 있으신가요?
                  </h2>
                  <p className={s.subtitle}>
                    반려견이 평생 다양한 ‘사료’만 먹는다는 것은 인스턴트 음식만
                    평생 먹는다는 것과 같습니다.
                    <br />
                    <br />
                    반려견과 행복하고 건강하게 지낼 수 있도록 바프독이
                    도와드릴게요!
                  </p>
                  <Link passHref href={'/recipes'}>
                    <a type="button" className={`${s.btn_worry}`}>
                      바프생식 둘러보기
                    </a>
                  </Link>
                </div>
              </div>
              <div className={`${s['cont-right']} cont-right`}>
                <div className={s.cont_section}>
                  <ul className={s.clearfix}>
                    <li>
                      <div className={s.card}>
                        <div className={`${s['img-wrap']} img-wrap`}>
                          <ImageWithLoadingSpinner
                            src={require('/public/img/pages/home/home_clientWorry.png')}
                            objectFit="cover"
                            layout="fill"
                            alt="카드 이미지"
                          />
                        </div>
                        <p className={s.card_title}>견주님의 고민</p>
                        <div className={s.details}>
                          <ul>
                            <li>
                              생식을 시도하고 싶지만 공부해야할 것이 많고
                              반려견이 잘 적응할 수 있을지 걱정이 돼요
                            </li>
                            <li>
                              기존에 건사료 등을 급여하던 중 건강이 나빠진
                              반려견을 위해 생식을 급여하고 싶어요
                            </li>
                            <li>
                              반려견 입맛이 까다로워서 매번 새로운 사료를
                              찾아야해요
                            </li>
                            <li>
                              생식에 대해서는 잘 알지만 매번 집에서 만들고
                              소분하는 것이 힘들어졌어요
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className={s.card}>
                        <div className={`${s['img-wrap']} img-wrap`}>
                          <ImageWithLoadingSpinner
                            src={require('/public/img/pages/home/home_clientWorry@2x.png')}
                            objectFit="cover"
                            layout="fill"
                            alt="카드 이미지"
                          />
                        </div>
                        <p className={s.card_title}>반려견의 건강 상태</p>
                        <div className={s.details}>
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
                  <Link passHref href={'/recipes'}>
                    <a type="button" className={`${s.btn_worry2}`}>
                      바프생식 둘러보기
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Wrapper> */}
      </Layout>
      {data?.popupDtoList.length > 0 && (
        <Modal_Popup popupData={data?.popupDtoList}></Modal_Popup>
      )}
    </>
  );
}

export async function getServerSideProps({ req }) {
  let DATA = null;
  const apiUrl = '/api/home';
  let homeApi_res = null;
  const token = getTokenFromServerSide(req) || null;

  try {
    homeApi_res = await axios
      .get(apiUrl, {
        headers: {
          authorization: token,
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        // // console.log(res);
        return res;
      })
      .catch((err) => {
        // // console.log(err.response)
        return err.response;
      });

    const data = homeApi_res?.data || null;
    // const data = DUMMY_DATA;
    if (data) {
      DATA = {
        topBannerDtoList: data.topBannerDto || [],
        mainBannerDtoList:
          data.mainBannerDtoList?.length > 0
            ? data.mainBannerDtoList.map((list) => ({
                id: list.id,
                leakedOrder: list.leakedOrder,
                name: list.name,
                pcFilename: list.pcFilename,
                pcImageUrl: list.pcImageUrl,
                pcLinkUrl: list.pcLinkUrl,
                mobileFilename: list.mobileFilename,
                mobileImageUrl: list.mobileImageUrl,
                mobileLinkUrl: list.mobileLinkUrl,
                targets: list.targets,
              }))
            : [],
        recipeDtoList:
          data.recipeDtoList?.length > 0
            ? data.recipeDtoList.map((list) => ({
                id: list.id,
                name: list.id,
                description: list.description,
                uiNameKorean: list.uiNameKorean,
                uiNameEnglish: list.uiNameEnglish,
                filename1: list.filename1,
                imageUrl1: list.imageUrl1,
                filename2: list.filename2,
                imageUrl2: list.imageUrl2,
              }))
            : [],
        queryBestReviewsDtoList: data.queryBestReviewsDtoList || [],
        popupDtoList:
          data.popupBannerDtoList?.map((list) => ({
            id: list.id,
            position: list.position,
            name: list.name,
            leakedOrder: list.leakedOrder,
            pcFilename: list.pcFilename,
            pcImageUrl: list.pcImageUrl,
            pcLinkUrl: list.pcLinkUrl,
            mobileFilename: list.mobileFilename,
            mobileImageUrl: list.mobileImageUrl,
            mobileLinkUrl: list.mobileLinkUrl,
          })) || [],
      };
    }
  } catch (err) {
    console.error(err);
    return err.response;
  }
  // // console.log('MAIN DATA :', DATA);
  return { props: { data: DATA || {} } };
}

//
// const DUMMY_DATA = {
//   topBannerDto: {
//     name: 'top Banner name',
//     backgroundColor: 'red',
//     fontColor: 'write',
//     pcLinkUrl: 'pc link url',
//     mobileLinkUrl: 'mobile link url',
//   },
//   mainBannerDtoList: [
//     {
//       id: 1,
//       leakedOrder: 1,
//       name: '메인배너1',
//       pcFilename: 'aa402238-f0a7-43c0-a2a6-b297debf511c_mainBanner1.jpg',
//       pcImageUrl: 'https://shop-phinf.pstatic.net/20210930_23/16329707437275Bauq_PNG/pc.png',
//       pcLinkUrl: '/admin',
//       mobileFilename: '7292ae0e-bd45-4213-89ec-8733a8018a09_mainBanner1.jpg',
//       mobileImageUrl: 'https://shop-phinf.pstatic.net/20210930_23/16329707437275Bauq_PNG/pc.png',
//       mobileLinkUrl: '',
//     },
//     {
//       id: 2,
//       leakedOrder: 2,
//       name: '메인배너2',
//       pcFilename:
//         'https://shop-phinf.pstatic.net/20220218_290/1645167736891rKnQ7_PNG/B4EBC1F6_1_BBE7BABB_5150x.png',
//       pcLinkUrl: '',
//       mobileFilename: 'c9782799-f806-47bf-b146-992be5926c2e_mainBanner2.jpg',
//       pcImageUrl:
//         'https://shop-phinf.pstatic.net/20220218_290/1645167736891rKnQ7_PNG/B4EBC1F6_1_BBE7BABB_5150x.png',
//       mobileImageUrl:
//         'https://shop-phinf.pstatic.net/20220218_290/1645167736891rKnQ7_PNG/B4EBC1F6_1_BBE7BABB_5150x.png',
//       mobileLinkUrl: '',
//     },
//     {
//       id: 3,
//       leakedOrder: 3,
//       name: '메인배너3',
//       pcFilename: '882fa69b-1d10-4899-86f8-54a80fa717d9_mainBanner3.jpg',
//       pcImageUrl:
//         'https://shop-phinf.pstatic.net/20220126_205/1643164587468rOJb1_PNG/B4EBC1F6_1_BBE7BABB_4.png',
//       pcLinkUrl: '',
//       mobileFilename: 'b0d23f3c-9a8d-4051-a7c1-f24d452718be_mainBanner3.jpg',
//       mobileImageUrl:
//         'https://shop-phinf.pstatic.net/20220126_205/1643164587468rOJb1_PNG/B4EBC1F6_1_BBE7BABB_4.png',
//       mobileLinkUrl: '',
//     },
//     {
//       id: 4,
//       leakedOrder: 4,
//       name: '메인배너4',
//       pcFilename:
//         'https://images.unsplash.com/photo-1571562110290-08784605c218?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//       pcImageUrl: 'https://shop-phinf.pstatic.net/20211019_115/16346276123656K9V0_PNG/PC.png',
//       pcLinkUrl: '',
//       mobileFilename:
//         'https://images.unsplash.com/photo-1571562110290-08784605c218?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//       mobileImageUrl: 'https://shop-phinf.pstatic.net/20211019_115/16346276123656K9V0_PNG/PC.png',
//       mobileLinkUrl: '',
//     },
//   ],
//   recipeDtoList: [
//     {
//       id: 16,
//       name: '램비프',
//       description:
//         '레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명',
//       uiNameKorean: '레시피 한글',
//       uiNameEnglish: 'RECIPE ENGLISH',
//       filename1: '램비프1.jpg',
//       imageUrl1:
//         'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
//       filename2: '램비프2.jpg',
//       imageUrl2:
//         'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
//     },
//     {
//       id: 15,
//       name: '덕램',
//       description: '레시피 설명',
//       uiNameKorean: '레시피 한글',
//       uiNameEnglish: 'RECIPE ENGLISH',
//       filename1: '덕램1.jpg',
//       imageUrl1:
//         'https://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//       filename2: '덕램2.jpg',
//       imageUrl2:
//         'hhttps://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80g',
//     },
//     {
//       id: 14,
//       name: '터키비프',
//       description: '레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명레시피 설명',
//       uiNameKorean: '레시피 한글',
//       uiNameEnglish: 'RECIPE ENGLISH',
//       filename1: '터키비프1.jpg',
//       imageUrl1:
//         'https://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//       filename2: '터키비프2.jpg',
//       imageUrl2:
//         'https://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//     },
//     {
//       id: 13,
//       name: '스타트',
//       description:
//         '레시피 설명222레시피 설명222레시피 설명222레시피 설명222레시피 설명222레시피 설명222',
//       uiNameKorean: '레시피 한글',
//       uiNameEnglish: 'RECIPE ENGLISH',
//       filename1: '스타트1.jpg',
//       imageUrl1:
//         'https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2092&q=80',
//       filename2: '스타트2.jpg',
//       imageUrl2:
//         'https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2092&q=80g',
//     },
//   ],
//   queryBestReviewsDtoList: [
//     {
//       id: 1,
//       imageUrl:
//         'https://images.unsplash.com/photo-1422565096762-bdb997a56a84?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//       leakedOrder: 1,
//       contents:
//         '열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1',
//     },
//     {
//       id: 2,
//       imageUrl:
//         'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//       leakedOrder: 2,
//       contents:
//         '열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2열글자 이상의 내용2',
//     },
//     {
//       id: 3,
//       imageUrl:
//         'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80',
//       leakedOrder: 3,
//       contents: '열글자 이상의 내용3',
//     },
//     {
//       id: 4,
//       imageUrl:
//         'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80',
//       leakedOrder: 4,
//       contents: '열글자 이상의 구독 리뷰4',
//     },
//     {
//       id: 5,
//       imageUrl:
//         'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1017&q=80',
//       leakedOrder: 5,
//       contents: '열글자 이상의 구독 리뷰5',
//     },
//   ],
//   popupBannerDtoList: [
//     {
//       id: 1,
//       position: 'left',
//       leakedOrder:1,
//       pcFilename: 'PC파일명1',
//       pcImageUrl: 'https://images.unsplash.com/photo-1647350650908-c78791bf8efd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
//       pcLinkUrl: '/recipes',
//       mobileFilename: '모바일 파일명1',
//       mobileImageUrl: 'https://images.unsplash.com/photo-1648139731984-56bcce3b86e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
//       mobileLinkUrl: '/surveyGuide',
//     },
//     {
//       id: 2,
//       position: 'center',
//       leakedOrder:2,
//       pcFilename: 'PC파일명1',
//       pcImageUrl: 'https://images.unsplash.com/photo-1659787050050-d5aa2b1ec0dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1009&q=80',
//       pcLinkUrl: '/recipes',
//       mobileFilename: '모바일 파일명1',
//       mobileImageUrl: 'https://images.unsplash.com/photo-1658246944434-04b7ec2cb7f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
//       mobileLinkUrl: '/surveyGuide',
//     },
//     {
//       id: 3,
//       position: 'right',
//       leakedOrder:3,
//       pcFilename: 'PC파일명1',
//       pcImageUrl: 'https://images.unsplash.com/photo-1634832802370-164cf82ec82a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
//       pcLinkUrl: '/recipes',
//       mobileFilename: '모바일 파일명1',
//       mobileImageUrl: 'https://images.unsplash.com/photo-1656519966579-da21868b7ed7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2093&q=80',
//       mobileLinkUrl: '/surveyGuide',
//     },
//     {
//       id: 4,
//       position: 'left',
//       leakedOrder:4,
//       pcFilename: 'PC파일명1',
//       pcImageUrl: 'https://images.unsplash.com/photo-1647350650908-c78791bf8efd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
//       pcLinkUrl: '/recipes',
//       mobileFilename: '모바일 파일명1',
//       mobileImageUrl: 'https://images.unsplash.com/photo-1648139731984-56bcce3b86e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
//       mobileLinkUrl: '/surveyGuide',
//     },
//     {
//       id: 5,
//       position: 'center',
//       leakedOrder:6,
//       pcFilename: 'PC파일명1',
//       pcImageUrl: 'https://images.unsplash.com/photo-1659787050050-d5aa2b1ec0dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1009&q=80',
//       pcLinkUrl: '/recipes',
//       mobileFilename: '모바일 파일명1',
//       mobileImageUrl: 'https://images.unsplash.com/photo-1658246944434-04b7ec2cb7f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
//       mobileLinkUrl: '/surveyGuide',
//     },
//     {
//       id: 6,
//       position: 'right',
//       leakedOrder:7,
//       pcFilename: 'PC파일명1',
//       pcImageUrl: 'https://images.unsplash.com/photo-1634832802370-164cf82ec82a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
//       pcLinkUrl: '/recipes',
//       mobileFilename: '모바일 파일명1',
//       mobileImageUrl: 'https://images.unsplash.com/photo-1656519966579-da21868b7ed7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2093&q=80',
//       mobileLinkUrl: '/surveyGuide',
//     },
//   ],
//   _links: {
//     self: {
//       href: 'http://localhost:8080/api/home',
//     },
//     profile: {
//       href: '/docs/index.html#resources-home-page',
//     },
//   },
// };
