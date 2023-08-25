import React, {useEffect} from 'react';
import s from '/src/components/popup/admin_ProductInfo/popup_sell.module.scss';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import {PopupCloseButton, PopupCloseButton_typeX} from '/src/components/popup/PopupCloseButton';
import ProductInfo_basicOrderInfo from '/src/components/popup/admin_ProductInfo/ProductInfo_basicOrderInfo';
import ProductInfo_dog from '/src/components/popup/admin_ProductInfo/ProductInfo_dog';
import ProductInfo_subscribe from '/src/components/popup/admin_ProductInfo/ProductInfo_subscribe';
import ProductInfo_payment from '/src/components/popup/admin_ProductInfo/ProductInfo_payment';
import ProductInfo_delivery from '/src/components/popup/admin_ProductInfo/ProductInfo_delivery';
import ProductInfo_orderStatusInfo from '/src/components/popup/admin_ProductInfo/ProductInfo_orderStatusInfo';
import {orderStatus} from '/store/TYPE/orderStatusTYPE';
import {getDataSSR} from "/src/pages/api/reqData";
import {isChangedSubscribeInformation} from "/util/func/subscribe/isChangedSubscribeInformation";
import {ProductInfo_iamport} from "/src/components/popup/admin_ProductInfo/ProductInfo_iamport";


export default function Popup_SubscribeOrderDetailInfoPage({ data }) {
  const canceldOrderStatusList = [
    { boxLabel: '취소', value: orderStatus.CANCEL_REQUEST },
    { boxLabel: '취소', value: orderStatus.CANCEL_DONE_BUYER },
    { boxLabel: '취소', value: orderStatus.CANCEL_DONE_SELLER },
  ];
  
  let isCanceledOrderStatus = false;
  let canceledOrderStatusLabel = '취소';
  for (let i = 0; i < canceldOrderStatusList.length; i++) {
    if (data.orderStatus === canceldOrderStatusList[i].value) {
      isCanceledOrderStatus = true;
      break;
    }
  }
  

  useEffect(() => {
    if (!data && window && typeof window !== 'undefined') {
      alert('데이터를 불러올 수 없습니다.');
    }
  }, []);
  
  return (
    <>
      <div id={s.popup}>
        <PopupWrapper style={{ width: 1000 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s['popup-title']}>주문상세정보</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <section className={s.table}>
                <ul>
                  <li className={s['table-list']}>
                    <ProductInfo_iamport data={{impUid: data.subscribePaymentDto.impUid}}/>
                  </li>
                  <li className={s['table-list']}>
                    <ProductInfo_basicOrderInfo basicOrderInfo={data.subscribeOrderInfoDto} />
                  </li>
                  {isCanceledOrderStatus && (
                    <li className={s['table-list']}>
                      <ProductInfo_orderStatusInfo
                        basicOrderInfo={{
                          ...data.subscribeOrderInfoDto,
                          orderStatus: data.orderStatus,
                        }}
                        boxLabel={canceledOrderStatusLabel}
                      />
                    </li>
                  )}
                  <li className={s['table-list']}>
                    <ProductInfo_dog dogInfo={data.dogDto} />
                  </li>
                  <li className={s['table-list']}>
                    <ProductInfo_subscribe subscribeInfo={data.subscribeDto} />
                    {data.orderStatus === orderStatus.RESERVED_PAYMENT && isChangedSubscribeInformation({before:data.beforeSubscribeDto, after:data.subscribeDto})
                      && <ProductInfo_subscribe subscribeInfo={data.beforeSubscribeDto} isChangedSubscribeInfo={true} />
                    }
                  </li>
                  <li className={s['table-list']}>
                    <ProductInfo_payment paymentInfo={data.subscribePaymentDto} />
                  </li>
                  <li className={s['table-list']}>
                    <ProductInfo_delivery deliveryInfo={{
                      ...data.subscribeDeliveryDto,
                      orderConfirmDate: data.subscribePaymentDto.orderConfirmDate
                    }} />
                  </li>
                </ul>
              </section>
              <section className={s['btn-section']}>
                <PopupCloseButton />
              </section>
            </div>
          </main>
        </PopupWrapper>
      </div>
    </>
  );
}


export async function getServerSideProps({ req, query }) {
  const { orderId } = query;
  let DATA = null;
  let orderStatus = null;
  const apiUrl = `/api/admin/orders/${orderId}/subscribe`;
  // const res =DUMMY_RES;
  const res = await getDataSSR(req, apiUrl);
  console.log(res?.data);
  if (res?.data) {
    const data = res.data;

    DATA = {
      orderStatus: data.subscribePaymentDto?.orderStatus,
      subscribeOrderInfoDto: {
        id: data.subscribeOrderInfoDto.id, // 주문 id
        merchantUid: data.subscribeOrderInfoDto.merchantUid, // 주문 번호
        orderDate: data.subscribeOrderInfoDto.orderDate,
        orderType: data.subscribeOrderInfoDto.orderType, // 주문 유형
        memberName: data.subscribeOrderInfoDto.memberName,
        phoneNumber: data.subscribeOrderInfoDto.phoneNumber,
        cancelReason: data.subscribeOrderInfoDto.cancelReason, // 취소 이유 , 없으면 null
        cancelDetailReason: data.subscribeOrderInfoDto.cancelDetailReason, // 취소 상세 이유 , 없으면 null
        cancelRequestDate: data.subscribeOrderInfoDto.cancelRequestDate, // 취소 신청 일자 , 없으면 null
        cancelConfirmDate: data.subscribeOrderInfoDto.cancelConfirmDate, // 취소 확인 일자 , 없으면 null
        package: data.subscribeOrderInfoDto.package, // 묶음배송 여부 true/false
        subscribe: data.subscribeOrderInfoDto.subscribe, // 구독 여부 true/false
        email: data.subscribeOrderInfoDto.email, // 구매자 email
      },
      dogDto: {
        name: data.dogDto.name,
        inedibleFood: data.dogDto.inedibleFood,
        inedibleFoodEtc: data.dogDto.inedibleFoodEtc,
        caution: data.dogDto.caution,
      },
      subscribeDto: {
        id: data.subscribeDto.id,
        subscribeCount:data.subscribeDto.subscribeCount,
        plan:data.subscribeDto.plan,
        oneMealGramsPerRecipe:data.subscribeDto.oneMealGramsPerRecipe || null, // api-server 변경된 field 이름 대응 -> 추후 null 값 제외해도 됨
        recipeName:data.subscribeDto.recipeName,
      },
      beforeSubscribeDto: {
        id:data.beforeSubscribeDto.id, // ! 구독 id => 구독정보 바꾼 적 없으면 null
        subscribeCount:data.beforeSubscribeDto.subscribeCount,
        plan:data.beforeSubscribeDto.plan,
        oneMealGramsPerRecipe:data.beforeSubscribeDto.oneMealGramsPerRecipe  || null, // api-server 변경된 field 이름 대응 -> 추후 null 값 제외해도 됨
        recipeName:data.beforeSubscribeDto.recipeName,
      },
      subscribePaymentDto: {
        orderPrice:data.subscribePaymentDto.orderPrice, // 상품 총 금액
        discountGrade:data.subscribePaymentDto.discountGrade  || null, // api-server 변경된 field 이름 대응 -> 추후 null 값 제외해도 됨
        deliveryPrice:data.subscribePaymentDto.deliveryPrice,
        discountReward:data.subscribePaymentDto.discountReward,
        couponName:data.subscribePaymentDto.couponName,
        discountCoupon:data.subscribePaymentDto.discountCoupon,
        overDiscount:data.subscribePaymentDto.overDiscount || null, // 초과할인금액  // api-server 변경된 field 이름 대응 -> 추후 null 값 제외해도 됨
        paymentPrice:data.subscribePaymentDto.paymentPrice, // 결제 금액
        paymentMethod:data.subscribePaymentDto.paymentMethod,
        orderStatus:data.subscribePaymentDto.orderStatus,
        orderConfirmDate:data.subscribePaymentDto.orderConfirmDate, // 구매 확정일
        impUid:data.subscribePaymentDto.impUid || null, // 포트원 고유번호
      },
      subscribeDeliveryDto: {
        recipientName: data.subscribeDeliveryDto.recipientName,
        recipientPhone: data.subscribeDeliveryDto.recipientPhone,
        zipcode: data.subscribeDeliveryDto.zipcode,
        street: data.subscribeDeliveryDto.street,
        detailAddress: data.subscribeDeliveryDto.detailAddress,
        departureDate: data.subscribeDeliveryDto.departureDate,
        arrivalDate: data.subscribeDeliveryDto.arrivalDate,
        deliveryNumber: data.subscribeDeliveryDto.deliveryNumber,
        request:data.subscribeDeliveryDto.request,
      },
    };
  }
  return { props: { data: DATA, orderStatus } };
}
