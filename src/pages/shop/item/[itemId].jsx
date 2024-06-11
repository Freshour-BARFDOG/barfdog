import React, { useEffect, useRef, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import Styles from './[itemId].module.scss';
import { ShopBoard } from '/src/components/shop/ShopBoard';
import { ShopReturnExchageGuideBox } from '/src/components/shop/ShopReturnExchageGuideBox';
import { ShopItemInfoBox } from '/src/components/shop/ShopItemInfoBox';
import { ShopTabMenus } from '/src/components/shop/ShopTabMenus';
import { ShopReviewBox } from '/src/components/shop/ShopReviewBox';
import { ShopOptionBar } from '/src/components/shop/ShopOptionBar';
import { postUserObjData } from '/src/pages/api/reqData';
import { useRouter } from 'next/router';
import calculateSalePrice from '/util/func/calculateSalePrice';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import sorting from '/util/func/sorting';
import { useDispatch, useSelector } from 'react-redux';
import { cartAction } from '/store/cart-slice';
import { setPreviousPath } from '/store/navigation-slice';
import axios from 'axios';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { getData } from '/src/pages/api/reqData';
import { deleteCookie, getCookie, setCookie } from '@util/func/cookie';
import { cookieType } from '@store/TYPE/cookieType';
import { ShopFloatingTab } from '../../../components/shop/ShopFloatingTab';

export default function SingleItemDetailPage({ data }) {
  const mct = useModalContext();
  const activeGlobalAlertModal = mct.hasAlert;
  const auth = useSelector((s) => s.auth);
  const userInfo = auth.userInfo;
  const dispatch = useDispatch();
  const router = useRouter();
  const minItemQuantity = 1;
  const maxItemQuantity = data?.item?.remaining; // 재고수량이상 선택 불가
  const initialFormValues_CART = {
    // ! 기준: 장바구니 담기 request body
    itemId: data?.item?.id,
    itemAmount: 1,
    optionDtoList: [
      // { optionId : null, optionAmount : null }
    ],
    itemPrice: validation_itemPrice(data?.item), // 장바구니항목에서 제외
    totalPrice: 0, // 장바구니 항목 아님
  };

  const contentRef = useRef();
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [activeTabmenuIndex, setActiveTabmenuIndex] = useState(0);
  const [formValues, setFormValues] = useState(initialFormValues_CART);
  const [isOptionBar, setIsOptionBar] = useState(false);

  const [activeCartShortcutModal, setActiveCartShortcutModal] = useState({});

  // // console.log('formValues', formValues);
  useEffect(() => {
    if (!contentRef.current) return;
    const contentList = Array.from(contentRef.current?.children);
    contentList.forEach((thisCont) => {
      const thisContentIdx = contentList.indexOf(thisCont);
      if (thisContentIdx === activeTabmenuIndex) {
        thisCont.classList.add(Styles.active);
        // slideDown(thisCont);
      } else {
        // slideUp(thisCont);
        thisCont.classList.remove(Styles.active);
      }
    });
  }, [activeTabmenuIndex]);

  //*** scroll ***/
  const handleScroll = () => {
    const contentRefTop = contentRef.current.getBoundingClientRect().top;
    const isContentRefTop = contentRefTop <= 0; // contentRef가 상단에 위치하는지 여부
    setIsOptionBar(isContentRefTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  //*** [START] 추가상품 옵션 ***/
  // SELECT OPTION
  const defaultOption = { label: '상품선택', value: '' };
  const selectOptions = data?.opt?.map((option) => ({
    label:
      `${option.name} (재고: ` +
      `${
        option.remaining > 0 ? transformLocalCurrency(option.remaining) : '없음'
      })`,
    value: option.id,
    inStock: option.remaining > 0,
  }));
  selectOptions?.unshift(defaultOption);

  // SELECTED OPTION LIST INFO
  const initialOptionDataList = data.opt?.map((option) => ({
    id: option.id,
    name: option.name,
    optionPrice: option.optionPrice,
    remaining: option.remaining,
    quantity: minItemQuantity, //! [수정]
    optionTotalPrice: option.optionPrice, // 해당 옵션 개수 * 옵션 수량
    selected: false,
  }));

  // console.log('data>>>', data);

  const [optionDataList, setOptionDataList] = useState(initialOptionDataList); // array

  const onSelectOptionHandler = (optionId) => {
    setOptionDataList((prevState) => {
      const nextState = prevState?.map((optionObj) =>
        optionObj.id === optionId
          ? { ...optionObj, selected: true }
          : optionObj,
      );
      const sorted_nextState = sorting(nextState, 'selected', 'descend');
      return sorted_nextState;
    });
  };

  // CALCULATE TOTAL PRICE
  useEffect(() => {
    const originalItemPrice = formValues.itemPrice;
    const sumItemPrice = originalItemPrice * formValues.itemAmount;

    let sumOptionsPrice = 0;
    const selectedOptionDataList =
      optionDataList?.filter((option) => option.selected) || [];

    if (selectedOptionDataList.length) {
      sumOptionsPrice = selectedOptionDataList
        .map((option) => option.optionTotalPrice)
        .reduce((acc, cur) => acc + cur);
    }
    const totalPrice = sumItemPrice + sumOptionsPrice;
    setFormValues((prevState) => ({
      ...prevState,
      optionDtoList: selectedOptionDataList.map((option) => ({
        optionId: option.id,
        optionAmount: option.quantity,
      })),
      totalPrice: totalPrice,
    }));
  }, [optionDataList, formValues.itemAmount, contentRef]);

  const onChangeQuantityInputHandler = (optionId, quantity) => {
    // // console.log(optionId, quantity);
    setOptionDataList((prevState) => {
      return prevState.map((optionObj) => {
        if (optionObj.id === optionId) {
          const thisOptionPrice = optionObj.optionPrice;
          const totalPrice = thisOptionPrice * quantity;

          return {
            ...optionObj,
            quantity: quantity,
            optionTotalPrice: totalPrice,
            selected: optionObj.selected,
          };
        } else {
          return optionObj;
        }
      });
    });
  };

  const onDeleteOption = (e) => {
    const button = e.currentTarget;
    const optionId = Number(button.dataset.id);
    setOptionDataList((prevState) => {
      return prevState.map((optionObj) => {
        if (optionObj.id === optionId) {
          return {
            ...optionObj,
            quantity: 1,
            selected: false,
          };
        } else {
          return optionObj;
        }
      });
    });
  };
  //*** [END] 추가상품 옵션 ***/

  const onActiveCartShortcutModal = (buttonArea) => {
    setActiveCartShortcutModal({
      [buttonArea]: true,
    });
    setTimeout(() => {
      setActiveCartShortcutModal({
        [buttonArea]: false,
      });
    }, 4000);
  };

  const onAddToCart = async (e) => {
    if (!userInfo) {
      // 로그인 성공 시, 바로 장바구니에 담기 위해 localStorage에 저장
      const body = {
        itemAmount: formValues.itemAmount,
        itemId: formValues.itemId,
        optionDtoList: formValues.optionDtoList,
      };
      const formStrings = JSON.stringify(body).replace(/\n/g, '');
      localStorage.setItem('storedItem', formStrings);
      dispatch(setPreviousPath('/cart'));
      return await router.push('/account/login');
      // return mct.alertShow('로그인 후 이용가능합니다.');
    }

    const button = e.currentTarget;
    const thisButtonArea = button.dataset.area;

    const postDataApiUrl = '/api/baskets';
    try {
      const body = {
        itemAmount: formValues.itemAmount,
        itemId: formValues.itemId,
        optionDtoList: formValues.optionDtoList,
      };
      setIsLoading((prevState) => ({
        ...prevState,
        cart: true,
      }));
      // console.log(body);
      const res = await postUserObjData(postDataApiUrl, body);
      // console.log(res);
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
          onActiveCartShortcutModal(thisButtonArea);
        }, 500); // 0.5초 대기
      } else {
        alert(`${res.error}`);
      }
    } catch (err) {
      // console.log('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      cart: false,
    }));
  };

  const onClickBuyButton = async () => {
    if (!userInfo) {
      // 로그인 성공 시, 바로 주문서 페이지로 가기 위해 localStorage에 저장
      const items = [
        {
          itemDto: {
            itemId: formValues.itemId, // 상품 id
            amount: formValues.itemAmount, // 아이템 수량
          },
          optionDtoList: formValues.optionDtoList.map((option) => ({
            itemOptionId: option.optionId,
            amount: option.optionAmount,
          })), // 옵션 리스트
        },
      ];
      const formStrings = JSON.stringify(items).replace(/\n/g, '');
      localStorage.setItem('orderItem', formStrings);
      dispatch(setPreviousPath('/order/ordersheet/general'));

      return await router.push('/account/login');
      // return mct.alertShow('로그인 후 이용가능합니다.');
    }
    try {
      const items = [
        {
          itemDto: {
            itemId: formValues.itemId, // 상품 id
            amount: formValues.itemAmount, // 아이템 수량
          },
          optionDtoList: formValues.optionDtoList.map((option) => ({
            itemOptionId: option.optionId,
            amount: option.optionAmount,
          })), // 옵션 리스트
        },
      ];
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

  const onClickModalButton = () => {
    mct.alertHide();
  };

  useEffect(() => {
    if (!data) {
      alert('데이터를 불러올 수 없습니다.');
      window.history.back();
    }
  }, [data]);

  return (
    <>
      <MetaTitle title="SHOP" />

      {/* 이전 옵션바 숨김처리 */}
      {/* <ShopOptionBar
        id={'optionDtoList'}
        data={{
          opt: data?.opt,
          minQuantity: minItemQuantity,
          maxQuantity: maxItemQuantity,
        }}
        formValues={formValues}
        setFormValues={setFormValues}
        onAddToCart={onAddToCart}
        activeModal={activeCartShortcutModal}
        onActiveModal={onActiveCartShortcutModal}
        onStartBuying={onClickBuyButton}
        isLoading={isLoading}
      /> */}

      {isOptionBar && (
        <ShopFloatingTab
          id={'optionDtoList'}
          data={{
            item: data?.item,
            itemImages: data?.itemImages,
            delivery: data?.delivery,
            opt: data?.opt,
            minQuantity: minItemQuantity,
            maxQuantity: maxItemQuantity,
          }}
          formValues={formValues}
          setFormValues={setFormValues}
          onAddToCart={onAddToCart}
          activeModal={activeCartShortcutModal}
          onActiveModal={onActiveCartShortcutModal}
          onStartBuying={onClickBuyButton}
          isLoading={isLoading}
          optionDataList={optionDataList}
          selectOptions={selectOptions}
          onSelectOptionHandler={onSelectOptionHandler}
          onChangeQuantityInputHandler={onChangeQuantityInputHandler}
          onDeleteOption={onDeleteOption}
        />
      )}
      <Layout>
        <Wrapper>
          <ShopBoard
            id={'shopBoard'}
            data={{
              item: data?.item,
              itemImages: data?.itemImages,
              delivery: data?.delivery,
              minQuantity: minItemQuantity,
              maxQuantity: maxItemQuantity,
              opt: data?.opt,
            }}
            formValues={formValues}
            setFormValues={setFormValues}
            onAddToCart={onAddToCart}
            activeModal={activeCartShortcutModal}
            onActiveModal={setActiveCartShortcutModal}
            isLoading={isLoading}
            onStartBuying={onClickBuyButton}
            optionDataList={optionDataList}
            selectOptions={selectOptions}
            onSelectOptionHandler={onSelectOptionHandler}
            onChangeQuantityInputHandler={onChangeQuantityInputHandler}
            onDeleteOption={onDeleteOption}
          />
          <ShopTabMenus
            activeIndex={activeTabmenuIndex}
            setActiveIndex={setActiveTabmenuIndex}
          />
          <ul id={Styles.content} ref={contentRef}>
            <li className={Styles.cont_list}>
              <ShopItemInfoBox contents={data?.item.contents} />
            </li>
            <li className={Styles.cont_list}>
              <ShopReturnExchageGuideBox />
            </li>
            <li className={Styles.cont_list}>
              <ShopReviewBox data={data?.review} />
            </li>
          </ul>
        </Wrapper>
      </Layout>
      {activeGlobalAlertModal && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
}

const validation_itemPrice = (data) => {
  if (!data) return null;
  let itemPrice = data.salePrice || data?.originalPrice;
  const result = calculateSalePrice(
    data.originalPrice,
    data.discountType,
    data.discountDegree,
  );
  const salePricebyAdminPageCalcuator = transformClearLocalCurrency(
    result.salePrice,
  );

  // console.log(itemPrice)
  // console.log(data.salePrice)
  // console.log(data?.originalPrice)
  // console.log(data?.discountType)
  // console.log(data?.discountDegree)
  // console.log(salePricebyAdminPageCalcuator)

  // @YYL 영린 수정
  // 백엔드쪽에서 가격체크 하는데 굳이 필요없음

  // if (itemPrice !== salePricebyAdminPageCalcuator) {
  //   alert('세일가격에 이상이 있습니다. 관리자에게 문의하세요.');
  //   return null;
  // }
  // if (data.originalPrice < data.salePrice) {
  //   // validation Price
  //   alert('아이템 가격설정에 문제 발생하였습니다. 관리자에게 문의하세요.');
  //   return null;
  // }

  return itemPrice;
};

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  let isDeletedItem = false;
  const itemId = query.itemId;
  let DATA = null;
  const apiUrl = `/api/items/${itemId}`;
  let res;

  // console.log(apiUrl);

  try {
    // 서버 측에서 쿠키를 요청 헤더에 추가
    const cookies = req.headers.cookie; // 클라이언트로부터 전달된 쿠키
    const name = cookieType.LOGIN_COOKIE;
    const value = cookies.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    const accessToken = value ? value[2] : null;

    res = await axios.get(apiUrl, {
      withCredentials: true,
      headers: {
        authorization: accessToken,
        'content-Type': 'application/json',
        Cookie: cookies, // 클라이언트 쿠키를 서버 요청에 추가
      },
    });

    // console.log(apiUrl)

    // res = await getData(apiUrl);

    const data = res?.data;

    if (data) {
      // 데이터 처리 코드

      isDeletedItem = data.itemDto.deleted; // 일반상품 삭제 여부 (by 관리자)

      DATA = {
        item: {
          id: data.itemDto.id,
          name: data.itemDto.name,
          description: data.itemDto.description,
          originalPrice: data.itemDto.originalPrice,
          discountType: data.itemDto.discountType,
          discountDegree: data.itemDto.discountDegree,
          salePrice: data.itemDto.salePrice,
          inStock: data.itemDto.inStock,
          remaining: data.itemDto.remaining,
          totalSalesAmount: data.itemDto.totalSalesAmount,
          contents: data.itemDto.contents,
          itemIcons: data.itemDto.itemIcons,
          deliveryFree: data.itemDto.deliveryFree,
        },
        delivery: {
          price: data.deliveryCondDto.price,
          freeCondition: data.deliveryCondDto.freeCondition,
        },
        opt: data.itemOptionDtoList.map((thisOpt) => ({
          id: thisOpt.id,
          name: thisOpt.name,
          optionPrice: thisOpt.optionPrice,
          remaining: thisOpt.remaining,
        })),
        itemImages: data.itemImageDtoList.map((thisImage) => ({
          id: thisImage.id,
          leakedOrder: thisImage.leakedOrder,
          filename: thisImage.filename,
          url: thisImage.url,
        })),
        review: {
          star: data.reviewDto.star,
          count: data.reviewDto.count,
          itemId: data.itemDto.id,
        },
      };
    }
  } catch (err) {
    console.error(err);
  }

  if (isDeletedItem) {
    return {
      redirect: {
        destination: '/shop',
        permanent: false,
      },
    };
  }

  return { props: { data: DATA } };
}
