import React, { useEffect, useState } from 'react';
import s from './cart.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import {
  deleteObjData,
  getDataSSR,
  putObjData,
  getDataSSRWithCookies,
} from '/src/pages/api/reqData';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import CloseButton from '/src/components/atoms/CloseButton';
import { EmptyCart } from '/src/components/cart/EmptyCart';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import { cartAction } from '/store/cart-slice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getData, postUserObjData } from '../api/reqData';

const calculateCartDeliveryPrice = ({
  selectedItemDto,
  deliveryConstant = { price: 0, freeCondition: 0 },
}) => {
  if (
    !deliveryConstant ||
    !Array.isArray(selectedItemDto) ||
    selectedItemDto.length === 0
  )
    return null;
  const allItemDeliveryFree = !selectedItemDto.filter(
    (item) => !item.deliveryFree,
  ).length; // 배송비 무료가 아닌 상품이 존재할경우, 배송비 부과
  const totalPrice = selectedItemDto
    .map((item) => item.totalPrice)
    ?.reduce((acc, cur) => acc + cur);
  return totalPrice >= deliveryConstant.freeCondition || allItemDeliveryFree
    ? 0
    : deliveryConstant.price;
};

export default function CartPage({ data, error, isMember }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const deliveryConstant = {
    price: data?.deliveryConstant.price,
    freeCondition: data?.deliveryConstant.freeCondition,
  };
  const [storedItem, setStoredItem] = useState();
  const [deliveryInfo, setDeliveryInfo] = useState();

  // 비로그인 시 담은 아이템을 장바구니에 등록
  useEffect(() => {
    const storedItemData = localStorage.getItem('storedItem');
    setStoredItem(storedItemData);
    if (storedItemData) {
      (async () => {
        const postDataApiUrl = '/api/baskets';
        try {
          const res = await postUserObjData(postDataApiUrl, storedItemData);
          if (res.isDone) {
            // 전환 스크립트 설정
            const script1 = document.createElement('script');
            script1.src = '//wcs.naver.net/wcslog.js';
            script1.async = true;
            document.body.appendChild(script1);

            const script2 = document.createElement('script');
            script2.type = 'text/javascript';
            script2.innerHTML = `
        var _nasa = {};
        if (window.wcs) _nasa["cnv"] = wcs.cnv("3", "1"); // 전환유형 : 장바구니 담기, 전환가치 
      `;
            document.body.appendChild(script2);

            // 전환 스크립트가 작동할 시간을 주기 위해 잠시 대기
            setTimeout(() => {
              window.location.reload();
            }, 500); // 0.5초 대기
          } else {
            alert(`${res.error}`);
          }
        } catch (err) {
          console.log('API통신 오류 : ', err);
        }
      })();
      localStorage.removeItem('storedItem');
    }
  }, []);

  const initialDATA = {
    // - Sever Params
    basketDtoList: data?.basketDtoList?.map((item) => {
      const deliveryCharge =
        item.itemDto.deliveryFree ||
        item.totalPrice >= deliveryConstant.freeCondition
          ? 0
          : deliveryConstant.price;
      const finalPrice =
        deliveryCharge > 0
          ? item.totalPrice + deliveryConstant.price
          : item.totalPrice;
      return {
        basketId: item.itemDto.basketId, // num 장바구니 ID
        itemId: item.itemDto.itemId, // num 상품 ID
        thumbnailUrl: item.itemDto.thumbnailUrl, // str 상품 대표이미지 URL
        name: item.itemDto.name, // str 상품 이름
        originalPrice: item.itemDto.originalPrice, // num 상품 원가
        salePrice: item.itemDto.salePrice, //num  상품 할인 적용 후 판매가격

        amount: item.itemDto.amount, // num 상품 수량
        deliveryFree: item.itemDto.deliveryFree, // boolean 배송비 무료 여부
        options: item.itemOptionDtoList.map((opt) => ({
          id: opt.id, // num 옵션 ID
          name: opt.name, // str 상품 옵션 이름
          optionPrice: opt.optionPrice, // num 옵션 가격
          amount: opt.amount, // num 옵션 개수
        })),
        totalPrice: item.totalPrice, // '기본할인 적용가' * 수량 + 옵션가격총합 - Server Param
        subtractedPrice:
          (item.itemDto.originalPrice - item.itemDto.salePrice) *
          item.itemDto.amount, // ! Client Only Param
        deliveryCharge: deliveryCharge, // 배송비 ! Client Only Param
        finalPrice: finalPrice, // 최종가 = totalPrice + 배송비  ! Client Only Param
        _links: {
          increase_basket: item._links?.increase_basket.href, // str 장바구니 상품수량 +1 링크
          decrease_basket: item._links?.decrease_basket.href, // str 장바구니 상품수량 -1 링크
          delete_basket: item._links?.delete_basket.href, // str 장바구니 항목 삭제 링크
        },
      };
    }),
    total: {
      // ! Client Only Params
      originPrice: 0, // 상품 원금 총합
      subtractedPrice: 0, // 할인 총합
      deliveryPrice: 0, // 배송비 총합
      finalPrice: 0, // 총 주문금액 총합
    },
  };
  const initialAllBasketIdList = data?.basketDtoList.map(
    (item) => item.itemDto.basketId,
  );
  const [allBasketIdList, setAllBasketIdList] = useState(
    initialAllBasketIdList,
  );
  const [DATA, setDATA] = useState(initialDATA);
  const [selectedItemBasketIds, setSelectedItemBasketIds] = useState([]);
  const [isLoading, setIsLoading] = useState({});

  useEffect(() => {
    // 체크박스 항목이 변경되엇을 떄 =>update Calculator (상품금액, 배송비, 할인금액, 총주문금액)
    updateDATA();
  }, [selectedItemBasketIds]);

  // 컴포넌트 마운트 시 default로 전체 선택 상태 적용
  useEffect(() => {
    if (isMember) {
      const items = DATA.basketDtoList;
      const allItemsIdList = items.map((item) => item.basketId);
      setSelectedItemBasketIds(allItemsIdList);

      //! [추가] 배송지 주소 불러오기

      (async () => {
        try {
          const getAddressApiUrl = '/api/members';
          const res = await getData(getAddressApiUrl);

          console.log('res>>>', res);
          if (res.data) {
            const addressData = res.data.address;
            setDeliveryInfo(addressData);
          }
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, []);

  const updateDATA = (basketId, amountUnit) => {
    setDATA((prevState) => {
      const nextBasketDtoList = prevState.basketDtoList?.map((item) => {
        const nextItem = JSON.parse(JSON.stringify(item)); // ! important : 깊은 복사를 사용하여, 원본객체와의 참조를 끊어냄

        // 체크박스 클릭 Event 및 수량버튼 증가&감소버튼 Event를 구분지음
        let nextAmount = nextItem.amount; // 기본: 체크박스 chcked인 경우
        if (amountUnit) {
          // 수량 증가 버튼 클릭 시 작동
          nextAmount =
            amountUnit === 'decrease' ? --nextItem.amount : ++nextItem.amount;
        }

        // ! 추후 확인필요: 만약 salePrice 0원인 경우, 전액할인 한 CASE인지.
        const isCurItem = item.basketId === basketId;
        const hasOption = item.options.length > 0;
        const optionPrice = hasOption
          ? item.options
              ?.map((option) => option.optionPrice * option.amount)
              ?.reduce((acc, cur) => acc + cur)
          : 0;

        return isCurItem
          ? {
              ...nextItem,
              amount: nextAmount, // 수량
              subtractedPrice:
                (item.originalPrice - item.salePrice) * nextAmount, // 원금과 판매가의 차액 (할인된 금액)
              deliveryCharge: item.deliveryFree ? 0 : deliveryConstant.price, // 배송비
              totalPrice: nextItem.salePrice * nextAmount + optionPrice, // 현재 상품의 총결제 금액
              finalPrice: nextItem.salePrice * nextAmount + optionPrice, // 현재 상품의 총결제 금액 + 배송비에 사용됨.
            }
          : item;
      });

      const sumOfTotalPrice = calcTotalPriceOfTargetKey(
        'totalPrice',
        nextBasketDtoList,
      ); // 기본할인이 적용된 가격
      const SubtractedPrice = calcTotalPriceOfTargetKey(
        'subtractedPrice',
        nextBasketDtoList,
      ); // 할인정도
      const deliveryPrice = calculateCartDeliveryPrice({
        selectedItemDto: nextBasketDtoList?.filter(
          (item) => selectedItemBasketIds.indexOf(item.basketId) >= 0,
        ),
        deliveryConstant: deliveryConstant,
      }); // 총 주문금액 총합;

      return {
        ...prevState,
        basketDtoList: nextBasketDtoList,
        total: {
          originPrice: sumOfTotalPrice + SubtractedPrice, // 상품 원금 총합
          subtractedPrice: SubtractedPrice, // 할인금액 총합
          deliveryPrice: deliveryPrice, // 배송비
          finalPrice: sumOfTotalPrice + deliveryPrice,
          // ! important '전체 상품'합계가 무료배송 조건에 부합할 시, 모든 상품 배송비 무료
        },
      };
    });
  };

  const calcTotalPriceOfTargetKey = (
    DATA_basketDtoListKey,
    targetItemList = [],
  ) => {
    let sum = 0;
    const selectedItems = targetItemList?.filter(
      (item) => selectedItemBasketIds.indexOf(item.basketId) >= 0,
    );
    if (selectedItems.length > 0) {
      sum = selectedItems
        .map((item) => item[DATA_basketDtoListKey])
        .reduce((acc, cur) => acc + cur);
    }
    return sum;
  };

  const onChangeItemAmount = async (e) => {
    const btn = e.currentTarget;
    const basketId = Number(btn.dataset.id);
    const buttonType = btn.dataset.buttonType;
    const items = DATA.basketDtoList;
    const curItemData = items.filter((item) => item.basketId === basketId)[0];
    let amount = curItemData.amount;
    if (buttonType === 'decrease' && amount <= 1) {
      return alert('수량은 1개 미만으로 설정할 수 없습니다.');
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        [basketId]: true,
      }));

      const decreaseApiUrl = `/api/baskets/${basketId}/decrease`;
      const increaseApiUrl = `/api/baskets/${basketId}/increase`;
      const apiUrl =
        buttonType === 'decrease' ? decreaseApiUrl : increaseApiUrl;

      const body = {
        id: basketId,
      };

      const res = await putObjData(apiUrl, body);
      if (res.isDone) {
        const amountUnit = buttonType === 'decrease' ? 'decrease' : 'increase';
        updateDATA(basketId, amountUnit);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      [basketId]: false,
    }));
    // const apiUrl = btn.dataset.
  };

  const onSelectedItem = (id, checked) => {
    const selectedBasketId = Number(id);
    if (checked) {
      setSelectedItemBasketIds((prevState) =>
        prevState.concat(selectedBasketId),
      );
    } else {
      setSelectedItemBasketIds((prevState) =>
        prevState.filter((id) => id !== selectedBasketId),
      );
    }
  };

  const onSelectAllItems = (checked) => {
    const items = DATA.basketDtoList;
    const allItemsIdList = items.map((item) => item.basketId);
    setSelectedItemBasketIds(checked ? allItemsIdList : []);
  };

  const onDeleteItem = async (e, seletedItemId) => {
    const btn = e ? e.currentTarget : null;
    const selectedBasketId = Number(seletedItemId) || Number(btn?.dataset.id);

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: true,
      }));

      const deleteApiUrl = `/api/baskets/${selectedBasketId}`;
      const body = {
        id: selectedBasketId,
      };
      const res = await deleteObjData(deleteApiUrl, body);
      // console.log(res);

      if (res.isDone) {
        await setSelectedItemBasketIds((prevId) =>
          prevId.filter((id) => id !== selectedBasketId),
        );
        await setAllBasketIdList((prevId) =>
          prevId.filter((id) => id !== selectedBasketId),
        );
        await setDATA((prevState) => {
          const nextBasketDtoList = prevState.basketDtoList.filter(
            (item) => item.basketId !== selectedBasketId,
          );
          // console.log(nextBasketDtoList);
          const nextCount = nextBasketDtoList.length;
          dispatch(cartAction.setItemCount({ count: nextCount }));
          return {
            ...prevState,
            basketDtoList: nextBasketDtoList,
          };
        });
      } else {
        alert('장바구니 항목 삭제에 실패하였습니다.');
      }
    } catch (err) {
      alert('서버 오류\n', err.response);
      console.error(err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      delete: false,
    }));
  };

  const onDeleteSelectedItem = async () => {
    if (!selectedItemBasketIds.length) return;
    if (
      !confirm(
        `선택된 ${selectedItemBasketIds.length}개의 항목을 삭제하시게습니까?`,
      )
    )
      return;

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: false,
      }));
      const deleteApiUrl = `/api/baskets`;
      const body = {
        deleteBasketIdList: selectedItemBasketIds,
      };
      // console.log(body);

      const res = await deleteObjData(deleteApiUrl, body);
      // console.log(res);

      if (res.isDone) {
        setSelectedItemBasketIds([]);
        setDATA((prevState) => ({
          ...prevState,
          basketDtoList: prevState.basketDtoList.filter(
            (item) => selectedItemBasketIds.indexOf(item.basketId) < 0,
          ),
        }));
      } else {
        for (const basketId of selectedItemBasketIds) {
          await onDeleteItem(null, basketId);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      delete: false,
    }));
  };

  const onClickOrderButton = async () => {
    if (!selectedItemBasketIds.length) return alert('선택된 상품이 없습니다.');

    const items = DATA.basketDtoList
      .filter((item) => selectedItemBasketIds.indexOf(item.basketId) >= 0)
      .map((item) => ({
        itemDto: {
          itemId: item.itemId,
          amount: item.amount,
        },
        optionDtoList: item.options.map((option) => ({
          itemOptionId: option.id,
          amount: option.amount,
        })),
      }));

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        buy: true,
      }));
      await dispatch(cartAction.setOrderItemList({ items }));
      await router.push(`/order/ordersheet/general`);
    } catch (err) {
      // console.log('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      buy: false,
    }));
  };

  //! [수정] 비회원도 장바구니 페이지 들어올 수 있게끔
  // if (error) {
  //   return;
  // }

  console.log(data);
  console.log(DATA);

  return (
    <>
      {/* storedItem : 비로그인 시 장바구니에 담은 아이템 있을 경우, loading.. 표시 */}
      {(isLoading.delete || storedItem) && <FullScreenLoading opacity={0.3} />}
      <MetaTitle title="장바구니" />
      <Layout>
        <Wrapper>
          <section className={s.title}>
            <h1 className={s.text}>장바구니</h1>
          </section>
          {/* 배송지 변경 기능 */}
          {/* <section className={s.delivery_container}>
            <div>
              {deliveryInfo.city}
              {deliveryInfo.street}
              {deliveryInfo.detailAddress}({deliveryInfo.zipcode})
            </div>
          </section> */}
          <section className={s.cart_btn}>
            <div className={s.content_box}>
              <span className={s.check_box}>
                <PureCheckbox
                  className={s.inner}
                  eventHandler={onSelectAllItems}
                  value={valid_isTheSameArray(
                    allBasketIdList,
                    selectedItemBasketIds,
                  )}
                >
                  전체 선택
                </PureCheckbox>
              </span>
              <p className={s.btn} onClick={onDeleteSelectedItem}>
                선택삭제
              </p>
            </div>
          </section>
          <section className={s.product_list}>
            <ul className={'animation-show-all-child'}>
              {!isMember || DATA.basketDtoList?.length === 0 ? (
                <EmptyCart />
              ) : (
                DATA.basketDtoList?.map((item, index) => (
                  <li
                    key={`cart-item-${item.basketId}-${index}`}
                    className={`${s.flex_box} ${s.itemList}`}
                  >
                    <span className={s.check_box}>
                      <PureCheckbox
                        id={item.basketId}
                        className={s.inner}
                        onClick={onSelectedItem}
                        value={
                          selectedItemBasketIds.indexOf(item.basketId) >= 0 ||
                          ''
                        }
                        // setValue={setForm}
                      ></PureCheckbox>
                    </span>
                    <figure className={`${s.image}`}>
                      <Image
                        priority
                        src={item.thumbnailUrl}
                        objectFit="cover"
                        layout="fill"
                        alt={`${item.name} 상품 이미지`}
                      />
                    </figure>
                    <figcaption className={s.list_text}>
                      <a
                        href={`/shop/item/${item.itemId}`}
                        className={s.name}
                        rel={'noreferrer'}
                        target={'_blank'}
                      >
                        {item.name}
                      </a>
                      {/*<div className={s.name}>{item.name}</div>*/}
                      <div className={s['item-row']}>
                        <span className={s.salePrice}>
                          {transformLocalCurrency(item.salePrice)}원
                        </span>
                        {item.subtractedPrice > 0 && (
                          <span className={s.originalPrice}>
                            {transformLocalCurrency(item.originalPrice)}원
                          </span>
                        )}
                      </div>
                      <div className={s['option-row']}>
                        {item.options?.length > 0 &&
                          item.options.map((option) => (
                            <p key={`${item.name}-option-${option.id}`}>
                              <span className={s.optionName}>
                                {option.name}
                              </span>
                              <span className={s.optionPrice}>
                                ({transformLocalCurrency(option.optionPrice)}원)
                                /
                              </span>
                              <span className={s.amount}>
                                {option.amount}개 /
                              </span>
                              <span className={s.amount}>
                                {transformLocalCurrency(
                                  option.optionPrice * option.amount,
                                )}
                                원
                              </span>
                            </p>
                          ))}
                      </div>
                    </figcaption>

                    <span className={s.grid_box}>
                      <em className={s.count_box}>
                        <button
                          className={s.minus}
                          type={'button'}
                          data-id={item.basketId}
                          data-button-type={'decrease'}
                          onClick={onChangeItemAmount}
                          disabled={
                            isLoading[item.basketId] || item.amount <= 1
                          }
                        >
                          -
                        </button>
                        <i className={s.mid_box}>
                          {isLoading[item.basketId] ? <Spinner /> : item.amount}
                        </i>
                        <button
                          className={s.plus}
                          type={'button'}
                          data-id={item.basketId}
                          data-button-type={'increase'}
                          onClick={onChangeItemAmount}
                        >
                          +
                        </button>
                      </em>
                      <span className={s.price}>
                        {transformLocalCurrency(item.totalPrice)}원
                      </span>
                    </span>
                    <CloseButton
                      onClick={onDeleteItem}
                      data-id={item.basketId}
                      lineColor={'var(--color-line-02)'}
                    />
                    {/*<div className={s.delete_btn}>*/}
                    {/*  <div className={`${s.image} img-wrap`}>*/}
                    {/*    <Image*/}
                    {/*      priority*/}
                    {/*      src={require('/public/img/cart/cart_x_btn.png')}*/}
                    {/*      objectFit="cover"*/}
                    {/*      layout="fill"*/}
                    {/*      alt="카드 이미지"*/}
                    {/*    />*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                  </li>
                ))
              )}
            </ul>
          </section>
          <section className={s.total_price}>
            <div className={s.flex_box}>
              <div className={s.amount}>
                <p className={s.up_text}>상품 금액</p>
                <p className={s.down_text}>
                  {transformLocalCurrency(DATA.total?.originPrice)}원
                </p>
              </div>

              <i className={s.math}>
                <figure className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require('/public/img/cart/cart_minus.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="- 아이콘"
                  />
                </figure>
              </i>

              <div className={s.discount}>
                <p className={s.up_text}>할인</p>
                <p className={s.down_text}>
                  {transformLocalCurrency(DATA.total?.subtractedPrice)}원
                </p>
              </div>

              <i className={s.math}>
                <figure className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require('/public/img/cart/cart_plus.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="+ 아이콘"
                  />
                </figure>
              </i>
              <div className={s.shipping}>
                <p className={s.up_text}>배송비</p>
                <p className={s.down_text}>
                  {transformLocalCurrency(DATA.total?.deliveryPrice)}원
                </p>
              </div>
              {/* ! [추후수정] 무료배송 안내문구 */}
              {/* 1) 일반 : 무료 배송기준 추가 */}
              <span className={s.delivery_price_text}>
                {DATA.total?.deliveryPrice > 0 && (
                  <>
                    {transformLocalCurrency(
                      deliveryConstant.freeCondition - DATA.total?.finalPrice,
                    )}
                    원 추가 시 <strong>무료배송</strong>
                  </>
                )}
              </span>
              {/* 2) 구독 : 묶음배송 시, 무료배송 */}

              <div className={s.flex_text_box}>
                <div className={s.total}>총 주문 금액</div>
                <p>
                  {selectedItemBasketIds.length > 0
                    ? transformLocalCurrency(DATA.total?.finalPrice)
                    : 0}
                  원
                </p>
              </div>
              <span className={s.info_text}>
                쿠폰/적립금은 주문서에서 사용 가능합니다.
              </span>
            </div>
          </section>

          <section className={s.btn_box}>
            <button
              disabled={DATA.basketDtoList?.length === 0}
              onClick={onClickOrderButton}
              type={'button'}
              className={`${s.btn_box} ${
                DATA.basketDtoList?.length === 0
                  ? 'custom_btn solid disabled'
                  : ''
              }`}
            >
              {isLoading.buy ? (
                <Spinner style={{ color: '#fff' }} />
              ) : (
                `총 ${selectedItemBasketIds.length}건 주문하기`
              )}
            </button>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req }) {
  let data = null;
  let error = null;
  let isMember = false;
  const getApiUrl = `/api/baskets`;
  //const res = await getDataSSR(req, getApiUrl);
  const cookies = req.headers.cookie; // 클라이언트로부터 전달된 쿠키
  const res = await getDataSSRWithCookies(req, getApiUrl, cookies);
  if (res?.status === 200) {
    data = res.data;
    isMember = true;
  } else {
    error = true;
    isMember = false;
  }

  // if (error) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: '/account/login?prevPath=/cart', // 로그인 성공 후, 이전 페이지로 돌아가기
  //     },
  //   };
  // }

  return { props: { data, error, isMember } };
}
