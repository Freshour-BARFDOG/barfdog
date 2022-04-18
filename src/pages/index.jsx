import React, { useEffect, useState} from "react";
import Styles from '/styles/css/index.module.scss'
import Layout from '/src/components/common/Layout'
import Wrapper from "/src/components/common/Wrapper";
import Link from 'next/link';
//////////////////////////////////////////////////
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
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


/* 

1.퍼블리싱
- Swiper
- Layout (모바일 고려) /////
- Dummy 사용법 /////
- Entity code //

2. 깃 -> 업데이트 * Pull 
 */





function Home() {

  //////////////////////////////////////////////////
  const [isMobile, setIsMobile] = useState(false);

  const swiperSettings_main = {
    className: `${Styles.swiper_main}`,
    spaceBetween: 0,
    loop: true,
    centeredSlides: true,
    autoplay: { delay: 2500, disableOnInteraction: false },
    slidesPerView: 1,
    pagination: { clickable: true },
    modules: [Pagination]
  };

  const swiperSettings_review = {
    className: `${Styles.swiper_review}`,
    spaceBetween: 40,
    loop: true,
    centeredSlides: true,
    slidesPerView: isMobile ? 1 : 3,
    pagination: { clickable: true },
    navigation: {className:'sw'},
    modules: [Pagination, Navigation]
  };


  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);
  //////////////////////////////////////////////////

  return (
    <Layout>
      <Wrapper>
        <Swiper {...swiperSettings_main}>
          <SwiperSlide>
            <section className={Styles.banner}>
              <div className={Styles.inner}>
                <div className={`${Styles["img-wrap"]} img-wrap clearfix`}>
                  <Link href="/" passHref>
                    <a>
                      <Image
                        src={Mainbanner}
                        objectFit="cover"
                        layout="fill"
                        alt="메인배너 이미지"
                      ></Image>
                    </a>
                  </Link>
                </div>
              </div>
            </section>
          </SwiperSlide>
          <SwiperSlide>
            <section className={Styles.banner}>
              <div className={Styles.inner}>
                <div className={`${Styles["img-wrap"]} img-wrap`}>
                  <Link href="/" passHref>
                    <a>
                      <Image
                        src={Mainbanner}
                        objectFit="cover"
                        layout="fill"
                        alt="메인배너 이미지2"
                      ></Image>
                    </a>
                  </Link>
                </div>
              </div>
            </section>
          </SwiperSlide>
          <SwiperSlide>
            <section className={Styles.banner}>
              <div className={Styles.inner}>
                <div className={`${Styles["img-wrap"]} img-wrap`}>
                  <Link href="/" passHref>
                    <a>
                      <Image
                        src={Mainbanner}
                        objectFit="cover"
                        layout="fill"
                        alt="메인배너 이미지3"
                      ></Image>
                    </a>
                  </Link>
                </div>
              </div>
            </section>
          </SwiperSlide>
        </Swiper>
      </Wrapper>

      {/* 섹션1 레시피 4가지 소개*/}
      <Wrapper>
        <section className={Styles.recipe_info}>
          <div className={Styles.inner}>
            <p className={Styles.text}>&quot;진짜 생식&#34;</p>
            <p className={Styles.text}>바프독의 4가지 레시피zz</p>

            {/* 바프독의 4가지 레시피 소개 */}
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
                  <div className={Styles.btn}>플러스 추가 더보기</div>
                </div>
              </div>
            </div>
            {/* 바프독의 4가지 레시피 소개 끝*/}

            <div className={Styles.box22}>
              <div className={Styles.btnbox}>
                <Link href="/" passHref>
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
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Wrapper>
      <Wrapper bgColor="#F9F2EC">
        <section className={Styles.difference5}>
          <div className={Styles.inner}>
            <h2 className={Styles.title}>수많은 후기가 증명하는 BARFDOG</h2>
            <div className={Styles.cont_body}>콘텐츠 영역</div>
            <Swiper
              {...swiperSettings_review}
            >
              <SwiperSlide style={{height:"300px",backgroundColor:'var(--color-bg)'}}>Slide 1</SwiperSlide>
              <SwiperSlide style={{height:"300px",backgroundColor:'var(--color-bg)'}}>Slide 2</SwiperSlide>
              <SwiperSlide style={{height:"300px",backgroundColor:'var(--color-bg)'}}>Slide 3</SwiperSlide>
              <SwiperSlide style={{height:"300px",backgroundColor:'var(--color-bg)'}}>Slide 4</SwiperSlide>
              <SwiperSlide style={{height:"300px",backgroundColor:'var(--color-bg)'}}>Slide 5</SwiperSlide>
              <SwiperSlide style={{height:"300px",backgroundColor:'var(--color-bg)'}}>Slide 6</SwiperSlide>
              <SwiperSlide style={{height:"300px",backgroundColor:'var(--color-bg)'}}>Slide 7</SwiperSlide>
              <SwiperSlide style={{height:"300px",backgroundColor:'var(--color-bg)'}}>Slide 8</SwiperSlide>
              <SwiperSlide style={{height:"300px",backgroundColor:'var(--color-bg)'}}>Slide 9</SwiperSlide>
            </Swiper>
          </div>
        </section>
      </Wrapper>
      <Wrapper bgColor="#F9F2EC">
        <section className={Styles.difference6}>
          <div className={Styles.inner}>
            <h2 className={Styles.title}>타이틀영역</h2>
            <div className={Styles.cont_body}>콘텐츠 영역</div>
          </div>
        </section>
      </Wrapper>
      <Wrapper bgColor="#F9F2EC">
        <section className={Styles.difference7}>
          <div className={Styles.inner}>
            <h2 className={Styles.title}>타이틀영역</h2>
            <div className={Styles.cont_body}>콘텐츠 영역</div>
          </div>
        </section>
      </Wrapper>
    </Layout>
  );
} 

export default Home;
