import React, { useState, useMemo } from 'react';
import s from 'src/pages/mypage/orderHistory/orderHistoryOrdersheet.module.scss';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { paymentMethodType } from '/store/TYPE/paymentMethodType';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import { getDataSSR, postObjData} from '/src/pages/api/reqData';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import popupWindow from '/util/func/popupWindow';
import { valid_deliveryCondition } from '/util/func/validation/valid_deliveryCondition';
import transformDate from '/util/func/transformDate';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import { Modal_changeItemOrderState } from '/src/components/modal/Modal_changeItemOrderState';
import { filter_availableReturnAndExchangeItemList } from '/util/func/filter_availableReturnAndExchangeItemList';
import { valid_availableCancelOrder } from '/util/func/validation/valid_availableCancelOrder';
import {general_itemType} from "/store/TYPE/itemType";
import {validation_ReturnableAndExchangeableOrders} from "/util/func/validation/validation_ReturnableAndExchangeableOrders";
import {useModalContext} from "/store/modal-context";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import {CancelReasonName} from "../../../../../store/TYPE/order/CancelReasonName";




const valid_CancelableOrder = (itemList) => {
  let result = {
    totalCancel: true,
    partialCancel: true,
  };
  for (const objInArr of itemList) {
    const itemStatus = objInArr.status;
    
    // ! 전체취소만 가능 => 아이템 각각 조회하여, 취소불가능한 상태가 하나라도 존재일 경우 , 취소 불가
    const valid = valid_availableCancelOrder(itemStatus);
    if (!valid) {
      result.partialCancel = false;
    }
    // ! 모든 상품의 주문상태가 결제 완료일 경우, 전체 취소 가능
    if (itemStatus !== orderStatus.PAYMENT_DONE) {
      result.totalCancel = false;
    }
  }
  
  return result
};


const filter_availableConfirmItemList = (itemList) => itemList.filter((item) => {
  return item.status === orderStatus.DELIVERY_DONE && item.status !== orderStatus.CONFIRM;
});


export default function SingleItem_OrderHistoryPage({ data }) {
  // // console.log(data);
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const originItemList = data.orderItemDtoList;
  const [activeModal, setActiveModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [filteredItemList, setFilteredItemList] = useState([]); // 구매확정 시, 구매확정 대상에 사용됨

  
  const initializeModalState = () => {
    setFilteredItemList(originItemList);
    setConfirmMessage('');
    setActiveModal(null);
    setConfirmType(null);
  };
  const resultOfCancelableOrder = useMemo( () => valid_CancelableOrder(originItemList), [] );
  const availableImmediatelyCancle = resultOfCancelableOrder.totalCancel;
  const availableCancleState = resultOfCancelableOrder.partialCancel;
  // // console.log('전체취소 가능여부: ', availableImmediatelyCancle);
  // // console.log('취소기능 활성여부: ', availableCancleState);

  const isAvailableReturnAndExchangeState = useMemo( () => validation_ReturnableAndExchangeableOrders(originItemList).valid, [] );
  
  
  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return console.error('window is not defined');
    const href = e.currentTarget.href;
    popupWindow(href, { width: 540, height: 480, left: 200, top: 100 });
  };



  
  const onStartConfirm = () => {
    const availableItemList = filter_availableConfirmItemList(originItemList);
    if (!availableItemList.length) return mct.alertShow('구매확정 가능한 상품이 없습니다.');
    setFilteredItemList(availableItemList);
    setActiveModal({ confirm: true });
    setConfirmType(orderStatus.CONFIRM);
  };

  const onStartReturn = () => {
    const availableItemList = filter_availableReturnAndExchangeItemList(originItemList);
    if (!availableItemList.length) return mct.alertShow('반품 가능한 상품이 없습니다.');
    //  ! 전체반품 Ver.
    const result = validation_ReturnableAndExchangeableOrders(originItemList);
    if(!result.valid){
      const message = result.message.join(`\n`);
      return mct.alertShow(message);
    }
    
    
    setFilteredItemList(availableItemList);
    setActiveModal({ return: true });
    setConfirmType(orderStatus.RETURN_REQUEST);
  };

  const onStartExchange = () => {
    const availableItemList = filter_availableReturnAndExchangeItemList(originItemList);
    if (!availableItemList.length) return mct.alertShow('교환 가능한 상품이 없습니다.');
    
    //  ! 전체반품 Ver.
    const result = validation_ReturnableAndExchangeableOrders(originItemList);
    if(!result.valid){
      const message = result.message.join(`\n`);
      return mct.alertShow(message);
    }

    setFilteredItemList(availableItemList);
    setActiveModal({ exchange: true });
    setConfirmType(orderStatus.EXCHANGE_REQUEST);
  };

  const onStartCancel = () => {
    if (availableImmediatelyCancle) {
      // 즉시 취소
      setActiveModal({ cancle: true });
      setConfirmMessage(`전체 상품이 즉시 주문취소됩니다.`);
      setConfirmType(orderStatus.CANCEL_REQUEST);
    } else {
      // 취소 요청 시작
      setActiveModal({ cancelRequest: true });
      setConfirmType(orderStatus.CANCEL_REQUEST);
    }
  };

  const onOrderCancle = async (confirm) => {
    if (!confirm) return initializeModalState();

    const body = {
      reason: CancelReasonName.cancelNowOfGeneralOrderByBuyer,
      detailReason: CancelReasonName.cancelNowOfGeneralOrderByBuyerAsDetailReason,
    };
    try {
      const r = await postObjData(
        `/api/orders/${data?.orderDto.orderId}/general/cancelRequest`,
        body,
      );
      // console.log(r);
      if (r.isDone) {
        alert(CancelReasonName.cancelNowOfGeneralOrderByBuyer);
        window.location.reload();
      } else {
        alert('전체 주문 결제취소 요청 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }

    setActiveModal(null);
  };
  
  const onPrevPage = async () => {
    window.location.href='/mypage/orderHistory'
  }
  
  return (
    <>
      {hasAlert && <Modal_global_alert/>}
      {activeModal?.cancle && (
        <Modal_confirm
          text={confirmMessage}
          isConfirm={onOrderCancle}
          positionCenter
          option={{ wordBreak: true }}
        />
      )}
      {(activeModal?.exchange ||
        activeModal?.return ||
        activeModal?.confirm ||
        activeModal?.cancelRequest) && (
        <Modal_changeItemOrderState
          onHideModal={initializeModalState}
          confirmType={confirmType}
          items={originItemList}
          hasForm={!activeModal?.confirm}
        />
      )}
      <MetaTitle title="마이페이지 주문내역 일반상품" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>주문상세정보</section>
            <section>
              <h1 className={s.body_title}>
                <p>주문상품</p>
                <div className={s['order-button-controller']}>
                  {availableCancleState && (
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
                <div className={`${s.info_autoConfirmation} ${s.general}`}>
                  <p>구매확정은 배송완료 후 아래 기간이 지나면 자동으로 처리됩니다.</p>
                  <p>* 신선식품(생식, 토핑): 2일 / 비신선식품: 7일</p>
                </div>
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
                      <em className={s.desc}>(정기구독 배송 시, 함께 배송)</em>
                    )}
                  </span>
                </div>
              </div>

            </section>

            <section className={s.body}>
              <h6 className={s.body_title}>배송조회</h6>
              <div className={s.body_content_3}>
                {valid_deliveryCondition( data?.orderDto.deliveryStatus ) ? (
                  <p className={s.emptyCont}>배송 중 상태에서 조회 가능합니다.</p>
                ) : (
                  <ul className={s.content_grid}>
                    <li>CJ대한통운</li>
                    <li>
                      <span>운송장번호</span> {data?.orderDto.deliveryNumber || '(발급 전)'}
                    </li>
                    <li className={s.deliveryStatus}>
                      {orderStatus.KOR[data?.orderDto.deliveryStatus]}
                    </li>
                    {data?.orderDto.deliveryNumber && <li>
                      <a
                        href={`https://trace.goodsflow.com/VIEW/V1/whereis/${process.env.NEXT_PUBLIC_GOODSFLOW_SITECODE}/CJGLS/${data?.orderDto.deliveryNumber}`}
                        target="_blank"
                        rel={'noreferrer'}
                        onClick={onPopupHandler}
                      >
                        <button>배송조회</button>
                      </a>
                    </li>}
                  </ul>
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

                  <span>총 할인금액</span>
                  <span>{data?.orderDto.discountTotal > 0 && '-'}{transformLocalCurrency(data?.orderDto.discountTotal - (data?.orderDto.overDiscount || 0) )}원</span>
  
                  <span>ㄴ 적립금 사용</span>
                  <span>{data?.orderDto.discountReward > 0 && '-'}{transformLocalCurrency(data?.orderDto.discountReward)}원</span>
                  
                  <span>ㄴ 쿠폰 할인</span>
                  <span>{data?.orderDto.discountCoupon > 0 && '-'}{transformLocalCurrency(data?.orderDto.discountCoupon)}원</span>
  
                  {data?.orderDto.overDiscount > 0 && <>
                    <span>ㄴ 쿠폰 할인 소멸 </span>
                    <span className={"pointColor"}>+&nbsp;{transformLocalCurrency(data?.orderDto.overDiscount)}원</span>
                  </>}
                  
  
                  
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
              option={{ data: data }}
            />
            <section className={s.btn_section}>
              <button type={'button'} className={'custom_btn solid basic_l'} onClick={onPrevPage}>돌아가기</button>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

const AdditionalOrderStatusInfo = ({
  orderTypeAsLabel,
  originItemList,
  targetOrderStatusList = [],
  paymentMethod,
  option = {},
}) => {
  const repItem = originItemList[0]; // 모든 아이템의 공통적인 상태(ex.환불상태, 환불수단 등) 사용을 위해 임의로 1가지 아이템을 선택.
  let orderQuery = 'orderCancel';
  if (
    repItem.status === orderStatus.CANCEL_DONE_SELLER ||
    repItem.status === orderStatus.CANCEL_DONE_BUYER
  ) {
    orderQuery = 'orderCancel';
  } else if (
    repItem.status === orderStatus.RETURN_DONE_SELLER ||
    repItem.status === orderStatus.RETURN_DONE_BUYER
  ) {
    orderQuery = 'orderReturn';
  }
  if (
    repItem.status === orderStatus.EXCHANGE_DONE_SELLER ||
    repItem.status === orderStatus.EXCHANGE_DONE_BUYER
  ) {
    orderQuery = 'orderExchange';
  }
  const data = option.data;
  const deliveryPrice = data.orderDto.deliveryPrice;
  const responsibility = repItem.status === orderStatus.CANCEL_DONE_BUYER ? 'BUYER' : 'SELLER';
  const totalReturnPrice = option.data.orderDto.paymentPrice; //
  return (
    <>
      {originItemList.filter((item) => targetOrderStatusList.indexOf(item.status) >= 0).length >
        0 && (
        <section className={`${s['additional-info-section']} ${s.body_content_2}`}>
          <h6 className={s.body_title}>{orderTypeAsLabel} 정보</h6>
          <div className={s.grid_box}>
            <span>{orderTypeAsLabel} 상태</span>
            <span>
              {orderStatus.KOR[repItem.status].indexOf('(') >= 0
                ? orderStatus.KOR[repItem.status].split('(').map((str, i) => (
                    <em className={s.orderStatus} key={`addition-orderStatus-${i}`}>
                      {i === 1 && '('}
                      {str}
                    </em>
                  ))
                : orderStatus.KOR[repItem.status]}
            </span>
          
            <span>{orderTypeAsLabel} 요청일자</span>
            <span>
              {transformDate(repItem[orderQuery].requestDate, 'time', {
                seperator: '.',
              })}
            </span>
            <span>{orderTypeAsLabel} 처리일자</span>
            <span>
              {transformDate(repItem[orderQuery].confirmDate, 'time', {
                seperator: '.',
              })}
            </span>
            <span>{orderTypeAsLabel} 사유</span>
            <span>{repItem[orderQuery].reason || '-'}</span>
            <span>{orderTypeAsLabel} 상세사유</span>
            <span>{repItem[orderQuery].detailReason || '-'}</span>
            {/*<span>{orderTypeAsLabel} 상품명</span>*/}
            {/*<div className={s.itemNameList}>*/}
            {/*  {originItemList.map((item, i) => <span key={`cancel-state-item-${i}`}>{item.itemName}</span>)}*/}
            {/*</div>*/}
            <span>총 환불금액</span>
            <span>{transformLocalCurrency(totalReturnPrice)}원</span> {/* ____  */}
            <span>환불 수단</span>
            <span>{paymentMethod}</span>
          </div>
        </section>
      )}
    </>
  );
};



export async function getServerSideProps(ctx) {
  const { query, req } = ctx;

  const orderIdx = query.orderIdx;

  let DATA = null;
  const getApiUrl = `/api/orders/${orderIdx}/general`; // 일반 주문 하나 조회

  let res = await getDataSSR(req, getApiUrl);
  // res = DUMMY_RESPONSE; // ! TEST
  const data = res?.data;
  // console.log('------singleItem Data: ',data);
  // // console.log('SERVER REPONSE: ', res);
  if(data.status === 500){
    return {
      redirect:{
        destination: '/mypage/orderHistory'
      }
    }
  } else if (data) {
    DATA = {
      orderItemDtoList: data.orderItemDtoList?.map((item) => ({
        arrivalDate: data.orderDto.arrivalDate || null, // ! 확인필요 => 전체 배송완료상태를, 상품 각각에 부여하는것 (예외가 없다면 그대로 진행)
        orderId: data.orderDto.orderId, // 주문 id
        orderItemId: item.orderItemId, // 주문한 상품 id
        thumbnailUrl: item.thumbnailUrl,
        selectOptionDtoList: item.selectOptionDtoList.map((op) => ({
          optionName: op.optionName,
          optionAmount: op.optionAmount,
        })),
        itemName: item.itemName,
        amount: item.amount,
        finalPrice: item.finalPrice,
        discountAmount: item.discountAmount,
        status: item.status,
        saveReward: item.saveReward,
        category: general_itemType[item.category],
        orderCancel: {
          reason: item.orderCancel?.cancelReason || null,
          detailReason: item.orderCancel?.cancelDetailReason || null,
          requestDate: item.orderCancel?.cancelRequestDate || null,
          confirmDate: item.orderCancel?.cancelConfirmDate || null,
        },
        orderReturn: {
          reason: item.orderReturn?.returnReason || null,
          detailReason: item.orderReturn?.returnDetailReason || null,
          requestDate: item.orderReturn?.returnRequestDate || null,
          confirmDate: item.orderReturn?.returnConfirmDate || null,
        },
        orderExchange: {
          reason: item.orderExchange?.exchangeReason || null,
          detailReason: item.orderExchange?.exchangeDetailReas || null,
          requestDate: item.orderExchange?.exchangeRequestDate || null,
          confirmDate: item.orderExchange?.exchangeConfirmDate || null,
        },
      })),
      orderDto: {
        orderId: data.orderDto.orderId,
        merchantUid: data.orderDto.merchantUid,
        paymentDate: data.orderDto.paymentDate,
        deliveryNumber: data.orderDto.deliveryNumber,
        arrivalDate: data.orderDto.arrivalDate || null,
        orderPrice: data.orderDto.orderPrice,
        deliveryPrice: data.orderDto.deliveryPrice,
        discountTotal: data.orderDto.discountTotal,
        discountReward: data.orderDto.discountReward,
        discountCoupon: data.orderDto.discountCoupon,
        overDiscount: data.orderDto.overDiscount || null, // 쿠폰 할인 소멸  // api-server field 변경에 대응 -> 추후 null 대응 제외해도 됨
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
    // // console.log(DATA);
  }
  return { props: { orderIdx, data: DATA } };
}
