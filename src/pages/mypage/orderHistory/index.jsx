import React, { useEffect, useState } from 'react';
import s from './orderHistory.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import TabContentContainer, {LeftContainer, RightContainer,} from '/src/components/atoms/TabContentContainer';
import Tabmenu_TwoButton from '/src/components/atoms/Tabmenu_TwoButton';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import animateWindow from '/util/func/animateWindow';
import { productType } from '/store/TYPE/itemType';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import {SubscribeItems} from '/src/components/mypage/orderHistory/SubscribeItems';
import {SingleItemList} from '/src/components/mypage/orderHistory/SingleItemList';
import {decodeUrlToMatchApiProtocolAndSearchQuery} from "/util/func/decodeUrlToMatchApiProtocolAndSearchQuery";


export default function OrderHistoryPage() {
  const subscribeApiUrl = '/api/orders/subscribe';
  const generalItemApiUrl = '/api/orders/general';
  const searchPageSize = 10;

  const [isLoading, setIsLoading] = useState({});
  const [activeMenu, setActiveMenu] = useState('left');
  const [itemList, setItemList] = useState([]);
  const [itemType, setItemType] = useState(productType.SUBSCRIBE);

  console.log(itemList);
  useEffect(() => {
    // set Scroll Position: 페이지 최상단으로 scroll 위치 초기화 보완
    if (window && typeof window !== 'undefined') {
      const Y = window.scrollY;
      animateWindow(Y);
    }
  }, [activeMenu]);

  const pageInterCeptor = async (res) => {
    console.log(res);
    // res = activeMenu === 'left' ? DUMMY_SUBSCRIBE_DELVIERY_RESPONSE : DUMMY_GENERAL_DELVIERY_RESPONSE; // ! TEST
    // res = activeMenu === 'left' ? res : DUMMY_GENERAL_DELVIERY_RESPONSE; // ! TEST
    
    let newPageInfo = {
      totalPages: 0,
      size: 0,
      totalItems: 0,
      currentPageIndex: 1,
      newPageNumber: 1,
      newItemList: [],
    };
    
    if(res?.data?._embedded){
      
      const tmepItemList =
        res.data._embedded[
          activeMenu === 'left' ? 'querySubscribeOrdersDtoList' : 'queryGeneralOrdersDtoList'
          ] || [];
      
      const subscribeItemList =
        activeMenu === 'left' &&
        tmepItemList.map((item) => ({
          recipeDto: {
            thumbnailUrl: decodeUrlToMatchApiProtocolAndSearchQuery(item.recipeDto.thumbnailUrl),
            recipeName: item.recipeDto.recipeName,
          },
          subscribeOrderDto: {
            orderId: item.subscribeOrderDto.orderId, // 주문 id
            subscribeId: item.subscribeOrderDto.subscribeId, // 구독 id
            orderDate: item.subscribeOrderDto.orderDate, // 주문일자
            dogName: item.subscribeOrderDto.dogName, // 반려견 명
            subscribeCount: item.subscribeOrderDto.subscribeCount, // 구독회차
            merchantUid: item.subscribeOrderDto.merchantUid, // 주문번호
            paymentPrice: item.subscribeOrderDto.paymentPrice, // 결제금액
            orderStatus: item.subscribeOrderDto.orderStatus, // 주문상태
          },
          link: item._links.query_subscribeOrder.href, // 구독상세보기 Link
        }));
      
      const generalItemList =
        activeMenu === 'right' &&
        tmepItemList.map((item) => ({
          thumbnailUrl: decodeUrlToMatchApiProtocolAndSearchQuery(item.thumbnailUrl),
          orderDto: {
            id: item.orderDto.id,
            merchantUid: item.orderDto.merchantUid,
            paymentPrice: item.orderDto.paymentPrice,
            orderStatus: item.orderDto.orderStatus,
            orderDate: item.orderDto.orderDate,
          },
          itemNameList: item.itemNameList,
          link: item._links.query_order.href,
        }));
      
      const pageData = res?.data.page;
      newPageInfo = {
        totalPages: pageData.totalPages,
        size: pageData.size,
        totalItems: pageData.totalElements,
        currentPageIndex: pageData.number,
        newPageNumber: pageData.number + 1,
        newItemList: activeMenu === 'left' ? subscribeItemList : generalItemList,
      };
    }
  
    setItemType(activeMenu === 'left' ? productType.SUBSCRIBE : productType.GENERAL);
    
    return newPageInfo;
  };

  // console.log(itemType, itemList);

  return (
    <>
      <MetaTitle title="마이페이지 주문내역" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>주문내역</section>
            <Tabmenu_TwoButton
              leftMenuName={'정기구독'}
              rightMenuName={'일반상품'}
              getPositionHandler={setActiveMenu}
            />
            <TabContentContainer>
              <LeftContainer activeMenu={activeMenu}>
                {isLoading.fetching ? (
                  <EmptyContMessage>
                    <Spinner />
                  </EmptyContMessage>
                ) : itemType === productType.SUBSCRIBE && itemList.length === 0 ? (
                  <EmptyContMessage
                    message={'구독 중인 상품내역이 없습니다.'}
                    options={{ button: { url: '/surveyGuide', label: '정기구독 시작하기' } }}
                  ></EmptyContMessage>
                ) : (
                  itemType === productType.SUBSCRIBE && <SubscribeItems itemList={itemList} />
                )}
              </LeftContainer>
              <RightContainer activeMenu={activeMenu}>
                {isLoading.fetching ? (
                  <EmptyContMessage>
                    <Spinner />
                  </EmptyContMessage>
                ) : itemType === productType.GENERAL && itemList.length === 0 ? (
                  <EmptyContMessage
                    message={'주문한 상품내역이 없습니다.'}
                    options={{ button: { url: '/shop?itemType=ALL', label: '상품 담기' } }}
                  />
                ) : (
                  itemType === productType.GENERAL && <SingleItemList itemList={itemList} />
                )}
              </RightContainer>
            </TabContentContainer>
            {<section className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={activeMenu === 'left' ? subscribeApiUrl : generalItemApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterCeptor}
              />
            </section>}
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}
