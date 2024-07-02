// 레시피 Swiper
import React, { useEffect, useRef, useState } from 'react';
import s from '/src/pages/mainPage.module.scss';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/pagination';
import Image from 'next/image';
import StartBanner from '@public/img/starterBanner.png';
import Link from 'next/link';
import Styles from '@src/pages/mainPage.module.scss';
import ArrowLeft_m from '@public/img/icon/swiper-arrow-medium.svg';
import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';
import { itemHealthTypeList } from '/store/TYPE/itemHealthType';
import { getData } from '/src/pages/api/reqData';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { useDispatch, useSelector } from 'react-redux';
import { cartAction } from '/store/cart-slice';
import { setPreviousPath } from '/store/navigation-slice';

// 1번째 스와이퍼
const swiperSettings_recipe = {
  className: `${s.swiper_recipe}`,
  slidesPerView: 'auto',
  centeredSlides: false,
  modules: [Navigation],
  breakpoints: {
    //반응형 조건 속성
    // 300: {
    //   slidesPerView: 1,
    //   spaceBetween: 0,
    // },
    // 651: {
    //   //651 이상일 경우
    //   slidesPerView: 2, //레이아웃 2열
    //   spaceBetween: 20,
    // },
    // 1001: {
    //   slidesPerView: 3,
    //   spaceBetween: 20,
    // },
    1201: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
  },
};

// 2번째 스와이퍼
const swiperSettings_recipe_item = {
  className: `${s.swiper_recipe}`,
  slidesPerView: 'auto',
  centeredSlides: false,
  modules: [Pagination],
  breakpoints: {
    //   //반응형 조건 속성
    //   300: {
    //     slidesPerView: 1,
    //     spaceBetween: 0,
    //   },
    //   651: {
    //     //651 이상일 경우
    //     slidesPerView: 2, //레이아웃 2열
    //     spaceBetween: 20,
    //   },
    //   1001: {
    //     slidesPerView: 3,
    //     spaceBetween: 20,
    //   },
    1201: {
      slidesPerView: 2,
      spaceBetween: 50,
    },
  },
};

export function Swiper_recipe() {
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  // const [recipeDatas, setRecipeDatas] = useState([]);

  const [healthTypeItemList, setHealthTypeItemList] = useState();
  // const [isClicked, setIsClicked] = useState(false);
  const [healthType, setHealthType] = useState({ kor: '', eng: '' });
  const [selectedItemList, setSelectedItemList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const url = `/api/items?page=0&size=0&sortBy=recent&itemType=ALL`;
        const res = await getData(url);
        // console.log(res);
        if (res?.status === 200) {
          const data = res.data._embedded?.queryItemsDtoList;

          console.log('data', data);

          const updatedItemHealthTypeList = itemHealthTypeList.map((item) => {
            return { [item.value]: [] };
          });

          data.forEach((item) => {
            const matchedItem = updatedItemHealthTypeList.find((obj) => {
              return Object.keys(obj)[0] === item.itemHealthType;
            });

            if (matchedItem) {
              matchedItem[Object.keys(matchedItem)[0]].push(item);
            }
          });

          setHealthTypeItemList(updatedItemHealthTypeList);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  //* 이미지 클릭
  const imgClickHandler = (e, value, label) => {
    setHealthType((prev) => ({ eng: value, kor: label }));
    const updatedItemList = healthTypeItemList?.find((obj) => obj[value])?.[
      value
    ];
    setSelectedItemList(updatedItemList);
  };

  // console.log('itemHealthTypeList', itemHealthTypeList);
  // console.log('healthTypeItemList', healthTypeItemList);
  // console.log('healthType', healthType);
  // console.log('selectedItemList>>>', selectedItemList);

  return (
    <div className={s.swiper_recipe_outerWrap}>
      {/* <i
        className={
          selectedItemList.length > 0
            ? Styles.swiper_button_prev_recipe_clicked
            : Styles.swiper_button_prev_recipe
        }
        ref={navPrevRef}
      >
        <ArrowLeft_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i>
      <i
        className={
          selectedItemList.length > 0
            ? Styles.swiper_button_next_recipe_clicked
            : Styles.swiper_button_next_recipe
        }
        ref={navNextRef}
      >
        <ArrowRight_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i> */}

      {/* 1) 건강문제 */}
      <Swiper
        navigation={{
          prevEl: navPrevRef.current,
          nextEl: navNextRef.current,
        }}
        {...swiperSettings_recipe}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {itemHealthTypeList?.length > 0 &&
          itemHealthTypeList?.map((d, index) => (
            <SwiperSlide
              key={`health-${d.id}-${index}`}
              style={{
                height: 'inherit',
              }}
              className={s.swiper_slide}
            >
              <div className={s.recipe_a}>
                <div className={s.recipe_box}>
                  <div
                    className={`${s.img_wrap} ${
                      healthType.eng === d.value ? s.clicked : ''
                    }`}
                    onClick={(e) => imgClickHandler(e, d.value, d.label)}
                  >
                    <Image
                      src={require(`/public/img/pages/main/${d.value}.jpg`)}
                      alt="레시피 이미지"
                      priority
                    />
                    {healthType.eng === d.value && (
                      <div className={s.icon_check_wrap}>
                        <Image
                          src="/img/icon/main-check.svg"
                          alt="store"
                          width={100}
                          height={100}
                          className={s.check_icon}
                        />
                      </div>
                    )}
                  </div>
                  <p className={s.uiNameKorean}>{d.label}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {selectedItemList?.length > 0 && (
        <section className={s.swiper_recipe_bottom_wrapper}>
          <div className={s.swiper_recipe_bottom_text}>
            <h3>
              &quot;<span className={s.pointColor}>{healthType.kor}</span>
              &quot;에 대한 고민이 있으신가요?
            </h3>
            <h4>
              소화가 부드러운 닭고기 기반의 레시피와 그 외 적합한 상품을
              추천드려요
            </h4>
          </div>

          <Swiper
            {...swiperSettings_recipe_item}
            // onInit={(swiper) => {
            //   swiper.params.navigation.prevEl = navPrevRef.current;
            //   swiper.params.navigation.nextEl = navNextRef.current;
            //   swiper.navigation.destroy();
            //   swiper.navigation.init();
            //   swiper.navigation.update();
            // }}
          >
            {selectedItemList?.map((d, index) => (
              <SwiperSlide
                key={`recipe-${d.id}-${index}`}
                style={{
                  height: 'inherit',
                }}
                className={s.swiper_slide_item}
              >
                <div className={s.recipe_a}>
                  <div className={s.recipe_box}>
                    <div className={s.img_item_wrap}>
                      <Link passHref href={`/shop/item/${d.id}`}>
                        <Image
                          src={d.thumbnailUrl}
                          objectFit="fit"
                          layout="fill"
                          alt="레시피 이미지"
                          priority
                        />
                      </Link>
                    </div>
                    <Link passHref href={`/shop/item/${d.id}`}>
                      <div className={s.item_description}>
                        <p className={s.item_name}>{d.name}</p>

                        <div className={s.item_price_description}>
                          {d.packageType ? (
                            <>
                              <div>
                                <span>1{d.packageType}당</span>{' '}
                                <span>({d.unit})</span>
                              </div>
                              <div>
                                <p className={s.item_unit_price}>
                                  {transformLocalCurrency(d.pricePerUnit)}원
                                </p>
                              </div>
                            </>
                          ) : (
                            <p className={s.item_price}>
                              {transformLocalCurrency(d.salePrice)}원
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                    {/* [삭제] 장바구니 아이콘 */}
                    {/* <div className={s.icon_store_wrap}>
                      <Image
                        src="/img/icon/store.svg"
                        alt="store"
                        width={20}
                        height={20}
                        className={s.store_icon}
                      />
                    </div> */}
                    {/* <Link passHref href={'/shop/item/9'}>
                    <a className={s.recipe_btn}>+ 더보기</a>
                  </Link> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
      {/* <div className={s.btn_box}>
        <div className={Styles.btn_box}>
          <Link href={'/surveyGuide'} passHref>
            <a type="button" className={Styles.btn_main}>
              정기구독 신청하기
            </a>
          </Link>
        </div>
      </div> */}
    </div>
  );
}
