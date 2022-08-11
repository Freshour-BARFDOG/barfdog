import React, { useState } from 'react';
import s from 'src/pages/mypage/orderHistory/orderHistoryOrdersheet.module.scss';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { paymentMethodType } from '/store/TYPE/paymentMethodType';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import { getDataSSR } from '/src/pages/api/reqData';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import popupWindow from '/util/func/popupWindow';
import { valid_deliveryCondition } from '/util/func/validation/valid_deliveryCondition';
import transformDate from '/util/func/transformDate';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import { Modal_changeItemOrderState } from '/src/components/modal/Modal_changeItemOrderState';
import { filter_availableReturnAndExchangeItemList } from '/util/func/filter_availableReturnAndExchangeItemList';
import { valid_availableCancelOrder } from '/util/func/validation/valid_availableCancelOrder';

// ! =====> 상품정보란 보완필요
// ! =====> 배송완료 시점필요
// ! =====> 환불금액 총합 , 환불배송비 계산

export default function SingleItem_OrderHistoryPage({ data }) {
  // console.log(data)
  const originItemList = data.orderItemDtoList;
  const [activeModal, setActiveModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [filteredItemList, setFilteredItemList] = useState({});
  let isAvailableCancleState = true;
  for (const objInArr of originItemList) {
    // ! 전체취소만 가능 => 아이템 각각 조회하여, 취소불가능한 상태가 하나라도 존재일 경우 , 취소 불가
    const itemStatus = objInArr.status;
    const valid = valid_availableCancelOrder(itemStatus);
    if (!valid) {
      isAvailableCancleState = false;
      break;
    }
  }
  /////////////////////////////////////////// ! TEST 임시 추가 => filter_availableReturnAndExchangeItemList 내부에 , TEST코드 들어있음
  const isAvailableReturnAndExchangeState =
    filter_availableReturnAndExchangeItemList(originItemList);
  /////////////////////////////////////////// ! TEST 임시 추가 => filter_availableReturnAndExchangeItemList 내부에 , TEST코드 들어있음
  console.log(isAvailableReturnAndExchangeState);
  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return console.error('window is not defined');
    const href = e.currentTarget.href;
    popupWindow(href, { width: 540, height: 480, left: 200, top: 100 });
  };

  const initializeModalState = () => {
    setFilteredItemList(originItemList);
    setConfirmMessage('');
    setActiveModal(null);
    setConfirmType(null);
  };

  const filter_availableConfirmItemList = (itemList) => {
    return itemList.filter((item) => {
      return item.status === orderStatus.DELIVERY_DONE && item.status !== orderStatus.CONFIRM;
    });
  };

  const onStartConfirm = () => {
    const availableItemList = filter_availableConfirmItemList(originItemList);
    if (!availableItemList.length) return alert('구매확정 가능한 상품이 없습니다.');
    setFilteredItemList(availableItemList);
    setActiveModal({ confirm: true });
    setConfirmType(orderStatus.CONFIRM);
  };

  const onStartReturn = () => {
    const availableItemList = filter_availableReturnAndExchangeItemList(originItemList);
    if (!availableItemList.length) return alert('반품 가능한 상품이 없습니다.');
    setFilteredItemList(availableItemList);
    setActiveModal({ return: true });
    setConfirmType(orderStatus.RETURN_REQUEST);
  };

  const onStartExchange = () => {
    const availableItemList = filter_availableReturnAndExchangeItemList(originItemList);
    if (!availableItemList.length) return alert('교환 가능한 상품이 없습니다.');
    setFilteredItemList(availableItemList);
    setActiveModal({ exchange: true });
    setConfirmType(orderStatus.EXCHANGE_REQUEST);
  };
  const onStartCancel = () => {
    setActiveModal({ cancle: true });
    setConfirmMessage(`전체 상품이 주문 취소됩니다.`);
    setConfirmType(orderStatus.CANCEL_REQUEST);
  };

  const onOrderCancle = (confirm) => {
    if (!confirm) return initializeModalState();
    console.log('전체 주문취소 API 실행 // 부분 취소 불가');
  };

  const confirmBCallbackType = {
    [orderStatus.CANCEL_REQUEST]: onOrderCancle,
    // [orderStatus.CONFIRM]: addSomeFunction, // 필요한 function을 추가하면 됨
  };

  console.log(originItemList);

  return (
    <>
      <MetaTitle title="마이페이지 주문내역 일반상품" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>주문상세정보</section>

            <section>
              <h1 className={s.body_title}>
                <p>주문상품</p>
                <div className={s['order-button-controller']}>
                  {isAvailableCancleState && (
                    <button
                      type={'button'}
                      className={`${s.btn} ${s.cancel}`}
                      onClick={onStartCancel}
                    >
                      주문취소
                    </button>
                  )}
                  {isAvailableReturnAndExchangeState && (
                    <>
                      <button type={'button'} className={`${s.btn}`} onClick={onStartReturn}>
                        반품신청
                      </button>
                      <button type={'button'} className={`${s.btn}`} onClick={onStartExchange}>
                        교환신청
                      </button>
                    </>
                  )}
                </div>
              </h1>

              <section className={`${s.body_content_4} ${s.generalItemInfoBox}`}>
                <div className={s.grid_title}>
                  <span className={s.col_1}>상품 정보</span>
                  <span className={s.col_2}>수량</span>
                  <span className={s.col_3}>총 주문금액</span>
                  <span className={s.col_4}>쿠폰할인</span>
                  <span className={s.col_5}>주문상태</span>
                </div>

                {/* TODO 서버에서 받은 아이템 리스트 */}
                <ul>
                  {originItemList.map((item, i) => (
                    <li
                      key={`order-item-${i}`}
                      className={`${s.grid_box2} ${s.item}`}
                      data-item-order-status={item.status}
                    >
                      <span className={`${s.col_1} ${s.itemInfo}`}>
                        <figure className={`${s.image} img-wrap`}>
                          <Image
                            src={item.thumbnailUrl}
                            objectFit="cover"
                            layout="fill"
                            alt="레시피 썸네일"
                          />
                        </figure>
                        <figcaption className={s.inner_text}>
                          <p className={s.top_text}>{item.itemName}</p>
                          {item.selectOptionDtoList.length > 0 &&
                            item.selectOptionDtoList?.map((opt, i) => (
                              <p key={`order-item-option-${i}`} className={s.mid_text}>
                                {opt.optionName}&nbsp;/&nbsp;{opt.optionAmount}개
                              </p>
                            ))}
                        </figcaption>
                      </span>
                      <span className={`${s.col_2} ${s.count}`}>{item.amount}개</span>
                      <span className={`${s.col_3} ${s.price}`}>
                        {transformLocalCurrency(item.finalPrice)}원
                      </span>
                      <span
                        className={`${s.col_4} ${s.discountAmount} ${
                          item.discountAmount > 0 ? s.discount : ''
                        }`}
                      >
                        {item.discountAmount > 0 && '-'}
                        {transformLocalCurrency(item.discountAmount)}원
                      </span>
                      <span className={`${s.col_5} ${s.orderStatus}`}>
                        <span className={s.text}>
                          {orderStatus.KOR[item.status].indexOf('(') >= 0
                            ? orderStatus.KOR[item.status].split('(').map((str, i) => (
                                <p className={s.orderStatus} key={`order-item-status-${i}`}>
                                  {i === 1 && '('}
                                  {str}
                                </p>
                              ))
                            : orderStatus.KOR[item.status]}
                        </span>
                        {item.status === orderStatus.DELIVERY_DONE && (
                          <button
                            type={'button'}
                            className={`${s.btn} ${s.confirm}`}
                            onClick={onStartConfirm}
                            data-item-name={item.itemName}
                          >
                            구매확정
                          </button>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </section>

            <section className={s.body}>
              <h6 className={s.body_title}>주문정보</h6>
              <div className={s.body_content_2}>
                <div className={s.grid_box}>
                  <span>주문번호</span>
                  <span>{data?.orderDto.merchantUid}</span>
                  <span>주문(결제)일시</span>
                  <span>
                    {transformDate(data?.orderDto.paymentDate, 'time', { seperator: '/' })}
                  </span>
                  <span>배송정보</span>
                  <span>
                    {data?.orderDto.package ? `묶음 배송` : '일반 배송'}&nbsp;
                    {data.orderDto.package && (
                      <em className={s.desc}>(다음 정기구독 배송 시, 함께 배송)</em>
                    )}
                  </span>
                </div>
              </div>
            </section>

            <section className={s.body}>
              <h6 className={s.body_title}>배송조회</h6>
              <div className={s.body_content_3}>
                {!valid_deliveryCondition(data?.orderDto.deliveryStatus) ? (
                  <ul className={s.content_grid}>
                    <li>CJ대한통운</li>
                    <li>운송장번호&nbsp;{data?.orderDto.deliveryNumber || '(발급 전)'}</li>
                    <li className={s.deliveryStatus}>
                      {orderStatus.KOR[data?.orderDto.deliveryStatus]}
                    </li>
                    <li>
                      <a
                        href={`http://nexs.cjgls.com/web/service02_01.jsp?slipno=${data?.orderDto.deliveryNumber}`}
                        target="_blank"
                        rel={'noreferrer'}
                        onClick={onPopupHandler}
                      >
                        <button>배송조회</button>
                      </a>
                    </li>
                  </ul>
                ) : (
                  <p className={s.emptyCont}>배송 중 상태에서 조회 가능합니다.</p>
                )}
              </div>
            </section>

            {/* 주문상품 결제정보 배송정보 */}
            <section className={s.body}>
              <h6 className={s.body_title}>결제정보</h6>
              <div className={s.body_content_2}>
                <div className={s.grid_box}>
                  <span>주문금액</span>
                  <span>{transformLocalCurrency(data?.orderDto.orderPrice)}원</span>

                  <span>배송비</span>
                  <span>{transformLocalCurrency(data?.orderDto.deliveryPrice)}원</span>

                  <span>할인금액</span>
                  <span>{transformLocalCurrency(data?.orderDto.discountTotal)}원</span>

                  <span>적립금 사용</span>
                  <span>{transformLocalCurrency(data?.orderDto.discountReward)}원</span>

                  <span>쿠폰사용</span>
                  <span>{transformLocalCurrency(data?.orderDto.discountCoupon)}원</span>

                  <span>결제 금액</span>
                  <span>{transformLocalCurrency(data?.orderDto.paymentPrice)}원</span>

                  <span>적립예정금액</span>
                  <span>{transformLocalCurrency(data?.savedRewardTotal)}원</span>

                  <span>결제방법</span>
                  <span>{paymentMethodType.KOR[data.orderDto.paymentMethod]}</span>
                </div>
              </div>
            </section>

            <section className={s.body}>
              <h6 className={s.body_title}>배송정보</h6>
              <div className={s.body_content_2}>
                <div className={s.grid_box}>
                  <span>받는 분</span>
                  <span>{data?.orderDto.name}</span>

                  <span>핸드폰</span>
                  <span>{transformPhoneNumber(data?.orderDto.phone)}</span>

                  <span>배송방법</span>
                  <span>택배배송</span>

                  <span>배송주소</span>
                  <span>
                    {data?.orderDto.street} {data?.orderDto.detailAddress}
                  </span>
                  <span>배송요청사항</span>
                  <span>{data?.orderDto.request || '-'}</span>
                </div>
              </div>
            </section>
            <AdditionalOrderStatusInfo
              orderTypeAsLabel={'환불'}
              originItemList={originItemList}
              targetOrderStatusList={[
                orderStatus.CANCEL_DONE_BUYER,
                orderStatus.CANCEL_DONE_SELLER,
                orderStatus.EXCHANGE_DONE_BUYER,
                orderStatus.EXCHANGE_DONE_SELLER,
                orderStatus.RETURN_DONE_BUYER,
                orderStatus.RETURN_DONE_SELLER,
              ]}
              paymentMethod={paymentMethodType.KOR[data.orderDto.paymentMethod]}
              orderQuery={'orderCancel'}
            />
            {/*<AdditionalOrderStatusInfo*/}
            {/*  orderTypeAsLabel={'교환'}*/}
            {/*  originItemList={originItemList}*/}
            {/*  targetOrderStatusList={[*/}
            {/*    orderStatus.EXCHANGE_DONE_BUYER,*/}
            {/*    orderStatus.EXCHANGE_DONE_SELLER,*/}
            {/*  ]}*/}
            {/*  paymentMethod={paymentMethodType.KOR[data.orderDto.paymentMethod]}*/}
            {/*  orderQuery={'orderExchange'}*/}
            {/*/>*/}
            {/*<AdditionalOrderStatusInfo*/}
            {/*  orderTypeAsLabel={'반품'}*/}
            {/*  originItemList={originItemList}*/}
            {/*  targetOrderStatusList={[*/}
            {/*    orderStatus.RETURN_DONE_BUYER,*/}
            {/*    orderStatus.RETURN_DONE_SELLER,*/}
            {/*  ]}*/}
            {/*  paymentMethod={paymentMethodType.KOR[data.orderDto.paymentMethod]}*/}
            {/*  orderQuery={'orderReturn'}*/}
            {/*/>*/}
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {activeModal?.cancle && (
        <Modal_confirm
          text={confirmMessage}
          isConfirm={confirmBCallbackType[confirmType]}
          positionCenter
          option={{ wordBreak: true }}
        />
      )}
      {(activeModal?.exchange || activeModal?.return || activeModal?.confirm) && (
        <Modal_changeItemOrderState
          onHideModal={initializeModalState}
          confirmType={confirmType}
          items={filteredItemList}
          hasForm={!activeModal?.confirm}
        />
      )}
    </>
  );
}

const AdditionalOrderStatusInfo = ({
  orderTypeAsLabel,
  originItemList,
  targetOrderStatusList = [],
  paymentMethod,
}) => {
  return (
    <>
      {originItemList.filter((item) => targetOrderStatusList.indexOf(item.status) >= 0).length >
        0 && (
        <section className={`${s['additional-info-section']}`}>
          <h6 className={s.body_title}>{orderTypeAsLabel} 정보</h6>
          <ul>
            {originItemList
              .filter((item) => targetOrderStatusList.indexOf(item.status) >= 0)
              .map((item, i) => {
                 let orderQuery = 'orderCancel';
                if (
                  item.status === orderStatus.CANCEL_DONE_SELLER ||
                  item.status === orderStatus.CANCEL_DONE_BUYER
                ) {
                  orderQuery = 'orderCancel';
                } else if (
                  item.status === orderStatus.RETURN_DONE_SELLER ||
                  item.status === orderStatus.RETURN_DONE_BUYER
                ) {
                  orderQuery = 'orderReturn';
                }
                if (
                  item.status === orderStatus.EXCHANGE_DONE_SELLER ||
                  item.status === orderStatus.EXCHANGE_DONE_BUYER
                ) {
                  orderQuery = 'orderExchange';
                }

                console.log(orderQuery)
                return (
                  <li key={`cancel-state-item-${i}`} className={s.body_content_2}>
                    <span>{orderTypeAsLabel} 상태</span>
                    <span>
                      {orderStatus.KOR[item.status].indexOf('(') >= 0
                        ? orderStatus.KOR[item.status].split('(').map((str, i) => (
                            <em className={s.orderStatus} key={`addition-orderStatus-${i}`}>
                              {i === 1 && '('}
                              {str}
                            </em>
                          ))
                        : orderStatus.KOR[item.status]}
                    </span>

                    <span>{orderTypeAsLabel} 상품명</span>
                    <span>{item.itemName}</span>
                    <span>{orderTypeAsLabel} 요청일자</span>
                    <span>
                      {transformDate(item[orderQuery].requestDate, 'time', {
                        seperator: '.',
                      })}
                    </span>
                    <span>{orderTypeAsLabel} 처리일자</span>
                    <span>
                      {transformDate(item[orderQuery].confirmDate, 'time', {
                        seperator: '.',
                      })}
                    </span>

                    <span>{orderTypeAsLabel} 사유</span>
                    <span>{item[orderQuery].reason}</span>

                    <span>{orderTypeAsLabel} 상세사유</span>
                    <span>{item[orderQuery].detailReason}</span>

                    <span>상품 금액</span>
                    <span>{transformLocalCurrency(item.finalPrice)}원</span>

                    <span>상품 할인금액</span>
                    <span>{transformLocalCurrency(item.discountAmount)}원</span>

                    <span>총 환불금액</span>
                    <span>{transformLocalCurrency(item.finalPrice - item.discountAmount)}원</span>

                    <span>환불 수단</span>
                    <span>{paymentMethod}</span>
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;

  const orderIdx = query.orderIdx;

  let DATA = null;
  const getApiUrl = `/api/orders/${orderIdx}/general`;

  let res = await getDataSSR(req, getApiUrl);
  res = DUMMY_RESPONSE; // ! TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
  // console.log('SERVER REPONSE: ', res);
  const data = res?.data;
  console.log(data);

  if (data) {
    DATA = {
      orderItemDtoList: data.orderItemDtoList?.map((item) => ({
        orderItemId: item.orderItemId, // 주문한 상품 id
        thumbnailUrl: item.thumbnailUrl,
        selectOptionDtoList: item.selectOptionDtoList,
        itemName: item.itemName,
        amount: item.amount,
        finalPrice: item.finalPrice,
        discountAmount: item.discountAmount,
        status: item.status,
        saveReward: item.saveReward,
        orderCancel: {
          reason: item.orderCancel.cancelReason,
          detailReason: item.orderCancel.cancelDetailReason,
          requestDate: item.orderCancel.cancelRequestDate,
          confirmDate: item.orderCancel.cancelConfirmDate,
        },
        orderReturn: {
          reason: item.orderReturn.returnReason,
          detailReason: item.orderReturn.returnDetailReason,
          requestDate: item.orderReturn.returnRequestDate,
          confirmDate: item.orderReturn.returnConfirmDate,
        },
        orderExchange: {
          reason: item.orderExchange.exchangeReason,
          detailReason: item.orderExchange.exchangeDetailReason,
          requestDate: item.orderExchange.exchangeRequestDate,
          confirmDate: item.orderExchange.exchangeConfirmDate,
        },
      })),
      orderDto: {
        orderId: data.orderDto.orderId,
        merchantUid: data.orderDto.merchantUid,
        paymentDate: data.orderDto.paymentDate,
        deliveryNumber: data.orderDto.deliveryNumber,
        orderPrice: data.orderDto.orderPrice,
        deliveryPrice: data.orderDto.deliveryPrice,
        discountTotal: data.orderDto.discountTotal,
        discountReward: data.orderDto.discountReward,
        discountCoupon: data.orderDto.discountCoupon,
        paymentPrice: data.orderDto.paymentPrice,
        paymentMethod: data.orderDto.paymentMethod,
        name: data.orderDto.name,
        phone: data.orderDto.phone,
        zipcode: data.orderDto.zipcode,
        street: data.orderDto.street,
        detailAddress: data.orderDto.detailAddress,
        request: data.orderDto.request,
        package: data.orderDto.package,
      },
      savedRewardTotal: data.savedRewardTotal,
    };
    console.log(DATA);
  }
  return { props: { orderIdx, data: DATA } };
}

const DUMMY_RESPONSE = {
  data: {
    orderItemDtoList: [
      {
        orderItemId: 416,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
        selectOptionDtoList: [],
        itemName: '굿즈 상품1',
        amount: 1,
        finalPrice: 9000,
        discountAmount: 0,
        status: 'BEFORE_PAYMENT',
        saveReward: 500,
        orderCancel: {
          cancelReason: '이유',
          cancelDetailReason: '상세이유',
          cancelRequestDate: '2022-07-19T09:56:10.014',
          cancelConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderReturn: {
          returnReason: '이유',
          returnDetailReason: '상세이유',
          returnRequestDate: '2022-07-19T09:56:10.014',
          returnConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderExchange: {
          exchangeReason: '이유',
          exchangeDetailReason: '상세이유',
          exchangeRequestDate: '2022-07-19T09:56:10.014',
          exchangeConfirmDate: '2022-07-21T09:56:10.014',
        },
      },
      {
        orderItemId: 425,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
        selectOptionDtoList: [
          {
            optionName: '옵션1',
            optionAmount: 1,
          },
          {
            optionName: '옵션2옵션2옵션2옵션2옵션2옵션2옵션2옵션2옵션2옵션2',
            optionAmount: 2,
          },
          {
            optionName: '옵션3',
            optionAmount: 2,
          },
          {
            optionName: '옵션4',
            optionAmount: 2,
          },
        ],
        itemName: '굿즈 상품2',
        amount: 2,
        finalPrice: 18000,
        discountAmount: 1000,
        status: 'DELIVERY_DONE',
        saveReward: 1000,
        orderCancel: {
          cancelReason: '이유',
          cancelDetailReason: '상세이유',
          cancelRequestDate: '2022-07-19T09:56:10.016',
          cancelConfirmDate: '2022-07-21T09:56:10.016',
        },
        orderReturn: {
          returnReason: '이유',
          returnDetailReason: '상세이유',
          returnRequestDate: '2022-07-19T09:56:10.016',
          returnConfirmDate: '2022-07-21T09:56:10.016',
        },
        orderExchange: {
          exchangeReason: '이유',
          exchangeDetailReason: '상세이유',
          exchangeRequestDate: '2022-07-19T09:56:10.016',
          exchangeConfirmDate: '2022-07-21T09:56:10.016',
        },
      },
      {
        orderItemId: 426,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
        selectOptionDtoList: [],
        itemName: '굿즈 상품3',
        amount: 1,
        finalPrice: 9000,
        discountAmount: 0,
        status: 'CONFIRM',
        saveReward: 500,
        orderCancel: {
          cancelReason: '이유',
          cancelDetailReason: '상세이유',
          cancelRequestDate: '2022-07-19T09:56:10.014',
          cancelConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderReturn: {
          returnReason: '이유',
          returnDetailReason: '상세이유',
          returnRequestDate: '2022-07-19T09:56:10.014',
          returnConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderExchange: {
          exchangeReason: '이유',
          exchangeDetailReason: '상세이유',
          exchangeRequestDate: '2022-07-19T09:56:10.014',
          exchangeConfirmDate: '2022-07-21T09:56:10.014',
        },
      },
      {
        orderItemId: 427,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
        selectOptionDtoList: [],
        itemName: '굿즈 상품4',
        amount: 1,
        finalPrice: 9000,
        discountAmount: 0,
        status: 'RETURN_REQUEST',
        saveReward: 500,
        orderCancel: {
          cancelReason: '이유',
          cancelDetailReason: '상세이유',
          cancelRequestDate: '2022-07-19T09:56:10.014',
          cancelConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderReturn: {
          returnReason: '이유',
          returnDetailReason: '상세이유',
          returnRequestDate: '2022-07-19T09:56:10.014',
          returnConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderExchange: {
          exchangeReason: '이유',
          exchangeDetailReason: '상세이유',
          exchangeRequestDate: '2022-07-19T09:56:10.014',
          exchangeConfirmDate: '2022-07-21T09:56:10.014',
        },
      },
      {
        orderItemId: 428,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
        selectOptionDtoList: [],
        itemName: '굿즈 상품5',
        amount: 1,
        finalPrice: 9000,
        discountAmount: 0,
        status: 'EXCHANGE_REQUEST',
        saveReward: 500,
        orderCancel: {
          cancelReason: '이유',
          cancelDetailReason: '상세이유',
          cancelRequestDate: '2022-07-19T09:56:10.014',
          cancelConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderReturn: {
          returnReason: '이유',
          returnDetailReason: '상세이유',
          returnRequestDate: '2022-07-19T09:56:10.014',
          returnConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderExchange: {
          exchangeReason: '이유',
          exchangeDetailReason: '상세이유',
          exchangeRequestDate: '2022-07-19T09:56:10.014',
          exchangeConfirmDate: '2022-07-21T09:56:10.014',
        },
      },
      {
        orderItemId: 429,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
        selectOptionDtoList: [],
        itemName: '굿즈 상품6 (취소완료상품)',
        amount: 2,
        finalPrice: 9000,
        discountAmount: 1000,
        status: 'CANCEL_DONE_SELLER',
        saveReward: 500,
        orderCancel: {
          cancelReason: '이유',
          cancelDetailReason: '상세이유',
          cancelRequestDate: '2022-07-19T09:56:10.014',
          cancelConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderReturn: {
          returnReason: '이유',
          returnDetailReason: '상세이유',
          returnRequestDate: '2022-07-19T09:56:10.014',
          returnConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderExchange: {
          exchangeReason: '이유',
          exchangeDetailReason: '상세이유',
          exchangeRequestDate: '2022-07-19T09:56:10.014',
          exchangeConfirmDate: '2022-07-21T09:56:10.014',
        },
      },
      {
        orderItemId: 430,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
        selectOptionDtoList: [],
        itemName: '굿즈 상품7 (교환완료상품)',
        amount: 2,
        finalPrice: 9000,
        discountAmount: 1000,
        status: 'EXCHANGE_DONE_BUYER',
        saveReward: 500,
        orderCancel: {
          cancelReason: '이유',
          cancelDetailReason: '상세이유',
          cancelRequestDate: '2022-07-19T09:56:10.014',
          cancelConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderReturn: {
          returnReason: '이유',
          returnDetailReason: '상세이유',
          returnRequestDate: '2022-07-19T09:56:10.014',
          returnConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderExchange: {
          exchangeReason: '이유',
          exchangeDetailReason: '상세이유',
          exchangeRequestDate: '2022-07-19T09:56:10.014',
          exchangeConfirmDate: '2022-07-21T09:56:10.014',
        },
      },
      {
        orderItemId: 431,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
        selectOptionDtoList: [],
        itemName: '굿즈 상품8 (반품완료상품)',
        amount: 2,
        finalPrice: 19000,
        discountAmount: 2000,
        status: 'RETURN_DONE_BUYER',
        saveReward: 500,
        orderCancel: {
          cancelReason: '이유',
          cancelDetailReason: '상세이유',
          cancelRequestDate: '2022-07-19T09:56:10.014',
          cancelConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderReturn: {
          returnReason: '반품이유',
          returnDetailReason: '반품상세이유',
          returnRequestDate: '2022-07-19T09:56:10.014',
          returnConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderExchange: {
          exchangeReason: '이유',
          exchangeDetailReason: '상세이유',
          exchangeRequestDate: '2022-07-19T09:56:10.014',
          exchangeConfirmDate: '2022-07-21T09:56:10.014',
        },
      },
      {
        orderItemId: 432,
        thumbnailUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
        selectOptionDtoList: [],
        itemName: '굿즈 상품9 (반품완료상품22222)',
        amount: 2,
        finalPrice: 39000,
        discountAmount: 6000,
        status: 'RETURN_DONE_SELLER',
        saveReward: 3500,
        orderCancel: {
          cancelReason: '이유',
          cancelDetailReason: '상세이유',
          cancelRequestDate: '2022-07-19T09:56:10.014',
          cancelConfirmDate: '2022-07-21T09:56:10.014',
        },
        orderReturn: {
          returnReason: '반품이유222222',
          returnDetailReason: '반품상세이유22222',
          returnRequestDate: '2022-08-19T09:56:10.014',
          returnConfirmDate: '2022-08-24T09:56:10.014',
        },
        orderExchange: {
          exchangeReason: '이유',
          exchangeDetailReason: '상세이유',
          exchangeRequestDate: '2022-07-19T09:56:10.014',
          exchangeConfirmDate: '2022-07-21T09:56:10.014',
        },
      },
    ],
    orderDto: {
      orderId: 428,
      merchantUid: 'merchant_uid1',
      paymentDate: '2022-07-20T09:56:10.013',
      deliveryNumber: 'cj0239234231',
      orderPrice: 120000,
      deliveryPrice: 0,
      discountTotal: 10000,
      discountReward: 10000,
      discountCoupon: 5000,
      paymentPrice: 105000,
      paymentMethod: 'CREDIT_CARD',
      name: '김회원',
      phone: '01012341234',
      zipcode: '12345',
      street: '부산광역시 해운대구 센텀2로 19',
      detailAddress: '106호',
      request: '안전배송 부탁드립니다.',
      package: false,
    },
    savedRewardTotal: 1500,
    _links: {
      self: {
        href: 'http://localhost:8080/api/orders/428/general',
      },
      generalOrder_cancel_request: {
        href: 'http://localhost:8080/api/orders/428/general/cancelRequest',
      },
      profile: {
        href: '/docs/index.html#resources-query-generalOrder',
      },
    },
  },
};
