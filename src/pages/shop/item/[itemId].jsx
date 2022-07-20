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
import { getDataSSR } from '/src/pages/api/reqData';
import { useRouter } from 'next/router';
import calculateSalePrice from '/util/func/calculateSalePrice';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';

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
  const minItemQuantity = 1;
  const maxItemQuantity = 5;
  const initialFormValues_CART = {
    // ! 기준: 장바구니 담기 request body
    itemId: data.item.id,
    itemAmount: 1,
    optionDtoList: [
      // { optionId : null, optionAmount : null }
    ],
    itemPrice: validation_itemPrice(data), // 장바구니항목에서 제외
    totalPrice: 0, // 장바구니 항목 아님
  };

  const contentRef = useRef();
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [activeTabmenuIndex, setActiveTabmenuIndex] = useState(0);
  const [formValues, setFormValues] = useState(initialFormValues_CART);

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

  if (!data) {
    alert('데이터를 불러올 수 없습니다.');
    const router = useRouter();
    router.back();

    return;
  }

  return (
    <>
      <MetaTitle title="SHOP" />
      <ShopOptionBar
        id={'optionDtoList'}
        data={{ opt: data?.opt, minQuantity: minItemQuantity, maxQuantity: maxItemQuantity }}
        formValues={formValues}
        setFormValues={setFormValues}
      />
      <Layout>
        <Wrapper>
          <ShopBoard
            data={{
              item: data.item,
              itemImages: data.itemImages,
              delivery: data.delivery,
              minQuantity: minItemQuantity,
              maxQuantity: maxItemQuantity,
            }}
            formValues={formValues}
            setFormValues={setFormValues}
          />
          <ShopTabMenus activeIndex={activeTabmenuIndex} setActiveIndex={setActiveTabmenuIndex} />
          <ul id={Styles.content} ref={contentRef}>
            <li className={Styles.cont_list}>
              <ShopItemInfoBox contents={data.item.contents} />
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
  let itemPrice;
  const item = data?.item;
  itemPrice = item.salePrice || item.originPrice;
  const result = calculateSalePrice(item.originalPrice, item.discountType, item.discountDegree);
  const salePricebyAdminPageCalcuator = transformClearLocalCurrency(result.salePrice);
  if (itemPrice !== salePricebyAdminPageCalcuator) {
    return alert('세일가격에 이상이 있습니다. 관리자에게 문의하세요.');
  }
  if (item.originalPrice < item.salePrice) {
    // validation Price
    return alert('아이템 가격설정에 문제 발생하였습니다. 관리자에게 문의하세요.');
  }

  return itemPrice;
};

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const itemId = query.itemId;
  let DATA = null;
  const getApiUrl = `/api/items/${itemId}`;

  const res = await getDataSSR(req, getApiUrl);
  console.log(res);
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
