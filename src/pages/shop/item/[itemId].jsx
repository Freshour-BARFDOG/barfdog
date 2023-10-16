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
import {
  postUserObjData,
} from '/src/pages/api/reqData';
import { useRouter } from 'next/router';
import calculateSalePrice from '/util/func/calculateSalePrice';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import {useDispatch, useSelector} from 'react-redux';
import { cartAction } from '/store/cart-slice';
import axios from "axios";
import {useModalContext} from "/store/modal-context";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";


export default function SingleItemDetailPage({data}) {
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
  
  

  const [activeCartShortcutModal, setActiveCartShortcutModal] = useState({});

  // console.log('formValues', formValues);
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
    if(!userInfo){
      await router.push('/account/login');
      return mct.alertShow('로그인 후 이용가능합니다.');
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
      console.log(body);
      const res = await postUserObjData(postDataApiUrl, body);
      console.log(res);
      if (res.isDone) {
        onActiveCartShortcutModal(thisButtonArea);
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


  const onClickBuyButton = async () => {
    if(!userInfo){
      await router.push('/account/login');
      return mct.alertShow('로그인 후 이용가능합니다.');
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
      console.log('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      buy: false,
    }));
  };
  
  
  useEffect( () => {
    if(!data){
      alert('데이터를 불러올 수 없습니다.')
      window.history.back();
    }
  }, [data] );
  
  

  return (
    <>
      <MetaTitle title="SHOP" />
      <ShopOptionBar
        id={'optionDtoList'}
        data={{ opt: data?.opt, minQuantity: minItemQuantity, maxQuantity: maxItemQuantity }}
        formValues={formValues}
        setFormValues={setFormValues}
        onAddToCart={onAddToCart}
        activeModal={activeCartShortcutModal}
        onActiveModal={onActiveCartShortcutModal}
        onStartBuying={onClickBuyButton}
        isLoading={isLoading}
      />
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
      {activeGlobalAlertModal && <Modal_global_alert background />}
    </>
  );
}

const validation_itemPrice = (data) => {
  if (!data) return null;
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
    return null;
  }

  return itemPrice;
};

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  let isDeletedItem = false;
  const itemId = query.itemId;
  let DATA = null;
  const apiUrl = `/api/items/${itemId}`;
  let res;

  try {
    res = await axios
      .get(apiUrl, {
        headers: {
          authorization: null,
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        // console.log('shop singleItem > res: ',res);
        return res;
      })
      .catch((err) => {
        // console.log('shop singleItem > ERROR: ',err.response)
        return err.response;
      });
    const data = res?.data;
    console.log(data)
    if (data) {
      
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
      console.error(err)
  }
  
  if ( isDeletedItem ) {
    return {
      redirect:{
        destination: "/shop",
        permanent: false,
      }
    }
  }
  
  return { props: { data: DATA } };
}
