import React, { useRef, useEffect, useState } from 'react';
import MetaTitle from '../components/atoms/MetaTitle';
import s from './mainPage.module.scss';
import Image from 'next/image';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import DeadlineTimer from '/src/components/atoms/DeadlineTimer';
import initialQuestionData from '../data/questionData';
import PaginationWithAPI from '../components/atoms/PaginationWithAPI';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import Barfraw from '/public/img/barfraw.png';
import Barfgood1 from '/public/img/barfgood1.png';
import Barfgood2 from '/public/img/barfgood2.png';
import Starter from '/public/img/main/starter.png';
import TurkeyBeef from '/public/img/main/turkeyBeef.png';
import DuckLamb from '/public/img/main/duckLamb.png';
import LambBeef from '/public/img/main/lambBeef.png';
import LeftPic from '/public/img/leftPic.png';
import midPic from '/public/img/midPic.png';
import rightPic from '/public/img/rightPic.png';
import barfPack from '/public/img/barfPack.png';
import Use01 from '/public/img/pages/home/home_howtouse_1.svg';
import Use02 from '/public/img/pages/home/home_howtouse_2.svg';
import Use03 from '/public/img/pages/home/home_howtouse_3.svg';
import Use01_m from '/public/img/pages/home/home_howtouse_1_m.svg';
import Use02_m from '/public/img/pages/home/home_howtouse_2_m.svg';
import Use03_m from '/public/img/pages/home/home_howtouse_3_m.svg';
import Arrow from '/public/img/icon/main-arrow.svg';
import { Swiper_sns } from '/src/components/home/Swiper_sns';
import { Swiper_bigdata } from '/src/components/home/Swiper_bigdata';
import { Swiper_review } from '/src/components/home/Swiper_review';
// import { Swiper_recipe } from '/src/components/home/Swiper_recipe';
import { Swiper_main } from '/src/components/home/Swiper_main';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Modal_tempPasswrod } from '/src/components/modal/Modal_tempPasswrod';
import { Modal_Popup } from '/src/components/modal/Modal_Popup';
import useDeviceState from '/util/hook/useDeviceState';
import { getTokenFromServerSide } from '/src/pages/api/reqData';
import { Tween } from 'react-gsap';
import { Controller, Scene } from 'react-scrollmagic';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ImageWithLoadingSpinner from '/src/components/atoms/ImageWithLoadingSpinner';

import { getData, postData, postObjData, putObjData } from './api/reqData';
import { deleteCookie, getCookie, setCookie } from '@util/func/cookie';
import { orderDeadLineTimeBanner } from '/util/func/orderDeadLineTimeBanner';

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

  // * ----- 정기구독 마감 시간 관련 ----- *
  const [message, setMessage] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setMessage(orderDeadLineTimeBanner());
    }, 1000);
  });

  // * ----- 단계별 방법 관련 ----- *
  const [isArrowActive, setIsArrowActive] = useState(true);
  // const [isPlusActive, setIsPlusActive] = useState(false);
  const [rotation, setRotation] = useState(180);

  const onClickArrowIcon = (e) => {
    e.preventDefault();
    setIsArrowActive(!isArrowActive);
    setRotation((prevRotation) => (prevRotation + 180) % 360);
  };

  // * ----- 질문 리스트 관련 ----- *
  const [questionData, setQuestionData] = useState(initialQuestionData);
  const onClickPlusIcon = (e, id) => {
    e.preventDefault();

    const questionIndex = questionData.findIndex((item) => item.id === id);

    if (questionIndex !== -1) {
      const updatedQuestionData = [...questionData];
      updatedQuestionData[questionIndex] = {
        ...updatedQuestionData[questionIndex],
        isPlusActive: !updatedQuestionData[questionIndex].isPlusActive,
      };
      setQuestionData(updatedQuestionData);
    }
  };

  // * ----- NOTICE ------ *
  const getListApiUrl = 'api/notices?size=5&page=0';
  const apiDataQueryString = 'queryNoticesDtoList';
  const searchPageSize = 10;

  const [isLoading, setIsLoading] = useState({});
  const [noticeList, setNoticeList] = useState([]);

  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);

  // 3초마다 다음 공지사항을 표시하기 위한 함수
  const showNextNotice = () => {
    setCurrentNoticeIndex((prevIndex) => (prevIndex + 1) % noticeList.length);
  };

  useEffect(() => {
    if (noticeList.length > 0) {
      // 3초마다 다음 공지사항을 표시하는 타이머 설정
      const timer = setInterval(() => {
        showNextNotice();
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [noticeList]);

  return (
    <>
      <MetaTitle title="바프독" />
      <Layout>
        {activeTempPasswordModal && (
          <Modal_tempPasswrod isConfirm={onClickModalButtons} />
        )}
        <Wrapper
          className={s.banner_wrapper}
          fullWidth={true}
          rowStyle={{ padding: 0 }}
        >
          {/* 스와이프주석 */}
          <Swiper_main
            className={s.banner_swiper}
            data={data?.mainBannerDtoList}
            isMobile={isMobile}
          />
          <section className={s.banner_text}>
            <p>고객만족도 ★★★★★</p>
            <p className={s.banner_text_plain}>
              &nbsp;/ 실 구매자 대상 (평균 4.9)
            </p>
          </section>
        </Wrapper>

        {/* 1. 정기구독 배송 */}
        <section className={s.deadline_main}>
          <Image
            src="/img/main/timebar.jpg"
            alt="정기구독 배송마감"
            width={4000}
            height={300}
            // objectFit="contain"
            objectFit="cover"
            // layout="responsive"
            // layout="fill"
            // style={{
            //   display: 'block',
            //   marginLeft: 'auto',
            //   marginRight: 'auto',
            // }}
            objectPosition="50% 50%"
            className={s.deadline_main_img}
          />
          <div className={s.deadline_container}>
            <div className={s.deadline_text}>
              <h3 className={s.deadline_title}>정기구독배송 주문 마감</h3>
              <h3 className={s.deadline_content}>
                곧 주문이 마감됩니다, 서둘러 주세요!
              </h3>
            </div>
            <div className={s.deadline_time_wrapper}>
              <div className={s.deadline_time}>
                <ul>
                  <li>
                    <span className={s.deadline_time_text}>일 </span>
                    <span className={s.deadline_time_sub_text}>(Days)</span>
                  </li>
                  <li>
                    <span className={s.deadline_time_text}>시간 </span>
                    <span className={s.deadline_time_sub_text}>(Hrs)</span>
                  </li>
                  <li>
                    <span className={s.deadline_time_text}>
                      &nbsp;&nbsp;&nbsp;분{' '}
                    </span>
                    <span className={s.deadline_time_sub_text}>(Min)</span>
                  </li>
                  <li>
                    <span className={s.deadline_time_text}>
                      &nbsp;&nbsp;&nbsp;&nbsp;초{' '}
                    </span>
                    <span className={s.deadline_time_sub_text}>(Sec)</span>
                  </li>
                </ul>
                <div className={s.deadline_time_number}>
                  <p>{message[0]}</p>
                  <span>:</span>
                  <p>{message[1]}</p>
                  <span>:</span>
                  <p>{message[2]}</p>
                  <span>:</span>
                  <p>{message[3]}</p>
                </div>
              </div>
              <Link href={'/surveyGuide'} passHref>
                <button>주문하기</button>
              </Link>
            </div>
          </div>
        </section>

        {/* ------- 빅데이터 기반 ------ */}
        <div className={s.swiper_bigdata_container}>
          {!isMobile && <Swiper_bigdata />}
          <Wrapper>
            <section className={s.barfgood}>
              <div className={s.inner}>
                <div className={s.leftbox}>
                  <div className={s.barfgood_textbox}>
                    <h1>
                      빅데이터 기반의
                      <br />
                      <span>과학적 맞춤 레시피</span>
                    </h1>
                    <p>
                      같은 견종이어도 다 같은 강아지가 아니기에 <br />
                      우리 아이만을 위한 맞춤형 한 끼가 필요합니다. <br />
                      <br />
                      바프독은 아이의 건강 데이터를 기반으로 <br />
                      플랜별 맞춤형 한 끼를 조리하여 전달드립니다.
                      <br />
                    </p>
                    <span className={s.ref_text}>
                      *건강데이터를 분석하여 맞춤형 한 끼로 제공
                    </span>
                  </div>
                  <div className={s.btn_box}>
                    <Link href={'/surveyGuide'} passHref>
                      <a type="button" className={s.btn_text}>
                        내 반려견도 시작하기
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </Wrapper>
          {isMobile && <Swiper_bigdata />}
        </div>

        {/* ----- 단계별 방법 -----  */}
        <Wrapper bgColor="#FAEFEF">
          <section className={s.step_main}>
            <div className={s.title_wrapper}>
              <h2 className={s.title}>
                맞춤형 펫 푸드부터 건강 관리까지, 단 3분! 아주 쉬운 방법
              </h2>
              <button className={s.step_arrow_wrapper}>
                <Image
                  src="/img/icon/main-arrow.svg"
                  alt="arrow"
                  width={20}
                  height={20}
                  className={s.arrow_icon}
                  onClick={onClickArrowIcon}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                  }}
                />
              </button>
            </div>
          </section>
        </Wrapper>
        {/* MOBILE - 단계별 */}
        {isMobile ? (
          <div className={`${s.step_box} ${isArrowActive ? s.active : ''}`}>
            <div className={s.step_main}>
              <ul>
                <li className={s.firstbox}>
                  {/* 원 */}
                  <div className={s.firstbox_left}>
                    <div className={s.step_ellipse}>
                      <div className={s.number_wrapper}>
                        <Image
                          src="/img/main/1.svg"
                          alt="1"
                          width={40}
                          height={40}
                          className={s.icon_number}
                        />
                      </div>
                    </div>
                    <div className={s.step_line}></div>
                  </div>

                  <div className={s.firstbox_right}>
                    <p className={s.step_title}>AI 추천 식단 확인</p>
                    <p className={s.step_text}>
                      자체 보유 딥러닝 기반
                      <br />
                      알고리즘 분석-맞춤 레시피 도출
                    </p>
                  </div>
                </li>

                <li className={s.firstbox}>
                  <div className={s.firstbox_left}>
                    <div className={s.step_ellipse}>
                      <div className={s.number_wrapper}>
                        <Image
                          src="/img/main/2.svg"
                          alt="2"
                          width={40}
                          height={40}
                          className={s.icon_number}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={s.firstbox_right}>
                    <p className={s.step_title}>1:1 맞춤 제조</p>
                    <p className={s.step_text}>
                      우리 아이만을 위한
                      <br />
                      일대일 맞춤형 레시피 제조
                    </p>
                  </div>
                </li>

                <li className={s.firstbox}>
                  <div className={s.firstbox_left}>
                    <div className={s.step_ellipse}>
                      <div className={s.number_wrapper}>
                        <Image
                          src="/img/main/3.svg"
                          alt="3"
                          width={40}
                          height={40}
                          className={s.icon_number}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={s.firstbox_right}>
                    <p className={s.step_title}>정기구독</p>
                    <p className={s.step_text}>
                      반려견 맞춤 식사
                      <br />
                      신선한 정기 배송 신청하기
                    </p>
                  </div>
                </li>

                <li className={s.firstbox}>
                  <div className={s.firstbox_left}>
                    <div className={s.step_ellipse}>
                      <div className={s.number_wrapper}>
                        <Image
                          src="/img/main/4.svg"
                          alt="4"
                          width={40}
                          height={40}
                          className={s.icon_number}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={s.firstbox_right}>
                    <p className={s.step_title}>건강 사후 관리</p>
                    <p className={s.step_text}>
                      맞춤 영양 급여
                      <br />
                      건강 변화 데이터 수집 및 관리
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className={`${s.step_box} ${isArrowActive ? s.active : ''}`}>
            <div className={s.step_main}>
              <ul>
                <li className={s.firstbox}>
                  <div className={s.step_ellipse}>
                    <div className={s.number_wrapper}>
                      <Image
                        src="/img/main/1.svg"
                        alt="1"
                        width={40}
                        height={40}
                        className={s.icon_number}
                      />
                    </div>
                  </div>
                  <div className={s.step_line}></div>
                  <p className={s.step_title}>AI 추천 식단 확인</p>
                  <p className={s.step_text}>
                    자체 보유 딥러닝 기반
                    <br />
                    알고리즘 분석-맞춤 레시피 도출
                  </p>
                </li>

                <li className={s.firstbox}>
                  <div className={s.step_ellipse}>
                    <div className={s.number_wrapper}>
                      <Image
                        src="/img/main/2.svg"
                        alt="2"
                        width={40}
                        height={40}
                        className={s.icon_number}
                      />
                    </div>
                  </div>
                  <p className={s.step_title}>1:1 맞춤 제조</p>
                  <p className={s.step_text}>
                    우리 아이만을 위한
                    <br />
                    일대일 맞춤형 레시피 제조
                  </p>
                </li>

                <li className={s.firstbox}>
                  <div className={s.step_ellipse}>
                    <div className={s.number_wrapper}>
                      <Image
                        src="/img/main/3.svg"
                        alt="3"
                        width={40}
                        height={40}
                        className={s.icon_number}
                      />
                    </div>
                  </div>
                  <p className={s.step_title}>정기구독</p>
                  <p className={s.step_text}>
                    반려견 맞춤 식사
                    <br />
                    신선한 정기 배송 신청하기
                  </p>
                </li>

                <li className={s.firstbox}>
                  <div className={s.step_ellipse}>
                    <div className={s.number_wrapper}>
                      <Image
                        src="/img/main/4.svg"
                        alt="4"
                        width={40}
                        height={40}
                        className={s.icon_number}
                      />
                    </div>
                  </div>
                  <p className={s.step_title}>건강 사후 관리</p>
                  <p className={s.step_text}>
                    맞춤 영양 급여
                    <br />
                    건강 변화 데이터 수집 및 관리
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}

        <Wrapper bgColor="#faf4ef">
          <section className={s.review}>
            <div className={s.inner}>
              <h2 className={s.title}>어떤 레시피들이 있나요 ?</h2>
              <p className={s.title_sub}>
                자체 저온 시설에서 건강한 식재료로 방부제 및 감미료 등 없이
                정직하게 직접 조리합니다
              </p>
              <div className={s.cont_body}>
                <Swiper_review data={data?.queryBestReviewsDtoList} />
                {/* <div className={s.redbox}>
                  <div className={s.red}></div>
                </div> */}
              </div>
            </div>
          </section>
        </Wrapper>

        {/* ---- 리뷰 ----  */}
        <Wrapper fullWidth={true}>
          <section className={s.sns}>
            <div className={s.inner}>
              <h2 className={s.title}>
                지금도 많은 반려견들이 건강해지고 있어요!
              </h2>
              <div className={s.review_header}>
                <div className={s.sales}>
                  <p>누적 판매수</p>
                  <p className={s.number}>60,586</p>
                </div>
                <div className={s.line}></div>
                <div className={s.star}>
                  <p>평균 만족도</p>
                  <p className={s.number}>4.9</p>
                </div>
              </div>
              <div className={s.cont_body}>
                <Swiper_sns />
              </div>
            </div>
            <div className={s.btn_box}>
              <a
                href="https://instagram.com/barfdog_official"
                target="_blank"
                rel="noopener noreferrer"
                type="button"
                className={s.btn_insta}
              >
                더 많은 후기 보러가기
              </a>
              <Link href={'/surveyGuide'} passHref>
                <a type="button" className={s.btn_worry}>
                  내 반려견도 건강해지기
                </a>
              </Link>
            </div>
          </section>
        </Wrapper>

        {/* ---- 질문 ----  */}
        <Wrapper bgColor="#F5F3F3">
          <section className={s.question}>
            <div className={s.title}>
              {isMobile ? (
                <>
                  <h2>
                    보호자님들께서
                    <span style={{ color: '#ca1010' }}>
                      <br />
                      자주 하시는 질문들
                    </span>
                    을 <br />
                    모아봤어요 !
                  </h2>
                  <p>
                    이곳에 궁금하신 질문이 없다면 <br />
                    우측 하단의 상담 아이콘을 통해
                    <br />
                    실시간 상담 받아보세요
                  </p>
                </>
              ) : (
                <>
                  <h2>
                    보호자님들께서{' '}
                    <span style={{ color: '#ca1010' }}>자주 하시는 질문들</span>
                    을 모아봤어요 !
                  </h2>
                  <p>
                    이곳에 궁금하신 질문이 없다면 우측 하단의 상담 아이콘을 통해
                    실시간 상담 받아보세요
                  </p>
                </>
              )}
            </div>
            <div className={s.content}>
              <ul>
                {questionData.map((question, index) => (
                  <li key={index}>
                    <div className={s.line}></div>
                    <div className={s.question_title}>
                      <h2>{question.title}</h2>
                      <div className={s.question_icon}>
                        <Image
                          src={
                            question.isPlusActive
                              ? '/img/icon/minus.svg'
                              : '/img/icon/plus.svg'
                          }
                          alt={question.isPlusActive ? 'minus' : 'plus'}
                          width={20}
                          height={20}
                          className={
                            question.isPlusActive ? s.minus_icon : s.plus_icon
                          }
                          onClick={(e) => onClickPlusIcon(e, question.id)}
                        />
                      </div>
                    </div>
                    {/* 토글 시 보이는 내용 */}
                    <div
                      className={`${s.question_answer} ${
                        question.isPlusActive ? s.active : ''
                      }`}
                    >
                      {question.content}
                    </div>
                  </li>
                ))}
                <div className={s.line}></div>
              </ul>
            </div>
          </section>
        </Wrapper>

        <Wrapper bgColor="#F9F2EC">
          <section className={s.barfraw}>
            <div className={s.inner}>
              <div className={s.leftbox}>
                <div className={s.image_wrap}>
                  <ImageWithLoadingSpinner
                    src="/img/main/bottom.jpg"
                    objectFit="cover"
                    layout="fill"
                    alt="메인 하단 이미지"
                  />
                </div>
              </div>
            </div>
          </section>
        </Wrapper>

        <Wrapper>
          <section className={s.notice}>
            <div className={s.inner}>
              <h3 className={s.title}>공지사항</h3>
              <div className={s.content}>
                <ul>
                  {noticeList.map((notice, idx) => (
                    <li
                      key={notice.id}
                      className={`${s.notice_title} ${
                        idx === currentNoticeIndex ? s.visible : ''
                      }`}
                    >
                      <h3>{noticeList[currentNoticeIndex].title}</h3>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </Wrapper>

        <PaginationWithAPI
          apiURL={getListApiUrl}
          size={searchPageSize}
          setItemList={setNoticeList}
          queryItemList={apiDataQueryString}
          setIsLoading={setIsLoading}
          routerDisabled={true}
        />
      </Layout>
      {data?.popupDtoList.length > 0 && (
        <>
          <Modal_Popup popupData={data?.popupDtoList}></Modal_Popup>
        </>
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
  return { props: { data: DATA } };
}
