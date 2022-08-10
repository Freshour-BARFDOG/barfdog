import React, { useEffect, useState } from 'react';
import s from './orderHistory.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import TabContentContainer, {
  LeftContainer,
  RightContainer,
} from '/src/components/atoms/TabContentContainer';
import Tabmenu_TwoButton from '/src/components/atoms/Tabmenu_TwoButton';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import animateWindow from '/util/func/animateWindow';
import { productType } from '/store/TYPE/itemType';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { SubscribeItems } from '/src/components/mypage/orderHistory/SubscribeItems';
import { SingleItemList } from '/src/components/mypage/orderHistory/SingleItemList';




export default function OrderHistoryPage() {
  const subscribeApiUrl = '/api/orders/subscribe';
  const generalItemApiUrl = '/api/orders/general';
  const searchPageSize = 10;

  const [isLoading, setIsLoading] = useState({});
  const [activeMenu, setActiveMenu] = useState('left');
  const [itemList, setItemList] = useState([]);
  const [itemType, setItemType] = useState(productType.SUBSCRIBE);

  console.log('itemList', itemList)
  useEffect(() => {
    // set Scroll Position: 페이지 최상단으로 scroll 위치 초기화 보완
    if (window && typeof window !== 'undefined') {
      const Y = window.scrollY;
      animateWindow(Y);
    }
  }, [activeMenu]);

  const pageInterCeptor = async (res) => {
    // console.log(res);
    // res = activeMenu === 'left' ? DUMMY_SUBSCRIBE_DELVIERY_RESPONSE : DUMMY_GENERAL_DELVIERY_RESPONSE; // ! TEST
    res = activeMenu === 'left' ? res : DUMMY_GENERAL_DELVIERY_RESPONSE; // ! TEST
    const pageData = res.data.page;
    const newItemList =
      res.data?._embedded[
        activeMenu === 'left' ? 'querySubscribeOrdersDtoList' : 'queryGeneralOrdersDtoList'
      ] || [];

    const subscribeItemList =
      activeMenu === 'left' &&
      newItemList.map((item) => ({
        recipeDto: {
          thumbnailUrl: item.recipeDto.thumbnailUrl,
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
      newItemList.map((item) => ({
        thumbnailUrl: item.thumbnailUrl,
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

    let newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList: activeMenu === 'left' ? subscribeItemList : generalItemList,
    };
    setItemType(activeMenu === 'left' ? productType.SUBSCRIBE : productType.GENERAL);
    return newPageInfo;
  };

  console.log(itemList);

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
                  />
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
            <section className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={activeMenu === 'left' ? subscribeApiUrl : generalItemApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterCeptor}
              />
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}




const DUMMY_SUBSCRIBE_DELVIERY_RESPONSE = {
  data: {
    _embedded: {
      querySubscribeOrdersDtoList: [
        {
          recipeDto: {
            thumbnailUrl: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
            recipeName: '스타트',
          },
          subscribeOrderDto: {
            orderId: 362,
            subscribeId: 311,
            orderDate: '2022-07-22T09:56:09.043',
            dogName: '김바프',
            subscribeCount: 9,
            merchantUid: 'merchant_uid8',
            paymentPrice: 120000,
            orderStatus: 'DELIVERY_READY',
          },
          _links: {
            query_subscribeOrder: {
              href: 'http://localhost:8080/api/orders/319/subscribe',
            },
            query_subscribe: {
              href: 'http://localhost:8080/api/subscribes/311',
            },
          },
        },
        {
          recipeDto: {
            thumbnailUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            recipeName: '스타트',
          },
          subscribeOrderDto: {
            orderId: 309,
            subscribeId: 301,
            orderDate: '2022-07-22T09:56:09',
            dogName: '김바프',
            subscribeCount: 8,
            merchantUid: 'merchant_uid7',
            paymentPrice: 170000,
            orderStatus: 'DELIVERY_READY',
          },
          _links: {
            query_subscribeOrder: {
              href: 'http://localhost:8080/api/orders/309/subscribe',
            },
            query_subscribe: {
              href: 'http://localhost:8080/api/subscribes/301',
            },
          },
        },
        {
          recipeDto: {
            thumbnailUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            recipeName: '스타트',
          },
          subscribeOrderDto: {
            orderId: 299,
            subscribeId: 291,
            orderDate: '2022-07-22T09:56:08.964',
            dogName: '김바프',
            subscribeCount: 7,
            merchantUid: 'merchant_uid6',
            paymentPrice: 58000,
            orderStatus: 'DELIVERY_READY',
          },
          _links: {
            query_subscribeOrder: {
              href: 'http://localhost:8080/api/orders/299/subscribe',
            },
            query_subscribe: {
              href: 'http://localhost:8080/api/subscribes/291',
            },
          },
        }
      ],
    },
    _links: {
      first: {
        href: 'http://localhost:8080/api/orders/subscribe?page=0&size=5',
      },
      prev: {
        href: 'http://localhost:8080/api/orders/subscribe?page=0&size=5',
      },
      self: {
        href: 'http://localhost:8080/api/orders/subscribe?page=1&size=5',
      },
      next: {
        href: 'http://localhost:8080/api/orders/subscribe?page=2&size=5',
      },
      last: {
        href: 'http://localhost:8080/api/orders/subscribe?page=2&size=5',
      },
      profile: {
        href: '/docs/index.html#resources-query-subscribeOrders',
      },
    },
    page: {
      size: 5,
      totalElements: 13,
      totalPages: 3,
      number: 1,
    },
  },
};

const DUMMY_GENERAL_DELVIERY_RESPONSE = {
  data: {
    _embedded: {
      queryGeneralOrdersDtoList: [
        {
          thumbnailUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          orderDate: '2022-08-22T09:56:08.964',
          orderDto: {
            id: 362,
            merchantUid: 'merchant_uid8',
            paymentPrice: 110000,
            orderStatus: 'BEFORE_PAYMENT',
            orderDate: '2022-08-22T09:56:08.964',
          },
          itemNameList: ['굿즈 상품1', '굿즈 상품2'],
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/orders/696/general',
            },
          },
        },
        {
          thumbnailUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          orderDto: {
            id: 675,
            merchantUid: 'merchant_uid7',
            paymentPrice: 170000,
            orderStatus: 'BEFORE_PAYMENT',
            orderDate: '2022-08-12T09:56:08.964',
          },
          itemNameList: ['굿즈 상품1', '굿즈 상품2'],
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/orders/675/general',
            },
          },
        },
        {
          thumbnailUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          orderDto: {
            id: 654,
            merchantUid: 'merchant_uid6',
            paymentPrice: 78000,
            orderStatus: 'BEFORE_PAYMENT',
            orderDate: '2022-07-22T09:56:08.964',
          },
          itemNameList: ['굿즈 상품1', '굿즈 상품2'],
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/orders/654/general',
            },
          },
        }
      ],
    },
    _links: {
      first: {
        href: 'http://localhost:8080/api/orders/general?page=0&size=5',
      },
      prev: {
        href: 'http://localhost:8080/api/orders/general?page=0&size=5',
      },
      self: {
        href: 'http://localhost:8080/api/orders/general?page=1&size=5',
      },
      next: {
        href: 'http://localhost:8080/api/orders/general?page=2&size=5',
      },
      last: {
        href: 'http://localhost:8080/api/orders/general?page=2&size=5',
      },
      profile: {
        href: '/docs/index.html#resources-query-generalOrders',
      },
    },
    page: {
      size: 5,
      totalElements: 13,
      totalPages: 3,
      number: 1,
    },
  },
};
