// 레시피 Swiper
import React, { useEffect, useRef, useState } from 'react';
import s from './swiperProduct.module.scss';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import Styles from '@src/pages/mainPage.module.scss';
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
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [generalItemList, setGeneralItemList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const url = `/api/items?page=0&size=100&sortBy=recent&itemType=ALL&subscription=true`;
        const res = await getData(url);
        // console.log(res);
        if (res?.status === 200) {
          const data = res.data._embedded?.queryItemsDtoList.sort(
            (a, b) => a.subscriptionOrder - b.subscriptionOrder,
          );
          setSelectedItemList(data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  //* 이미지 클릭
  const imgClickHandler = (e, item) => {
    const isItemInList = generalItemList.some((i) => i.id === item.id);

    if (isItemInList) {
      // 이미 리스트에 있는 경우 삭제
      setGeneralItemList((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      // 리스트에 없는 경우 추가
      setGeneralItemList((prev) => [
        ...prev,
        {
          id: item.id,
          name: item.name,
          salePrice: item.salePrice,
          count: 1,
        },
      ]);
    }
  };

  const addGeneralItemHandler = (e, item) => {
    setGeneralItemList((prev) => [
      ...prev,
      {
        id: item.id,
        name: item.name,
        salePrice: item.salePrice,
        count: item.count++,
      },
    ]);
  };

  const minusGeneralItemHandler = (e, item) => {
    setGeneralItemList((prev) => {
      const itemIndex = prev.findIndex((i) => i.id === item.id);
      if (itemIndex >= 0) {
        const newItem = {
          ...prev[itemIndex],
          count: prev[itemIndex].count - 1,
        };
        if (newItem.count <= 0) {
          // count가 0이 되면 리스트에서 항목 제거
          return prev.filter((i) => i.id !== item.id);
        } else {
          // count를 감소시키고 리스트 업데이트
          const newList = [...prev];
          newList[itemIndex] = newItem;
          return newList;
        }
      }
      return prev;
    });
  };

  console.log(selectedItemList);
  console.log('generalItemList>>>', generalItemList);

  return (
    <div className={s.swiper_recipe_outerWrap}>
      {selectedItemList?.length > 0 && (
        <Swiper {...swiperSettings_recipe_item}>
          {selectedItemList?.map((d, index) => {
            const isChecked = generalItemList.some((item) => item.id === d.id);
            const selectedItem = generalItemList.find(
              (item) => item.id === d.id,
            );
            return (
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
                      {/* <Link passHref href={`/shop/item/${d.id}`}> */}
                      <Image
                        src={d.thumbnailUrl}
                        objectFit="fit"
                        layout="fill"
                        alt="레시피 이미지"
                        priority
                        onClick={(e) => imgClickHandler(e, d)}
                      />
                      <div
                        onClick={(e) => imgClickHandler(e, d)}
                        className={`${s.img_wrap} ${
                          isChecked ? s.clicked : ''
                        }`}
                      ></div>
                      {isChecked && (
                        <div className={s.item_count_wrap}>
                          <span
                            onClick={(e) =>
                              minusGeneralItemHandler(e, selectedItem)
                            }
                          >
                            -
                          </span>
                          {selectedItem.count}
                          <span
                            onClick={(e) =>
                              addGeneralItemHandler(e, selectedItem)
                            }
                          >
                            +
                          </span>
                        </div>
                      )}
                      {/* </Link> */}
                    </div>
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
                    {/* 장바구니 아이콘 */}
                    {!isChecked && (
                      <div className={s.icon_store_wrap}>
                        <Image
                          src="/img/icon/store.svg"
                          alt="store"
                          width={20}
                          height={20}
                          className={s.store_icon}
                        />
                      </div>
                    )}
                    {/* <Link passHref href={'/shop/item/9'}>
                    <a className={s.recipe_btn}>+ 더보기</a>
                  </Link> */}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
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
