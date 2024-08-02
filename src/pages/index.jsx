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
