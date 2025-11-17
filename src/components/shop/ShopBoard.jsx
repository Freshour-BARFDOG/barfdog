import React, { useEffect, useState } from 'react';
import Style from '/src/pages/shop/item/[itemId].module.scss';
import s from './shopOptionBar.module.scss';
import rem from '/util/func/rem';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import { ItemQuantityInput } from '/src/components/atoms/ItemQuantityInput';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import sorting from '/util/func/sorting';
import Link from 'next/link';
import CloseButton from '../atoms/CloseButton';
import Spinner from '../atoms/Spinner';
import CustomSelect from '/src/components/admin/form/CustomSelect';
import { ShopBoardItemQuantityInput } from '../atoms/ShopBoardItemQuantityInput';

SwiperCore.use([Navigation]);

export const ShopBoard = ({
  id,
  data,
  formValues,
  setFormValues,
  onAddToCart,
  activeModal,
  onActiveModal,
  isLoading,
  onStartBuying,
  optionDataList,
  selectOptions,
  onSelectOptionHandler,
  onChangeQuantityInputHandler,
  onDeleteOption,
}) => {
  const item = data?.item;
  const surveySwiperSettings = {
    className: Style.mainSwiper,
    spaceBetween: 0,
    loop: true,
    centeredSlides: true,
    allowTouchMove: true, // - * 드레그 및 터치 슬라이딩 기능 If false, then the only way to switch the slide is use of external API functions like slidePrev or slideNext
    slidesPerView: 1,
    navigation: {
      nextEl: `.${Style.swiperButtonNext}`,
      prevEl: `.${Style.swiperButtonPrev}`,
    },
  };

  const onHideCartShortcut = () => {
    onActiveModal({
      [id]: false,
    });
  };
  // console.log(item);
  // console.log('data>>>', data);
  // console.log(optionDataList);

  return (
    <section className={`${Style.top} ani-show-all-child`}>
      <div className={Style.inner}>
        <div className={Style.top_box}>
          <div className={Style.left_box}>
            <Swiper {...surveySwiperSettings}>
              {data &&
                sorting(data?.itemImages, 'leakedOrder', 'ascend')?.map(
                  (image, index) => (
                    <SwiperSlide key={`item-image-${image.id}-${index}`}>
                      <div className={`${Style.image}`}>
                        <Image
                          priority
                          src={image.url}
                          objectFit="cover"
                          layout="fill"
                          alt={image.filename}
                        />
                      </div>
                    </SwiperSlide>
                  ),
                )}
              <div className={Style.swiperButtonPrev}></div>
              <div className={Style.swiperButtonNext}></div>
            </Swiper>
          </div>

          <div className={`${Style.right_box}`}>
            <div className={Style.content_title}>{data?.item?.name}</div>

            {/* 콕뱅크 할 때 수정해야됨  */}
            <div className={Style.price_box}>
              <span className={Style.price}>
                {transformLocalCurrency(formValues.itemPrice)}
              </span>
              <span className={Style.won}>원</span>
              {item?.salePrice !== 0 &&
                item?.salePrice !== item?.originalPrice && (
                  <>
                    <span className={Style.originPrice}>
                      {transformLocalCurrency(item?.originalPrice || 0)}원
                    </span>
                    <span className={Style.discount}>
                      {Math.ceil(
                        (
                          (1 - item?.salePrice / item?.originalPrice) *
                          100
                        ).toFixed(2),
                      )}
                      %
                    </span>
                  </>
                )}
            </div>

            <div className={Style.mid_box}>
              <div>Tip</div>

              <div>{item?.description}</div>

              <div>배송정보</div>

              <div>
                {item?.deliveryFree ? (
                  '무료'
                ) : (
                  <>
                    택배배송 {transformLocalCurrency(data?.delivery?.price)}원
                    <p className={Style.del_br}></p> (
                    {transformLocalCurrency(data?.delivery?.freeCondition)}원
                    이상 구매 시 무료)
                  </>
                )}

                <br />
                {/* <p className={Style.text}>제주 및 도서산간 지역은 배송이 불가능합니다</p> */}
                <p className={Style.text}>
                  제주 및 도서산간 지역도 배송비 추가 없이 보내드립니다
                </p>
              </div>

              <div>
                <div>수량선택</div>
              </div>
              <ShopBoardItemQuantityInput
                id={'itemAmount'}
                value={formValues.itemAmount}
                setFormValues={setFormValues}
                minQuantity={data.minQuantity}
                maxQuantity={data.maxQuantity}
              />

              <div>
                <div>추가상품</div>
              </div>
              <div
                className={`${s.selector} ${
                  optionDataList?.length === 0 ? `${s.disabled_select}` : ''
                }`}
              >
                <CustomSelect
                  options={selectOptions}
                  // value={''}
                  setFormValues={onSelectOptionHandler}
                  dataType={'number'}
                  disabled={optionDataList?.length === 0}
                />
              </div>
            </div>

            <ul>
              {optionDataList?.length > 0 &&
                optionDataList?.map(
                  (option, index) =>
                    option.selected && (
                      <li
                        key={`item-option-${option.id || index}`}
                        className={s.item}
                      >
                        <span className={s.title}>{option.name}</span>
                        <div className={s['input-quantity']}>
                          <ShopBoardItemQuantityInput
                            id={option.id}
                            style={{ borderColor: '#ddd' }}
                            onChange={onChangeQuantityInputHandler}
                            value={option.quantity}
                            minQuantity={data.minQuantity}
                            maxQuantity={option.remaining}
                            optionDataList={optionDataList}
                          />
                        </div>
                        <span className={s.optionPrice}>
                          {transformLocalCurrency(
                            option.optionTotalPrice || option.optionPrice,
                          )}
                          원
                        </span>
                        <span>
                          <CloseButton
                            onClick={onDeleteOption}
                            data-id={option.id}
                            lineColor={'#ababab'}
                            style={{
                              width: `${rem(18)}`,
                              height: `${rem(18)}`,
                            }}
                          />
                        </span>
                      </li>
                    ),
                )}
            </ul>
            {/* 총 상품금액 */}
            <div className={Style.total_price}>
              <div>
                <span className={`${Style.left_text}`}>총 상품금액 :</span>
                <span className={Style.mid_text}>
                  {transformLocalCurrency(formValues?.totalPrice) || 0}
                </span>
                <span className={Style.last_text}>원</span>
              </div>
            </div>

            {item?.inStock && item?.remaining > 0 ? (
              <section className={s['shop-btn-section']}>
                {/* 장바구니 버튼 */}
                <div className={s['grid-box']}>
                  <button
                    type={'button'}
                    className={`${s.cart} ${s.btn}`}
                    data-area={id}
                    onClick={onAddToCart}
                  >
                    {isLoading.cart ? <Spinner /> : '장바구니'}
                  </button>
                  <button
                    onClick={onStartBuying}
                    type={'button'}
                    className={`${s.buy} ${s.btn}`}
                  >
                    {isLoading.buy ? (
                      <Spinner style={{ color: '#fff' }} />
                    ) : (
                      '구매하기'
                    )}
                  </button>
                </div>
                {activeModal[id] && (
                  <div className={`${s['cart-shortcut']} animation-show`}>
                    <p>상품이 장바구니에 담겼습니다.</p>
                    <CloseButton
                      onClick={onHideCartShortcut}
                      className={s.close}
                    />
                    <Link href="/cart" passHref>
                      <a className={`${s.cart} ${s.btn}`}>
                        장바구니로 바로가기
                      </a>
                    </Link>
                  </div>
                )}
              </section>
            ) : (
              <section className={s['shop-btn-section']}>
                <button
                  type={'button'}
                  className={`${s.soldOut} ${s.btn}`}
                  data-area={id}
                >
                  품절
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
