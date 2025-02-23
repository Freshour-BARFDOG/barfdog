import React, { useEffect, useRef, useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './delivery.module.scss';
import Image from 'next/image';
import TabContentContainer, {
  LeftContainer,
  RightContainer,
} from '/src/components/atoms/TabContentContainer';
import Tabmenu_TwoButton from '/src/components/atoms/Tabmenu_TwoButton';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import transformDate from '/util/func/transformDate';
import popupWindow from '/util/func/popupWindow';
import animateWindow from '/util/func/animateWindow';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { productType } from '/store/TYPE/itemType';
import Btn_01 from '/public/img/pages/delivery/delivery_icon_1.svg';

export default function DeliverInfoPage() {
  const initialItemType = productType.SUBSCRIBE;

  const subscribeApiUrl = '/api/deliveries/subscribe';
  const generalItemApiUrl = '/api/deliveries/general';
  const searchPageSize = 10;

  const [isLoading, setIsLoading] = useState({});
  const [activeMenu, setActiveMenu] = useState('left');
  const [itemList, setItemList] = useState([]);
  const [itemType, setItemType] = useState(initialItemType);

  useEffect(() => {
    // set Scroll Position: 정기구독과 일반상품 => 탭전환 시, 스크롤위치 초기화 blocking
    if (window && typeof window !== 'undefined') {
      const Y = window.scrollY;
      animateWindow(Y);
    }
  }, [activeMenu]);

  const pageInterCeptor = async (res) => {
    setItemType(
      activeMenu === 'left' ? productType.SUBSCRIBE : productType.GENERAL,
    );
    // console.log(res);
    // res = activeMenu === 'left' ? DUMMY_SUBSCRIBE_DELVIERY_RESPONSE : DUMMY_GENERAL_DELVIERY_RESPONSE; // ! TEST
    let newPageInfo = {
      totalPages: 0,
      size: 0,
      totalItems: 0,
      currentPageIndex: null,
      newPageNumber: null,
      newItemList: [],
    };
    if (res?.data._embedded) {
      const pageData = res.data.page;
      const newItemList =
        res.data?._embedded[
          activeMenu === 'left'
            ? 'querySubscribeDeliveriesDtoList'
            : 'queryGeneralDeliveriesDtoList'
        ];

      const subscribeItemList =
        activeMenu === 'left' &&
        newItemList.map((item) => ({
          recipeName: item.recipeName,
          deliveryDto: {
            orderId: item.deliveryDto.orderId,
            orderInfoUrl: item.deliveryDto.orderInfoUrl,
            orderDate: item.deliveryDto.orderDate,
            subscribeCount: item.deliveryDto.subscribeCount,
            dogName: item.deliveryDto.dogName,
            produceDate: item.deliveryDto.produceDate,
            nextDeliveryDate: item.deliveryDto.nextDeliveryDate,
            deliveryStatus: item.deliveryDto.deliveryStatus,
            deliveryNumber: item.deliveryDto.deliveryNumber,
            deliveryCode: item.deliveryDto.deliveryCode,
          },
        }));
      const generalItemList =
        activeMenu === 'right' &&
        newItemList.map((item) => ({
          orderDeliveryDto: {
            orderId: item.orderDeliveryDto.orderId,
            orderInfoUrl: item.orderDeliveryDto.orderInfoUrl,
            orderDate: item.orderDeliveryDto.orderDate, //
            deliveryStatus: item.orderDeliveryDto.deliveryStatus, ///
            deliveryNumber: item.orderDeliveryDto.deliveryNumber,
            deliveryCode: item.orderDeliveryDto.deliveryCode,
          },
          itemNameList: item.itemNameList,
        }));
      newPageInfo = {
        totalPages: pageData.totalPages,
        size: pageData.size,
        totalItems: pageData.totalElements,
        currentPageIndex: pageData.number,
        newPageNumber: pageData.number + 1,
        newItemList:
          activeMenu === 'left' ? subscribeItemList : generalItemList,
      };
    }
    return newPageInfo;
  };

  const onCheckOrderInfo = (e) => {
    const orderId = e.currentTarget.dataset.orderId;
    // console.log(orderId);
    const path = itemType === productType.SUBSCRIBE ? 'subscribe' : 'single';
    const url = `/mypage/orderHistory/${path}/${orderId}`;
    window.location.href = url;
  };

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 540, height: 480, left: 200, top: 100 });
  };

  // // console.log('activeMenu:',activeMenu, 'itemType: ', itemType,'itemList: ',itemList);

  return (
    <>
      <MetaTitle title="마이페이지 배송현황" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>배송현황</section>
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
                ) : itemType === productType.SUBSCRIBE &&
                  itemList.length === 0 ? (
                  <EmptyContMessage
                    message={'배송 중인 정기구독 상품이 없습니다.'}
                  />
                ) : (
                  itemType === productType.SUBSCRIBE && (
                    <ul className={`${s.content_body} content_body`}>
                      {itemList.map((item, i) => (
                        <li
                          key={`subscribe-item-list-${i}`}
                          className={s.grid_box}
                        >
                          <div className={s.col_1}>
                            <p>
                              {transformDate(
                                item.deliveryDto?.orderDate,
                                null,
                                {
                                  seperator: '.',
                                },
                              )}
                            </p>
                            <div></div>
                            <div>
                              {item.recipeName} (
                              {item.deliveryDto?.subscribeCount}
                              회차)&nbsp;&middot;&nbsp;
                              {item.deliveryDto?.dogName}
                            </div>
                            <button
                              className={s.text}
                              type={'button'}
                              data-order-id={item.deliveryDto?.orderId}
                              onClick={onCheckOrderInfo}
                            >
                              <div>
                                <div className={`${s.image} img-wrap`}>
                                  <Btn_01
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 16 16"
                                  />
                                  {/* <Image
                                    src={require('public/img/pages/delivery/delivery_icon_1.png')}
                                    objectFit="cover"
                                    layout="fill"
                                    alt="주문정보 아이콘"
                                  /> */}
                                </div>
                                주문정보
                              </div>
                            </button>
                          </div>
                          <div className={s.col_2}>
                            <p>조리예정일</p>
                            <span>
                              {transformDate(
                                item.deliveryDto?.produceDate,
                                '월일',
                              )}
                            </span>
                          </div>

                          <div className={s.col_3}>
                            <p>발송예정일</p>
                            <span>
                              {transformDate(
                                item.deliveryDto?.nextDeliveryDate,
                                '월일',
                              )}
                            </span>
                          </div>

                          <div className={s.col_4}>
                            {orderStatus.KOR[item.deliveryDto?.deliveryStatus]}
                          </div>

                          <div className={s.col_5}>
                            {/* 운송장번호 연결 */}
                            <a
                              href={`https://trace.goodsflow.com/VIEW/V1/whereis/${process.env.NEXT_PUBLIC_GOODSFLOW_SITECODE}/${item.deliveryDto?.deliveryCode}/${item.deliveryDto?.deliveryNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={onPopupHandler}
                            >
                              <button type={'button'} className={`${s.btn}`}>
                                배송조회
                              </button>
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </LeftContainer>

              <RightContainer activeMenu={activeMenu}>
                {isLoading.fetching ? (
                  <EmptyContMessage>
                    {' '}
                    <Spinner />
                  </EmptyContMessage>
                ) : itemType === productType.GENERAL &&
                  itemList.length === 0 ? (
                  <EmptyContMessage
                    message={'배송 중인 일반 상품이 없습니다.'}
                  />
                ) : (
                  itemType === productType.GENERAL && (
                    <ul className={s.content_body}>
                      {itemList.map((item, index) => (
                        <li
                          key={`general-item-list-${index}`}
                          className={`${s.grid_box} ${s.generalItem}`}
                        >
                          <div className={s.col_1}>
                            <p>
                              {transformDate(
                                item.orderDeliveryDto?.orderDate,
                                null,
                                {
                                  seperator: '.',
                                },
                              )}
                            </p>
                            <div></div>
                            <div>
                              {item.itemNameList[0]}&nbsp;
                              {item.itemNameList?.length > 1 &&
                                `외 ${item.itemNameList.length - 1}건`}
                            </div>
                            <button
                              className={s.text}
                              type={'button'}
                              data-order-id={item.orderDeliveryDto.orderId}
                              onClick={onCheckOrderInfo}
                            >
                              <div>
                                <div className={`${s.image} img-wrap`}>
                                  <Btn_01
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 16 16"
                                  />
                                  {/* <Image
                                    src={require('public/img/pages/delivery/delivery_icon_1.png')}
                                    objectFit="cover"
                                    layout="fill"
                                    alt="주문정보 아이콘"
                                  /> */}
                                </div>
                                주문정보
                              </div>
                            </button>
                          </div>

                          <div className={s.col_4}>
                            {
                              orderStatus.KOR[
                                item.orderDeliveryDto.deliveryStatus
                              ]
                            }
                          </div>

                          <div className={`${s.col_5} ${s['btn-section']}`}>
                            {/* TODO 운송장번호 연결 */}
                            <a
                              href={`https://trace.goodsflow.com/VIEW/V1/whereis/${process.env.NEXT_PUBLIC_GOODSFLOW_SITECODE}/${item.orderDeliveryDto.deliveryCode}/${item.orderDeliveryDto.deliveryNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={onPopupHandler}
                              data-order-id={item.orderDeliveryDto.orderId}
                            >
                              <button type={'button'} className={`${s.btn}`}>
                                배송조회
                              </button>
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </RightContainer>
            </TabContentContainer>

            <section className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={
                  activeMenu === 'left' ? subscribeApiUrl : generalItemApiUrl
                }
                size={searchPageSize}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                queryItemList={
                  activeMenu === 'left'
                    ? 'querySubscribeDeliveriesDtoList'
                    : 'queryGeneralDeliveriesDtoList'
                }
                pageInterceptor={pageInterCeptor}
              />
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

const availableSearchDeliveryCondition = (deliveryStatus) => {
  return (
    deliveryStatus === orderStatus.DELIVERY_START ||
    deliveryStatus === orderStatus.DELIVERY_DONE
  );
};

const DUMMY_SUBSCRIBE_DELVIERY_RESPONSE = {
  data: {
    _embedded: {
      querySubscribeDeliveriesDtoList: [
        {
          recipeName: '스타트',
          deliveryDto: {
            orderId: 9546,
            orderInfoUrl: 'http://localhost:8080/api/orders/9546/subscribe',
            orderDate: '2022-07-22T09:57:04.683',
            subscribeCount: 11,
            dogName: '김바프',
            produceDate: '2022-07-26',
            nextDeliveryDate: '2022-07-30',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj02392342310',
          },
        },
        {
          recipeName: '스타트',
          deliveryDto: {
            orderId: 9516,
            orderInfoUrl: 'http://localhost:8080/api/orders/9516/subscribe',
            orderDate: '2022-07-22T09:57:04.56',
            subscribeCount: 10,
            dogName: '김바프',
            produceDate: '2022-07-26',
            nextDeliveryDate: '2022-07-30',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj0239234239',
          },
        },
        {
          recipeName: '스타트',
          deliveryDto: {
            orderId: 9486,
            orderInfoUrl: 'http://localhost:8080/api/orders/9486/subscribe',
            orderDate: '2022-07-22T09:57:04.441',
            subscribeCount: 9,
            dogName: '김바프',
            produceDate: '2022-07-26',
            nextDeliveryDate: '2022-07-30',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj0239234238',
          },
        },
        {
          recipeName: '스타트',
          deliveryDto: {
            orderId: 9456,
            orderInfoUrl: 'http://localhost:8080/api/orders/9456/subscribe',
            orderDate: '2022-07-22T09:57:04.368',
            subscribeCount: 8,
            dogName: '김바프',
            produceDate: '2022-07-26',
            nextDeliveryDate: '2022-07-30',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj0239234237',
          },
        },
        {
          recipeName: '스타트',
          deliveryDto: {
            orderId: 9426,
            orderInfoUrl: 'http://localhost:8080/api/orders/9426/subscribe',
            orderDate: '2022-07-22T09:57:04.309',
            subscribeCount: 7,
            dogName: '김바프',
            produceDate: '2022-07-26',
            nextDeliveryDate: '2022-07-30',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj0239234236',
          },
        },
      ],
    },
    _links: {
      first: {
        href: 'http://localhost:8080/api/deliveries/subscribe?page=0&size=5',
      },
      prev: {
        href: 'http://localhost:8080/api/deliveries/subscribe?page=0&size=5',
      },
      self: {
        href: 'http://localhost:8080/api/deliveries/subscribe?page=1&size=5',
      },
      next: {
        href: 'http://localhost:8080/api/deliveries/subscribe?page=2&size=5',
      },
      last: {
        href: 'http://localhost:8080/api/deliveries/subscribe?page=2&size=5',
      },
      profile: {
        href: '/docs/index.html#resources-query-deliveries-subscribe',
      },
    },
    page: {
      size: 5,
      totalElements: 15,
      totalPages: 3,
      number: 1,
    },
  },
};

const DUMMY_GENERAL_DELVIERY_RESPONSE = {
  data: {
    _embedded: {
      queryGeneralDeliveriesDtoList: [
        {
          orderDeliveryDto: {
            orderId: 9866,
            orderInfoUrl: 'http://localhost:8080/api/orders/9866/general',
            orderDate: '2022-07-22T09:57:05.229',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj0239234239',
          },
          itemNameList: ['굿즈 상품1', '굿즈 상품2'],
        },
        {
          orderDeliveryDto: {
            orderId: 9836,
            orderInfoUrl: 'http://localhost:8080/api/orders/9836/general',
            orderDate: '2022-07-22T09:57:05.227',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj0239234238',
          },
          itemNameList: ['굿즈 상품1', '굿즈 상품2'],
        },
        {
          orderDeliveryDto: {
            orderId: 9806,
            orderInfoUrl: 'http://localhost:8080/api/orders/9806/general',
            orderDate: '2022-07-22T09:57:05.226',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj0239234237',
          },
          itemNameList: ['굿즈 상품1', '굿즈 상품2'],
        },
        {
          orderDeliveryDto: {
            orderId: 9776,
            orderInfoUrl: 'http://localhost:8080/api/orders/9776/general',
            orderDate: '2022-07-22T09:57:05.225',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj0239234236',
          },
          itemNameList: ['굿즈 상품1', '굿즈 상품2'],
        },
        {
          orderDeliveryDto: {
            orderId: 9746,
            orderInfoUrl: 'http://localhost:8080/api/orders/9746/general',
            orderDate: '2022-07-22T09:57:05.223',
            deliveryStatus: 'DELIVERY_START',
            deliveryNumber: 'cj0239234235',
          },
          itemNameList: ['굿즈 상품1', '굿즈 상품2'],
        },
      ],
    },
    _links: {
      first: {
        href: 'http://localhost:8080/api/deliveries/general?page=0&size=5',
      },
      prev: {
        href: 'http://localhost:8080/api/deliveries/general?page=0&size=5',
      },
      self: {
        href: 'http://localhost:8080/api/deliveries/general?page=1&size=5',
      },
      next: {
        href: 'http://localhost:8080/api/deliveries/general?page=2&size=5',
      },
      last: {
        href: 'http://localhost:8080/api/deliveries/general?page=2&size=5',
      },
      profile: {
        href: '/docs/index.html#resources-query-deliveries-general',
      },
    },
    page: {
      size: 5,
      totalElements: 14,
      totalPages: 3,
      number: 1,
    },
  },
};
