import React, { useEffect, useRef, useState } from 'react';
import MetaTitle from '@src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import Styles from './[itemId].module.scss';
import { ShopBoard } from '../../../components/shop/ShopBoard';
import { ShopReturnExchageGuideBox } from '../../../components/shop/ShopReturnExchageGuideBox';
import { ShopItemInfoBox } from '../../../components/shop/ShopItemInfoBox';
import { ShopTabMenus } from '../../../components/shop/ShopTabMenus';
import { ShopReviewBox } from '../../../components/shop/ShopReviewBox';
import {ShopOptionBar} from "../../../components/shop/ShopOptionBar";


// /$ curl 'http://localhost:8080/api/items/297' -i -X GET \


const TES_DATA = {
  "itemDto" : {
    "id" : 297,
    "name" : "굿즈 상품1",
    "description" : "상품설명1",
    "originalPrice" : 10000,
    "discountType" : "FLAT_RATE",
    "discountDegree" : 1000,
    "salePrice" : 9000,
    "inStock" : true,
    "remaining" : 999,
    "totalSalesAmount" : 1,
    "contents" : "상세 내용1",
    "itemIcons" : "NEW,BEST",
    "deliveryFree" : true
  },
  "deliveryCondDto" : {
    "price" : 3000,
    "freeCondition" : 50000
  },
  "itemOptionDtoList" : [ {
    "id" : 299,
    "name" : "옵션1",
    "optionPrice" : 1000,
    "remaining" : 999
  }, {
    "id" : 301,
    "name" : "옵션2",
    "optionPrice" : 2000,
    "remaining" : 999
  }, {
    "id" : 303,
    "name" : "옵션3",
    "optionPrice" : 3000,
    "remaining" : 999
  } ],
  "itemImageDtoList" : [ { // 상품 썸네일
    "id" : 298,
    "leakedOrder" : 1,
    "filename" : "filename1.jpg",
    "url" : "http://localhost:8080/display/items?filename=filename1.jpg"
  }, {
    "id" : 300,
    "leakedOrder" : 2,
    "filename" : "filename2.jpg",
    "url" : "http://localhost:8080/display/items?filename=filename2.jpg"
  }, {
    "id" : 302,
    "leakedOrder" : 3,
    "filename" : "filename3.jpg",
    "url" : "http://localhost:8080/display/items?filename=filename3.jpg"
  } ],
  "reviewDto" : {
    "star" : 3.0,
    "count" : 3
  },
  "_links" : {
    "self" : {
      "href" : "http://localhost:8080/api/items/297"
    },
    "query_item_reviews" : {
      "href" : "http://localhost:8080/api/items/297/reviews"
    },
    "profile" : {
      "href" : "/docs/index.html#resources-query-item"
    }
  }
}
// -  이미 첫 랜더링 할 떄, 상품이 존재해야하고,
// -  그 상품의 옵션이랑......옵션 개수..랑 가격을 받아와야하네.....



//
// const initialFormValues = {
//   itemId : 0, // 상품 ID
//   amount : 0, // 상품 개수
//   selectOptionDtoList : [// 옵션 개수 & ID
//     {
//       itemOptionId : null,
//       amount : null
//     }
//   ]
// }


// 어떤form을전송해야하느냐............. 장바구니에...... API문서 봐야겠지 ? 그래...
export default function SingleItemPage() {
  const [activeTabmenuIndex, setActiveTabmenuIndex] = useState(0);
  const contentRef = useRef();
  const [formValues, setFormValues] = useState( {} );
  const [itemInfo, setItemInfo] = useState( TES_DATA );
  // 장바구니에 넣을 formValues
  
  useEffect(() => {
    const contentList = Array.from(contentRef.current.children);
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

  return (
    <>
      <MetaTitle title="SHOP" />
      <ShopOptionBar optionInfo={itemInfo.itemOptionDtoList} setFormValues={setFormValues}/>
      <Layout>
        <Wrapper>
          <ShopBoard />
          <ShopTabMenus activeIndex={activeTabmenuIndex} setActiveIndex={setActiveTabmenuIndex} />
          <ul id={Styles.content} ref={contentRef}>
            <li className={Styles.cont_list}>
              <ShopItemInfoBox />
            </li>
            <li className={Styles.cont_list}>
              <ShopReturnExchageGuideBox />
            </li>
            <li className={Styles.cont_list}>
              <ShopReviewBox />
            </li>
          </ul>
        </Wrapper>
      </Layout>
     
    </>
  );
}



