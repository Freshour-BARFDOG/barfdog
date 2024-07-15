// 레시피 Swiper
import React, { useEffect, useRef, useState } from 'react';
import s from '/src/pages/mainPage.module.scss';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import Styles from '@src/pages/mainPage.module.scss';
import { itemHealthTypeList } from '/store/TYPE/itemHealthType';
import { getData } from '/src/pages/api/reqData';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { useDispatch, useSelector } from 'react-redux';
import { cartAction } from '/store/cart-slice';
import { setPreviousPath } from '/store/navigation-slice';

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

export function Swiper_product() {
  // const [recipeDatas, setRecipeDatas] = useState([]);

  const [healthTypeItemList, setHealthTypeItemList] = useState();
  // const [isClicked, setIsClicked] = useState(false);
  const [healthType, setHealthType] = useState({
    kor: '',
    eng: '',
    description: '',
  });
  const [selectedItemList, setSelectedItemList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const url = `/api/items?page=0&size=0&sortBy=recent&itemType=ALL`;
        const res = await getData(url);
        // console.log(res);
        if (res?.status === 200) {
          const data = res.data._embedded?.queryItemsDtoList;

          // console.log('data', data);

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
  const imgClickHandler = (e, value, label, description) => {
    setHealthType((prev) => ({ eng: value, kor: label, description }));
    const updatedItemList = healthTypeItemList?.find((obj) => obj[value])?.[
      value
    ];
    setSelectedItemList(updatedItemList);
  };

  // console.log('itemHealthTypeList', itemHealthTypeList);
  // // console.log('healthTypeItemList', healthTypeItemList);
  // console.log('healthType', healthType);
  // console.log('selectedItemList>>>', selectedItemList);

  return (
    <div className={s.swiper_recipe_outerWrap}>
      {selectedItemList?.length > 0 && (
        <section className={s.swiper_recipe_bottom_wrapper}>
          <div className={s.swiper_recipe_bottom_text}>
            <h3>
              <span className={s.pointColor}>{healthType.kor}</span>에 대한
              고민이 있으신가요?
            </h3>
            <h4>{healthType.description}</h4>
          </div>

          <Swiper {...swiperSettings_recipe_item}>
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
          <Link href={'/survey'} passHref>
            <a type="button" className={Styles.btn_main}>
              정기구독 신청하기
            </a>
          </Link>
        </div>
      </div> */}
    </div>
  );
}
