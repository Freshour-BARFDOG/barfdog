import React, { useEffect, useState } from 'react';
import s from './shopFloatingTab.module.scss';
import Wrapper from '../common/Wrapper';
import { ItemQuantityInput } from '../atoms/ItemQuantityInput';
import CloseButton from '/src/components/atoms/CloseButton';
import CustomSelect from '/src/components/admin/form/CustomSelect';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import rem from '/util/func/rem';
import sorting from '/util/func/sorting';
import Link from 'next/link';
import Spinner from '/src/components/atoms/Spinner';
import { IoCloseOutline } from 'react-icons/io5';
import Image from 'next/image';

export const ShopFloatingTab = ({
  id,
  data,
  formValues,
  setFormValues,
  onAddToCart,
  onStartBuying,
  isLoading,
  activeModal,
  onActiveModal,
  optionDataList,
  selectOptions,
  onSelectOptionHandler,
  onChangeQuantityInputHandler,
  onDeleteOption,
}) => {
  // STATE
  const [active, setActive] = useState(false); // boolean
  const [isOpenBtn, setIsOpenBtn] = useState(false); // boolean

  const onHideCartShortcut = () => {
    onActiveModal({
      [id]: false,
    });
  };

  const handleButtonToggle = () => {
    setIsOpenBtn(!isOpenBtn);
  };

  const isSoldOut = !data?.item?.inStock || data?.item?.remaining <= 0;

  return (
    <div
      id={s['shop-optionBar']}
      className={`${active ? s.active : ''} ${isOpenBtn ? s.open : ''}`}
    >
      <Wrapper>
        <div className={s.product_info}>
          <div className={`${s.image}`}>
            {isLoading.fetching ? (
              <Image
                priority
                src={data.itemImages[0].url}
                width={80}
                height={80}
                alt={data.itemImages[0].filename}
                className={isOpenBtn ? s.open : ''}
              />
            ) : (
              <div className={s.spinner_wrapper}>
                <Spinner />
              </div>
            )}
            <div className={s.product_info_text}>
              <span className={s.product_name}>{data.item.name}</span>
              <span className={s.product_original_price}>
                {transformLocalCurrency(data.item.originalPrice)} 원
              </span>
            </div>
          </div>

          {/* {isOpenBtn ? (
            <IoCloseOutline onClick={handleButtonToggle} />
          ) : (
            <button
              onClick={handleButtonToggle}
              type={'button'}
              className={`${s.open_buy} ${s.btn}`}
            >
              구매하기
            </button>
          )} */}
          {isSoldOut ? (
            <button type="button" className={`${s.soldOut} ${s.btn}`} disabled>
              품절
            </button>
          ) : isOpenBtn ? (
            <IoCloseOutline onClick={handleButtonToggle} />
          ) : (
            <button
              onClick={handleButtonToggle}
              type="button"
              className={`${s.open_buy} ${s.btn}`}
            >
              구매하기
            </button>
          )}
        </div>

        {/* 구매하기 버튼 클릭 시 나타남 */}
        {isOpenBtn && !isSoldOut && (
          <div className={s.container}>
            <div className={s.container_info}>
              <div className={s.container_select_wrapper}>
                <div className={s.container_select_input}>
                  <div>
                    <div className={s.title_text}>
                      <span>수량선택</span>
                    </div>
                    <div className={s.quantity_input_wrapper}>
                      <ItemQuantityInput
                        id={'itemAmount'}
                        value={formValues.itemAmount}
                        setFormValues={setFormValues}
                        minQuantity={data.minQuantity}
                        maxQuantity={data.maxQuantity}
                      />
                    </div>
                  </div>

                  <div className={s.options}>
                    <div className={s.title_text}>
                      <span>추가상품</span>
                    </div>
                    <div
                      className={`${s.selector} ${
                        optionDataList.length === 0
                          ? `${s.disabled_select}`
                          : ''
                      }`}
                    >
                      <CustomSelect
                        options={selectOptions}
                        // value={''}
                        setFormValues={onSelectOptionHandler}
                        dataType={'number'}
                        disabled={optionDataList.length === 0}
                      />
                    </div>
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
                              <ItemQuantityInput
                                id={option.id}
                                style={{ borderColor: '#ddd' }}
                                onChange={onChangeQuantityInputHandler}
                                value={option.quantity}
                                minQuantity={data.minQuantity}
                                maxQuantity={option.remaining}
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
              </div>

              <div>
                <div className={s['price-indicator']}>
                  <span className={s.title}>총 상품금액 :</span>
                  <span className={s.totalPrice}>
                    {transformLocalCurrency(formValues.totalPrice || 0)}
                  </span>
                  <em className={s.unit}>원</em>
                </div>

                <div className={s.delivery_info}>
                  {/* <div>배송정보</div> */}

                  <div className={s.delivery_text}>
                    {data?.item?.deliveryFree ? (
                      '무료'
                    ) : (
                      <>
                        택배배송 {transformLocalCurrency(data?.delivery?.price)}
                        원 (
                        {transformLocalCurrency(data?.delivery?.freeCondition)}
                        원 이상 구매 시 무료)
                      </>
                    )}

                    <br />
                    {/* <p className={Style.text}>제주 및 도서산간 지역은 배송이 불가능합니다</p> */}
                    <p className={s.text}>
                      제주 및 도서산간 지역도 배송비 추가 없이 보내드립니다
                    </p>
                  </div>
                </div>
                <section
                  className={`${s['shop-btn-section']} ${s['on-optionBar']}`}
                >
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
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    </div>
  );
};
