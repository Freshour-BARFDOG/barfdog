import React, { useEffect, useRef, useState } from 'react';
import MetaTitle from '@src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import Styles from './[itemId].module.scss';
import { ShopBoard } from '/src/components/shop/ShopBoard';
import { ShopReturnExchageGuideBox } from '/src/components/shop/ShopReturnExchageGuideBox';
import { ShopItemInfoBox } from '/src/components/shop/ShopItemInfoBox';
import { ShopTabMenus } from '/src/components/shop/ShopTabMenus';
import { ShopReviewBox } from '/src/components/shop/ShopReviewBox';
import { ShopOptionBar } from '/src/components/shop/ShopOptionBar';
import {getDataSSR, postData, postSelfApiData, postUserObjData, putData, putObjData} from '/src/pages/api/reqData';
import { useRouter } from 'next/router';
import calculateSalePrice from '/util/func/calculateSalePrice';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import {useDispatch} from "react-redux";
import {cartAction} from "/store/cart-slice";
//
// ! 일반 주문 주문하기
// const initialValue_BUY = { // 일반 주문 시 , 데이터는 queryDAta에 시
//   itemId: null,
//   amount: null,
//   selectOptionDtoList: [
//     {
//       itemOptionId: null,
//       amount: null,
//     },
//   ]
// };

export default function SingleItemPage({ data }) {
  // console.log(data)
  const dispatch = useDispatch();
  const router = useRouter();
  const minItemQuantity = 1;
  const maxItemQuantity = 5;
  const initialFormValues_CART = {
    // ! 기준: 장바구니 담기 request body
    itemId: data?.item.id,
    itemAmount: 1,
    optionDtoList: [
      // { optionId : null, optionAmount : null }
    ],
    itemPrice: validation_itemPrice(data.item), // 장바구니항목에서 제외
    totalPrice: 0, // 장바구니 항목 아님
  };

  const contentRef = useRef();
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [activeTabmenuIndex, setActiveTabmenuIndex] = useState(0);
  const [formValues, setFormValues] = useState(initialFormValues_CART);

  const [activeCartShortcutModal, setActiveCartShortcutModal] = useState(false);

  // console.log('formValues', formValues);

  // console.log(formValues)
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


  
  

  const onActiveCartShortcutModal = (active) => {
    setActiveCartShortcutModal(true);
    setTimeout(()=>{
      setActiveCartShortcutModal(false);
    }, 4000)
  };
  
  

  if (!data) {
    alert('데이터를 불러올 수 없습니다.');
    router.back();
    return;
  }
  
  
  
  const onAddToCart = async () => {
    const postDataApiUrl = '/api/baskets';
    try {
      const objData = {
        itemAmount: formValues.itemAmount,
        itemId: formValues.itemId,
        optionDtoList: formValues.optionDtoList,
      };
      setIsLoading((prevState) => ({
        ...prevState,
        cart: true,
      }));
      const res = await postUserObjData(postDataApiUrl, objData);
      
      
      if (res.isDone) {
        onActiveCartShortcutModal();
      } else {
        alert(`${res.error}`);
      }
    } catch (err) {
      console.log('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      cart: false,
    }));
  };
  
  
  
  console.log(formValues);
  
  const onClickBuyButton = async () => {
    const postDataPath = `/order/ordersheet/${formValues.itemId}`;
    try {
      const DATA = {
        itemAmount: formValues.itemAmount,
        itemId: formValues.itemId,
        optionDtoList: formValues.optionDtoList,
        itemPrice: formValues.itemPrice,
        totalPrice: formValues.totalPrice
      };
      setIsLoading((prevState) => ({
        ...prevState,
        buy: true,
      }));
      await dispatch(cartAction.instantPayment({ data: DATA}));
      await router.push(postDataPath);
    } catch (err) {
      console.log('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      buy: false,
    }));
  };
  
  
  return (
    <>
      <MetaTitle title="SHOP" />
      <ShopOptionBar
        id={'optionDtoList'}
        data={{ opt: data?.opt, minQuantity: minItemQuantity, maxQuantity: maxItemQuantity }}
        formValues={formValues}
        setFormValues={setFormValues}
        onAddToCart={onAddToCart}
        onActiveModal={onActiveCartShortcutModal}
        onStartBuying={onClickBuyButton}
        isLoading={isLoading}
      />
      <Layout>
        <Wrapper>
          <ShopBoard
            data={{
              item: data?.item,
              itemImages: data?.itemImages,
              delivery: data?.delivery,
              minQuantity: minItemQuantity,
              maxQuantity: maxItemQuantity,
            }}
            formValues={formValues}
            setFormValues={setFormValues}
            onAddToCart={onAddToCart}
            activeModal={activeCartShortcutModal}
            onActiveModal={setActiveCartShortcutModal}
            isLoading={isLoading}
            onStartBuying={onClickBuyButton}
          />
          <ShopTabMenus activeIndex={activeTabmenuIndex} setActiveIndex={setActiveTabmenuIndex} />
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
    </>
  );
}

const validation_itemPrice = (data) => {
  
  let itemPrice = data.salePrice || data?.originalPrice;
  const result = calculateSalePrice(data.originalPrice, data.discountType, data.discountDegree);
  const salePricebyAdminPageCalcuator = transformClearLocalCurrency(result.salePrice);
  if (itemPrice !== salePricebyAdminPageCalcuator) {
    alert('세일가격에 이상이 있습니다. 관리자에게 문의하세요.');
    return null;
  }
  if (data.originalPrice < data.salePrice) {
    // validation Price
    alert('아이템 가격설정에 문제 발생하였습니다. 관리자에게 문의하세요.');
    return null
  }

  return itemPrice;
};



export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const itemId = query.itemId;
  // console.log(itemId);
  let DATA = null;
  const getApiUrl = `/api/items/${itemId}`;
  // console.log(getApiUrl)

  const res = await getDataSSR(req, getApiUrl);
  // console.log('SERVER REPONSE: ',res);
  const data = res?.data;
  if (data) {
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
  return { props: { data: DATA } };
}
