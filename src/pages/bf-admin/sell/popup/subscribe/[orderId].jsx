import React, { useEffect } from 'react';
import s from '/src/components/popup/admin_ProductInfo/popup_sell.module.scss';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import { PopupCloseButton, PopupCloseButton_typeX } from '/src/components/popup/PopupCloseButton';
import ProductInfo_basicOrderInfo from '/src/components/popup/admin_ProductInfo/ProductInfo_basicOrderInfo';
import ProductInfo_dog from '/src/components/popup/admin_ProductInfo/ProductInfo_dog';
import ProductInfo_subscribe from '/src/components/popup/admin_ProductInfo/ProductInfo_subscribe';
import ProductInfo_payment from '/src/components/popup/admin_ProductInfo/ProductInfo_payment';
import ProductInfo_delivery from '/src/components/popup/admin_ProductInfo/ProductInfo_delivery';
import ProductInfo_orderStatusInfo from '/src/components/popup/admin_ProductInfo/ProductInfo_orderStatusInfo';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';


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
  
  const isChangedSubscribeInfo = data.beforeSubscribeDto.id; // 구독내용을 바꾼적이 없다면 null;

  useEffect(() => {
    if (!data && window && typeof window !== 'undefined') {
      alert('데이터를 불러올 수 없습니다.');
    }
  }, []);

  // console.log(data);
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
                    {isChangedSubscribeInfo && <ProductInfo_subscribe subscribeInfo={data.beforeSubscribeDto} isChangedSubscribeInfo={true} />}
                    
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

const DUMMY_RES = {
  data: {
    subscribeOrderInfoDto: {
      id: 8691,
      merchantUid: 'merchant_uid1',
      orderDate: '2022-08-12T11:19:53.679',
      orderType: 'subscribe',
      memberName: '김회원',
      phoneNumber: '01099038544',
      cancelReason: '단순 변심',
      cancelDetailReason: '반려견이 체해서 소화를 못해요',
      cancelRequestDate: '2022-08-09T11:19:53.679',
      cancelConfirmDate: '2022-08-11T11:19:53.679',
      package: false,
      subscribe: true,
      email: 'user@gmail.com',
    },
    dogDto: {
      name: '김바프',
      inedibleFood: 'ETC',
      inedibleFoodEtc: '단무지, 콩',
      caution: '소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.소화불량이 있어요.',
    },
    subscribeDto: {
      id: 8683,
      subscribeCount: 2,
      plan: 'FULL',
      oneMealRecommendGram: 101.0,
      recipeName: '스타트,터키비프',
    },
    beforeSubscribeDto: {
      id: 8684,
      subscribeCount: 1,
      plan: 'HALF',
      oneMealRecommendGram: 140.0,
      recipeName: '덕램',
    },
    subscribePaymentDto: {
      orderPrice: 120000,
      deliveryPrice: 3000,
      discountReward: 7000,
      couponName: '관리자 직접 발행 쿠폰1',
      discountCoupon: 50000,
      paymentPrice: 60000,
      orderStatus: 'CANCEL_DONE_SELLER',
      orderConfirmDate: '2022-08-12T08:19:53.679',
    },
    subscribeDeliveryDto: {
      recipientName: '김회원',
      recipientPhone: '01099038544',
      zipcode: '12345',
      street: '부산광역시 해운대구 센텀2로 19',
      detailAddress: '106호',
      departureDate: '2022-08-08T11:19:53.667',
      arrivalDate: '2022-08-11T11:19:53.667',
      deliveryNumber: 'cj0239234231',
    },
    _links: {
      self: {
        href: 'http://localhost:8080/api/admin/orders/8691/subscribe',
      },
      profile: {
        href: '/docs/index.html#resources-query-admin-order-subscribe',
      },
    },
  },
};

export async function getServerSideProps({ req, query }) {
  const { orderId } = query;
  let DATA = null;
  let orderStatus = null;
  const apiUrl = `/api/admin/orders/${orderId}/subscribe`;
  const res =DUMMY_RES;
  // const res = await getDataSSR(req, apiUrl);
  if (res.data) {
    const data = res.data;
    DATA = {
      orderStatus: data.subscribePaymentDto.orderStatus,
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
        oneMealRecommendGram:data.subscribeDto.oneMealRecommendGram,
        recipeName:data.subscribeDto.recipeName,
      },
      beforeSubscribeDto: {
        id:data.beforeSubscribeDto.id, // ! 구독 id => 구독정보 바꾼 적 없으면 null
        subscribeCount:data.beforeSubscribeDto.subscribeCount,
        plan:data.beforeSubscribeDto.plan,
        oneMealRecommendGram:data.beforeSubscribeDto.oneMealRecommendGram,
        recipeName:data.beforeSubscribeDto.recipeName,
      },
      subscribePaymentDto: {
        orderPrice:data.subscribePaymentDto.orderPrice, // 상품 총 금액
        deliveryPrice:data.subscribePaymentDto.deliveryPrice,
        discountReward:data.subscribePaymentDto.discountReward,
        couponName:data.subscribePaymentDto.couponName,
        discountCoupon:data.subscribePaymentDto.discountCoupon,
        paymentPrice:data.subscribePaymentDto.paymentPrice, // 결제 금액
        orderStatus:data.subscribePaymentDto.orderStatus,
        orderConfirmDate:data.subscribePaymentDto.orderConfirmDate, // 구매 확정일
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
      },
    };
  }
  return { props: { data: DATA, orderStatus } };
}
