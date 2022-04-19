import React, { useEffect, useState, useRef } from "react";
import Styles from '/styles/css/index.module.scss'
import Layout from '/src/components/common/Layout'
import Wrapper from "/src/components/common/Wrapper";
import Link from 'next/link';
import { useRouter } from "next/router";

//////////////////////////////////////////////////
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Navigation } from "swiper";
//필요한것만 두개중 가져가면됨
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";


import ArrowLeft from '/public/img/icon/swiper-arrow-large-l.svg';
import ArrowRight from "/public/img/icon/swiper-arrow-large-r.svg";
import ArrowLeft_m from "/public/img/icon/swiper-arrow-medium.svg";
import ArrowRight_m from "/public/img/icon/swiper-arrow-medium-style2.svg";
import ArrowLeft_s from "/public/img/icon/swiper-arrow-small-l.svg";
import ArrowRight_s from "/public/img/icon/swiper-arrow-small-r.svg";
//////////////////////////////////////////////////

/* Images */
import Image from "next/image";
import Mainbanner from '/public/img/testBanner.png';
import StartBanner from '/public/img/starterBanner.png';
import SubscribeBtn from '/public/img/subscribeBtn.png'
import Barfraw from '/public/img/barfraw.png'
import Barfgood1 from '/public/img/barfgood1.png'
import Halftest from '/public/img/Halftest.png'
import LeftPic from '/public/img/LeftPic.png'
import midPic from '/public/img/midPic.png'
import rightPic from '/public/img/rightPic.png'
import barfPack from '/public/img/barfPack.png'





function Swiper_main() {
  const navPrev_mainRef = useRef(null);
  const navNext_mainRef = useRef(null);

  const AllImageData = [
    {
      imgPath:
        "https://shop-phinf.pstatic.net/20210930_23/16329707437275Bauq_PNG/pc.png",
    },
    {
      imgPath:
        "https://shop-phinf.pstatic.net/20220218_290/1645167736891rKnQ7_PNG/B4EBC1F6_1_BBE7BABB_5150x.png",
    },
    {
      imgPath:
        "https://shop-phinf.pstatic.net/20220126_205/1643164587468rOJb1_PNG/B4EBC1F6_1_BBE7BABB_4.png",
    },
    {
      imgPath:
        "https://shop-phinf.pstatic.net/20211019_115/16346276123656K9V0_PNG/PC.png",
    },
  ];


  const swiperSettings_main = {
    className: `${Styles.swiper_main}`,
    spaceBetween: 0,
    loop: true,
    effect: "fade",
    centeredSlides: true,
    autoplay: { delay: 500, disableOnInteraction: false },
    slidesPerView: 1,
    navigation: {
      prevEl: navPrev_mainRef.current,
      nextEl: navNext_mainRef.current,
    },
    modules: [Navigation, EffectFade],
  };


  return (
    <div className={Styles.swiper_main_outerWrap}>
      <div className={Styles.swiper_navigation_container}>
        <i className={Styles["swiper-button-prev"]} ref={navPrev_mainRef}>
          <ArrowLeft />
        </i>

        <i
          className={Styles["swiper-button-next"]}
          ref={navNext_mainRef}
        >
          <ArrowRight />
        </i>
      </div>

      <Swiper
        {...swiperSettings_main}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrev_mainRef.current;
          swiper.params.navigation.nextEl = navNext_mainRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        // onRealIndexChange={() => {
        //   console.log("change!");
        // }}
      >
        {AllImageData.map((data, index) => (
          <SwiperSlide key={index}>
            <section className={Styles.banner}>
              <div className={Styles.inner}>
                <div className={`${Styles["img-wrap"]} img-wrap clearfix`}>
                  <Link href="/" passHref>
                    <a>
                      <Image
                        src={data.imgPath}
                        objectFit="cover"
                        objectPosition="50% 50%"
                        layout="fill"
                        alt="메인배너 이미지2"
                      ></Image>
                    </a>
                  </Link>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}








function Swiper_review() {

  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isReachedEnd, setIsReachedEnd] = useState(false);
  const router = useRouter();

    useEffect(() => {
      window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
    }, [isMobile, isReachedEnd]);



  const swiperSettings_review = {
    className: `${Styles.swiper_review}`,
    spaceBetween: 40,
    // loop: true,
    centeredSlides: false,
    slidesPerView: isMobile ? 1 : 3,
    //모바일 에서는 1개 pc에서는 3개
    pagination: {
      clickable: true,
    },
    navigation: {
      prevEl: navPrevRef.current,
      nextEl: navNextRef.current,
    },
    modules: [Pagination, Navigation],
    //존재하면 쓸수있음
  };


  const ArrowRight_withLink = () => {
    return (
      <>
        <ArrowRight_m />
        <Link href="/community/review" passHref>
          <a onClick={() => {
              router.push("/community/review");
            }}
          >
            더보기
          </a>
        </Link>
      </>
    );
  };


  function hideMoreView (e) {
    const slideLength = e.slides.length;
    if (slideLength && e.realIndex !== slideLength) {
      setIsReachedEnd(false);
    }
  }


  function showMoreView () {
    setIsReachedEnd(true);
  }


  return (
    <div className={Styles.swiper_review_outerWrap}>
      <i className={Styles["swiper-button-prev"]} ref={navPrevRef}>
        <ArrowLeft_m />
      </i>
      <i className={Styles["swiper-button-next"]} ref={navNextRef}>
        <ArrowRight_withLink />
      </i>
      <Swiper
        {...swiperSettings_review}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.params.pagination.el;
          swiper.params.pagination.el.classList.add(
            "swiper-pagination__reviewSection"
          );
          swiper.params.pagination.el.classList.add(
            Styles["swiper-pagination__reviewSection"]
          );
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
          swiper.pagination.destroy();
          swiper.pagination.init();
          swiper.pagination.update();
        }}
        onActiveIndexChange={hideMoreView}
        onReachEnd={showMoreView}
      >
        <SwiperSlide className={Styles.slide}>
          <div className={`${Styles["img-wrap"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_1.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <div className={`${Styles["img-wrap2"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_quotation.png")}
              objectFit="contain"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <p>11저희강아지 밥 다먹고 빈그릇 핥는거 7년 키우면서 첨봄.. 굿굿</p>
        </SwiperSlide>
        <SwiperSlide className={Styles.slide}>
          <div className={`${Styles["img-wrap"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_2.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <div className={`${Styles["img-wrap2"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_quotation.png")}
              objectFit="contain"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <p>
            22진짜 잘먹어요 ;; 생식은 다 잘먹는다고해서 타업체샀다가 안먹어서
            포기했는데ㅠㅠ사료는 눈물터져서 다시 막 찾다가 바프독차? 집...
          </p>
        </SwiperSlide>
        <SwiperSlide className={Styles.slide}>
          <div className={`${Styles["img-wrap"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_3.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <div className={`${Styles["img-wrap2"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_quotation.png")}
              objectFit="contain"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <p>
            33친구네 시바에게 선물했는데 생식 처음 도전이었는데도 아주 잘
            먹었다고 합니다. 친구가 마진도 생각 안 하시는 거 같다고 아가는 잘...
          </p>
        </SwiperSlide>
        <SwiperSlide className={Styles.slide}>
          <div className={`${Styles["img-wrap"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_1.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <div className={`${Styles["img-wrap2"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_quotation.png")}
              objectFit="contain"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <p>44저희강아지 밥 다먹고 빈그릇 핥는거 7년 키우면서 첨봄..</p>
        </SwiperSlide>
        <SwiperSlide className={Styles.slide}>
          <div className={`${Styles["img-wrap"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_2.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <div className={`${Styles["img-wrap2"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/home/home_review_quotation.png")}
              objectFit="contain"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          <p>
            55진짜 잘먹어요 ;; 생식은 다 잘먹는다고해서 타업체샀다가 안먹어서
            포기했는데ㅠㅠ사료는 눈물터져서 다시 막 찾다가 바프독차? 집...
          </p>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}





function Swiper_sns() {
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  

  const swiperSettings_sns = {
    className: `${Styles.swiper_sns}`,
    spaceBetween: 60,
    loop: true,
    centeredSlides: false, // 가운데 갈지 말지 고민
    slidesPerView: isMobile ? 2 : 4, //모바일 에서는 1개 pc에서는 2개
    navigation: {
      prevEl: navPrevRef.current,
      nextEl: navNextRef.current,
    },
    modules: [Navigation], //존재하면 쓸수있음
  };



  return (
    <div className={Styles.swiper_sns_outerWrap}>
      <i className={Styles["swiper-button-prev"]} ref={navPrevRef}>
        <ArrowLeft_s />
      </i>
      <i className={Styles["swiper-button-next"]} ref={navNextRef}>
        <ArrowRight_s />
      </i>
      <Swiper {...swiperSettings_sns}>
        <SwiperSlide
          style={{
            height: "244px",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <Link href="/" passHref>
            <a>
              <div className={`${Styles["img-wrap"]} img-wrap`}>
                <Image
                  src={require("/public/img/pages/home/home_sns_1.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </a>
          </Link>
        </SwiperSlide>
        <SwiperSlide
          style={{
            height: "244px",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <Link href="/" passHref>
            <a>
              <div className={`${Styles["img-wrap"]} img-wrap`}>
                <Image
                  src={require("/public/img/pages/home/home_sns_2.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </a>
          </Link>
        </SwiperSlide>
        <SwiperSlide
          style={{
            height: "244px",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <Link href="/" passHref>
            <a>
              <div className={`${Styles["img-wrap"]} img-wrap`}>
                <Image
                  src={require("/public/img/pages/home/home_sns_3.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </a>
          </Link>
        </SwiperSlide>
        <SwiperSlide
          style={{
            height: "244px",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <Link href="/" passHref>
            <a>
              <div className={`${Styles["img-wrap"]} img-wrap`}>
                <Image
                  src={require("/public/img/pages/home/home_sns_4.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </a>
          </Link>
        </SwiperSlide>
        {/* <SwiperSlide style={{height:"244px",backgroundColor:'var(--color-bg)'}}>Slide 5</SwiperSlide> */}
        {/* <SwiperSlide style={{height:"244px",backgroundColor:'var(--color-bg)'}}>Slide 6</SwiperSlide> */}
      </Swiper>
    </div>
  );
}





function Home() {

  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);




  return (
    <Layout>
      {/* <Wrapper bgColor="#fbf7f6" fullWidth={true}> */}
      <Wrapper fullWidth={true}>
        {/* 스와이프주석 */}
        <Swiper_main />
      </Wrapper>

      {/* 섹션1 레시피 4가지 소개*/}
      <Wrapper>
        <section className={Styles.recipe_info}>
          <div className={Styles.inner}>
            <p className={Styles.text}>&quot;진짜 생식&#34;</p>
            <p className={Styles.text}>바프독의 4가지 레시피</p>

            {/* 바프독의 4가지 레시피 소개 */}
            <div className={Styles.ulbox}>
              <ul className="clearfix">
                <li>
                  <div className={Styles.starter_banner}>
                    <div className={Styles.box}>
                      <div className={Styles.firstbox}>
                        <Image
                          src={StartBanner}
                          objectFit="cover"
                          layout="fill"
                          alt=""
                        ></Image>
                      </div>
                      <div className={Styles.secondbox}>스타터 프리미엄</div>
                      <div className={Styles.pbox}>
                        <p>#까다로운 식습관 개선</p>
                        <p>#기관지 염증 완화</p>
                        <p>#건강한 성장, 건강한 영양</p>
                      </div>
                      <div className={Styles.btnbox}>
                        <div className={Styles.btn}>+ 더보기</div>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div className={Styles.starter_banner}>
                    <div className={Styles.box}>
                      <div className={Styles.firstbox}>
                        <Image
                          src={StartBanner}
                          objectFit="cover"
                          layout="fill"
                          alt=""
                        ></Image>
                      </div>

                      <div className={Styles.secondbox}>스타터 프리미엄</div>

                      <div className={Styles.pbox}>
                        <p>#까다로운 식습관 개선</p>
                        <p>#기관지 염증 완화</p>
                        <p>#건강한 성장, 건강한 영양</p>
                      </div>

                      <div className={Styles.btnbox}>
                        <div className={Styles.btn}>+ 더보기</div>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div className={Styles.starter_banner}>
                    <div className={Styles.box}>
                      <div className={Styles.firstbox}>
                        <Image
                          src={StartBanner}
                          objectFit="cover"
                          layout="fill"
                          alt=""
                        ></Image>
                      </div>

                      <div className={Styles.secondbox}>스타터 프리미엄</div>

                      <div className={Styles.pbox}>
                        <p>#까다로운 식습관 개선</p>
                        <p>#기관지 염증 완화</p>
                        <p>#건강한 성장, 건강한 영양</p>
                      </div>

                      <div className={Styles.btnbox}>
                        <div className={Styles.btn}>+ 더보기</div>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div className={Styles.starter_banner}>
                    <div className={Styles.box}>
                      <div className={Styles.firstbox}>
                        <Image
                          src={StartBanner}
                          objectFit="cover"
                          layout="fill"
                          alt=""
                        ></Image>
                      </div>

                      <div className={Styles.secondbox}>스타터 프리미엄</div>

                      <div className={Styles.pbox}>
                        <p>#까다로운 식습관 개선</p>
                        <p>#기관지 염증 완화</p>
                        <p>#건강한 성장, 건강한 영양</p>
                      </div>

                      <div className={Styles.btnbox}>
                        <div className={Styles.btn}>+ 더보기</div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>{" "}
            {/* 바프독의 4가지 레시피 소개 끝 */}
            <div className={Styles.box22}>
              <div className={Styles.btnbox}>
                <Link href="/survey" passHref>
                  <a>
                    <Image
                      src={SubscribeBtn}
                      objectFit="cover"
                      layout="fill"
                      alt=""
                    />{" "}
                  </a>
                </Link>
              </div>
            </div>
          </div>{" "}
          {/* inner end */}
        </section>
      </Wrapper>

      {/* 바프생식이란? */}
      <Wrapper bgColor="#F9F2EC">
        <section className={Styles.barfraw}>
          <div className={Styles.inner}>
            <div className={Styles.leftbox}>
              <Image src={Barfraw} objectFit="cover" layout="fill" alt="" />
            </div>
            <div className={Styles.rightbox}>
              <p>ABOUT BARF</p>
              <h1>바프생식이란?</h1>
              <h3 className="font-NotoSans">
                {" "}
                BARF(Biologi cally Appropriate Raw Food)는 생물학적으로 적절한
                생식이라는 뜻으로, 생고기와 뼈, 야채를 적절히 배합하여
                반려동물에게 단백질과 지방을 신선한 상태에서 섭취할 수 있도록
                돕습니다. 바프독은 70%의 두 종류 고기와 칼슘이 풍부한 뼈, 내장,
                신선한 야채를 배합해 완벽한 비율의 영양을 공급합니다.
              </h3>
            </div>
          </div>{" "}
          {/* inner end */}
        </section>
      </Wrapper>

      {/* 바프생식 바뀌는 점 */}
      <Wrapper>
        <section className={Styles.barfgood}>
          <div className={Styles.inner}>
            <div className={Styles.leftbox}>
              <h1>
                생식을 하면
                <br />
                어떤점이 바뀔까요?
              </h1>
              <p>
                BARF(Biologi cally Appropriate Raw Food)는 생물학적으로 적절한
                생식이라는 뜻으로, 생고기와 뼈, 야채를 적절히 배합하여
                반려동물에게 단백질과 지방을 신선한 상태에서 섭취할 수 있도록
                돕습니다. 바프독은 70%의 두 종류 고기와 칼슘이 풍부한 뼈, 내장,
                신선한 야채를 배합해 완벽한 비율의 영양을 공급합니다.
              </p>
            </div>
            <div className={Styles.rightbox}>
              <div>
                <Image src={Barfgood1} alt="" />
              </div>
            </div>
          </div>
        </section>
      </Wrapper>

      {/* 차별점 그림 아직 구현안됨 */}
      <Wrapper>
        <section className={Styles.difference}>
          <div className={Styles.inner}>
            <p>check point</p>
            <h1>바프독을 선택해야 하는 이유</h1>
            <Image src={Halftest} alt=""></Image>
          </div>
        </section>
      </Wrapper>

      {/* 차별점 그림3개  */}
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
              <Image src={LeftPic} alt="" />
              <p className={Styles.text}>
                생고기, 칼슘이 풍부한 뼈, 신선한 야채를 완벽한 비율로 구성해
                반려견이 필요한 영양분을 골고루 섭취 할 수 있습니다.
              </p>
            </li>

            <li className={Styles.midbox}>
              <p className={Styles.title}>
                국내최초 국내유일
                <br />
                double meats
              </p>
              <Image src={midPic} alt="" />
              <p className={Styles.text}>
                전문가들은 균형잡힌 식사를 위해 한끼에 두가지 이상의 고기를
                섭취하도록 권장합니다. 바프독은 모든 레시피에 두가지 고기를
                풍부하게 담았습니다.
              </p>
            </li>

            <li className={Styles.firstbox}>
              <p className={Styles.title}>
                미국사료협회 영양기준
                <br />
                AAFCO
              </p>
              <Image src={rightPic} alt="" />
              <p className={Styles.text}>
                미국 사료협회 AAFCO에서 제시한 펫푸드 영양성분 가이드라인을
                충족하며 고단백, 고영양의 프리미엄 맞춤형 생식을 제공합니다.
              </p>
            </li>
          </ul>
        </section>
      </Wrapper>

      {/* 프리미엄바프 사진 설명 */}
      <Wrapper>
        <section className={Styles.difference3}>
          {/* <div className={Styles.} */}
          <h2 className={Styles.title}>PREMIUM REAL BARF</h2>
          <div className={Styles.image}>
            <Image src={barfPack} alt="" />
          </div>

          <div className={Styles.textbox}>
            <ul className={Styles.text}>
              <li>영양보존 100%</li>
              <li>100% 휴먼그레이드</li>
              <li>인공화학물 FREE</li>
              <li>인공감미료 FREE</li>
            </ul>
          </div>
        </section>
      </Wrapper>

      {/* 고민 */}
      <Wrapper bgColor="#F9F2EC">
        <section className={Styles.clientWorry}>
          <div className={`${Styles.inner} clearfix`}>
            <div className={`${Styles["cont-left"]} cont-left`}>
              <div className={Styles.title_section}>
                <h2 className={Styles.title}>
                  혹시 이런 고민 해본적 있으신가요?
                </h2>
                <p className={Styles.subtitle}>
                  생고기, 칼슘이 풍부한 뼈, 신선한 야채를 완벽한 비율으로 구성해
                  반려견이 필요한 영양분을 골고루 섭취할 수 있습니다.완벽한
                  비율으로 구성해 반려견이 필요한 영양분을 골고루섭취할 수
                  있습니다.완벽한 비율으로
                </p>
                <button type="button" className={`${Styles.btn_main}`}>
                  바프생식 둘러보기
                </button>
              </div>
            </div>
            <div className={`${Styles["cont-right"]} cont-right`}>
              <div className={Styles.cont_section}>
                <ul className="clearfix">
                  <li>
                    <div className={Styles.card}>
                      <div className={`${Styles["img-wrap"]} img-wrap`}>
                        <Image
                          src={require("/public/img/pages/home/home_clientWorry.png")}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <p className={Styles.card_title}>견주님의 고민</p>
                      <div className={Styles.details}>
                        <ul>
                          <li>
                            생식을 시도하고 싶지만 공부해야할 것이 많아 확신이
                            서지 않고, 반려견의 적응이 두려워요
                          </li>
                          <li>
                            기존 화식이나 건식사료를 급여 중 건강이 나빠진
                            반려견을 위해서 생식을 시도해보고싶어요
                          </li>
                          <li>
                            생식을 시도하고 싶지만 공부해야할 것이 많아 확신이
                            서지 않고, 반려견의 적응이 두려워요
                          </li>
                          <li>
                            생식을 시도하고 싶지만 공부해야할 것이 많아 확신이
                            서지 않고, 반려견의 적응이 두려워요
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className={Styles.card}>
                      <div className={`${Styles["img-wrap"]} img-wrap`}>
                        <Image
                          src={require("/public/img/pages/home/home_clientWorry.png")}
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

      <Wrapper>
        <section className={Styles.review}>
          <div className={Styles.inner}>
            <h2 className={Styles.title}>
              수많은 후기가 증명하는 <br /> BARFDOG
            </h2>
            <div className={Styles.cont_body}>
              <Swiper_review />
              <div className={Styles.redbox}>
                <div className={Styles.red}></div>
              </div>
            </div>
          </div>
        </section>
      </Wrapper>

      <Wrapper bgColor="#F9F2EC">
        <section className={Styles.Howtouse}>
          <div className={Styles.inner}>
            <h2 className={Styles.title}>바프독 이용방법</h2>
            <p>
              Start now 버튼을 통해 간편하게 반려동물 정보를 입력하고 계정에서
              최신상태로 업데이트 할 수 있습니다
              <br />
              간편하지만 완벽한 식단을 매달 원하는 날짜에 맞춰 받아보세요
            </p>
            <div className={Styles.cont_body}>
              <ul className="clearfix">
                <li>
                  <figure className={Styles.card}>
                    <div className={`${Styles["img-wrap"]} img-wrap`}>
                      <Image
                        src={require("/public/img/pages/home/home_howtouse_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                    <div className={Styles.details}>
                      <p className={Styles.title_1}>STEP 01</p>
                      <p className={Styles.title_2}>반려동물 정보 입력</p>
                      <p className={Styles.main_text}>
                        정확한 레시피를 위해 반려동물의 정보를 입력해주세요.
                        프레시아워는 신선하고 엄선된 재료를 바탕으로 반려동물의
                        맞춤형 신선사료를 추천 및 선택
                      </p>
                    </div>
                  </figure>
                </li>
                <li>
                  <figure className={Styles.card}>
                    <div className={`${Styles["img-wrap"]} img-wrap`}>
                      <Image
                        src={require("/public/img/pages/home/home_howtouse_2.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                    <div className={Styles.details}>
                      <p className={Styles.title_1}>STEP 02</p>
                      <p className={Styles.title_2}>맞춤형 신선사료 제작</p>
                      <p className={Styles.main_text}>
                        내 반려동물에 딱 맞는 레시피로 신선한 맞춤형
                        자연식(생식/화식)을 제작합니다. 내 반려동물에 맞는 한끼
                        정량으로 끼니별 급여가 가능하도록 포장합니다.
                      </p>
                    </div>
                  </figure>
                </li>
                <li>
                  <figure className={Styles.card}>
                    <div className={`${Styles["img-wrap"]} img-wrap`}>
                      <Image
                        src={require("/public/img/pages/home/home_howtouse_3.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                    <div className={Styles.details}>
                      <p className={Styles.title_1}>STEP 03</p>
                      <p className={Styles.title_2}>정기구독 배송</p>
                      <p className={Styles.main_text}>
                        급속냉동한 제품을 꼼꼼하게 포장해 고객님의 문앞까지
                        배송합니다. 원하는 날짜에 맞춰 정기 배송 서비스
                      </p>
                    </div>
                  </figure>
                </li>
              </ul>
              <div className={Styles.btn_box}>
                <button type="button" className={Styles.btn_main}>
                  정기구독 신청하러 가기
                </button>
              </div>
            </div>
          </div>
        </section>
      </Wrapper>

      <Wrapper>
        <section className={Styles.sns}>
          <div className={Styles.inner}>
            <h2 className={Styles.title}>INSTAGRAM</h2>
            <p>인스타그램에서 바프독의 최신 소식을 확인해보세요</p>
            <div className={Styles.cont_body}>
              {/* 텍스트 4줄이상일경우 말줄임표 처리 */}
              <Swiper_sns />
            </div>
          </div>
        </section>
      </Wrapper>
    </Layout>
  );
} 

export default Home;