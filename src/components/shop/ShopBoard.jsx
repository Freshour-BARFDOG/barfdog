import React from 'react';
import s from '/src/pages/shop/item/[itemId].module.scss';
import Image from 'next/image';
import { Swiper, SwiperSlide} from 'swiper/react';
import { ItemQuantityInput } from '/src/components/atoms/ItemQuantityInput';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import 'swiper/css';
import 'swiper/css/autoplay';
import sorting from "/util/func/sorting";
import Link from "next/link";


export const ShopBoard = ({ data , formValues, setFormValues, onAddCart }) => {

  
  const item = data?.item;
  const surveySwiperSettings = {
    className: s.mainSwiper,
    spaceBetween: 0,
    loop: true,
    centeredSlides: true,
    allowTouchMove: true, // - * 드레그 및 터치 슬라이딩 기능 If false, then the only way to switch the slide is use of external API functions like slidePrev or slideNext
    slidesPerView: 1,
  };
  
  
  return (
    <section className={`${s.top} ani-show-all-child`}>
      <div className={s.inner}>
        <div className={s.top_box}>
          <div className={s.left_box}>
            <Swiper
              {...surveySwiperSettings}
            >
              {sorting(data?.itemImages, 'leakedOrder', 'ascend').map((image, index)=>(<SwiperSlide key={`item-image-${image.id}-${index}`}>
                <div className={`${s.image}`}>
                  <Image
                    priority
                    src={image.url}
                    objectFit="cover"
                    layout="fill"
                    alt={image.filename}
                  />
                </div>
              </SwiperSlide>))}
              
            </Swiper>
          </div>

          <div className={`${s.right_box}`}>
            <div className={s.content_title}>{data.item.name}</div>

            <div className={s.price_box}>
              <span className={s.price}>{transformLocalCurrency(formValues.itemPrice)}</span>
              <span className={s.won}>원</span>
              {item.salePrice !== 0 && item.salePrice !== item.originalPrice && (
                <>
                  <span className={s.originPrice}>
                    {transformLocalCurrency(item?.originalPrice || 0)}원
                  </span>
                  <span className={s.discount}>
                    {Math.ceil(((1 - item.salePrice / item.originalPrice) * 100).toFixed(2))}%
                  </span>
                </>
              )}
            </div>

            <div className={s.mid_box}>
              <div>Tip</div>

              <div>{item.description}</div>

              <div>배송정보</div>

              <div>
                택배배송 {transformLocalCurrency(data?.delivery?.price)}원 <br className={s.del_br}></br>({transformLocalCurrency(data?.delivery?.freeCondition)}원 이상 구매 시 무료)
                <br />
                <div className={s.text}>제주 및 도서산간 지역은 배송이 불가능합니다</div>
              </div>

              <div>
                <div>수량선택</div>
              </div>
              <ItemQuantityInput
                id={'itemAmount'}
                value={formValues.itemAmount}
                setFormValues={setFormValues}
                minQuantity={data.minQuantity}
                maxQuantity={data.maxQuantity}
              />
            </div>
            {/* 총 상품금액 */}
            <div className={s.total_price}>
              <div>
                <span className={`${s.left_text}`}>총 상품금액 :</span>
                <span className={s.mid_text}>
                  {transformLocalCurrency(formValues?.totalPrice) || 0}
                </span>
                <span className={s.last_text}>원</span>
              </div>
            </div>
            {/* 장바구니 버튼 */}
            <div className={s['btn-section']}>
              <button className={s.cart} onClick={onAddCart}>장바구니</button>
              <button className={s.buy} onClick={onAddCart}>구매하기</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
