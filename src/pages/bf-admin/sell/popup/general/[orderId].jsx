import React from 'react';
import s from '/src/components/popup/admin_ProductInfo/popup_sell.module.scss';
import PopupWrapper from '@src/components/popup/PopupWrapper';
import { PopupCloseButton, PopupCloseButton_typeX } from '@src/components/popup/PopupCloseButton';
import ProductInfo_basicOrderInfo from '/src/components/popup/admin_ProductInfo/ProductInfo_basicOrderInfo';
import ProductInfo_orderStatusInfo from '/src/components/popup/admin_ProductInfo/ProductInfo_orderStatusInfo';
import ProductInfo_normItem from '/src/components/popup/admin_ProductInfo/ProductInfo_normalItem';
import ProductInfo_payment from '/src/components/popup/admin_ProductInfo/ProductInfo_payment';
import ProductInfo_delivery from '/src/components/popup/admin_ProductInfo/ProductInfo_delivery';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import {getDataSSR} from "/src/pages/api/reqData";

export default function Popup_GeneralOrderDetailInfoPage({ data }) {
  const canceldOrderStatusList = [
    { boxLabel: '취소', value: orderStatus.CANCEL_REQUEST },
    { boxLabel: '취소', value: orderStatus.CANCEL_DONE_BUYER },
    { boxLabel: '취소', value: orderStatus.CANCEL_DONE_SELLER },
    { boxLabel: '반품', value: orderStatus.RETURN_REQUEST },
    { boxLabel: '반품', value: orderStatus.RETURN_DONE_SELLER },
    { boxLabel: '반품', value: orderStatus.RETURN_DONE_BUYER },
    { boxLabel: '교환', value: orderStatus.EXCHANGE_REQUEST },
    { boxLabel: '교환', value: orderStatus.EXCHANGE_DONE_SELLER },
    { boxLabel: '교환', value: orderStatus.EXCHANGE_DONE_BUYER },
  ];

  let isCanceledOrderStatus = false;
  let canceledOrderStatusLabel = '주문';
  for (let i = 0; i < canceldOrderStatusList.length; i++) {
    if (data.orderStatus === canceldOrderStatusList[i].value) {
      isCanceledOrderStatus = true;
      canceledOrderStatusLabel = canceldOrderStatusList[i].boxLabel;
      break;
    }
  }
  
  console.log(data);

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
                    <ProductInfo_basicOrderInfo basicOrderInfo={data.orderInfoDto} />
                  </li>

                  {/* ! CANCEL STATUS일 경우, cancelReason....등의 param 추가하기 */}
                  {isCanceledOrderStatus && (
                    <li className={s['table-list']}>
                      <ProductInfo_orderStatusInfo
                        basicOrderInfo={{
                          ...data.orderInfoDto,
                          orderStatus: data.orderStatus,
                        }}
                        boxLabel={canceledOrderStatusLabel}
                      />
                    </li>
                  )}
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>
                        <span>{canceledOrderStatusLabel || '주문'}</span>상품
                      </h4>
                    </div>
                    {data.orderItemAndOptionDtoList.map((itemInfo, index) => (
                      <ProductInfo_normItem
                        key={`product-items-list-${index}`}
                        itemInfo={itemInfo}
                      />
                    ))}
                  </li>
                  {/* ! discountCoupon / couponName 필요 */}
                  <li className={s['table-list']}>
                    <ProductInfo_payment paymentInfo={data.paymentDto} />
                  </li>
                  <li className={s['table-list']}>
                    <ProductInfo_delivery
                      deliveryInfo={{
                        ...data.deliveryDto,
                        orderConfirmDate: data.paymentDto.orderConfirmDate,
                      }}
                    />
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


const isCancelReturnExchangeStatus = (status)=>{
  const canceldOrderStatusList = [
    orderStatus.CANCEL_REQUEST,
    orderStatus.CANCEL_DONE_BUYER,
    orderStatus.CANCEL_DONE_SELLER,
    orderStatus.RETURN_REQUEST,
    orderStatus.RETURN_DONE_SELLER,
    orderStatus.RETURN_DONE_BUYER,
    orderStatus.EXCHANGE_REQUEST,
    orderStatus.EXCHANGE_DONE_SELLER,
    orderStatus.EXCHANGE_DONE_BUYER,
  ];
  const isCanceledOrderStatus = canceldOrderStatusList.indexOf(status) >= 0;
  return isCanceledOrderStatus;
}

export async function getServerSideProps({ req, query }) {
  const { orderId } = query;
  let DATA = null;
  let orderStatus = null;
  const apiUrl = `/api/admin/orders/${orderId}/general`;
  const res = await getDataSSR(req, apiUrl);
  // console.log('RESONSE: ',res);
  // const res = DUMMY_DEFAULT_RES;
  if (res.data) {
    const data = res.data;
    console.log('________RESONSE: ',data);
    DATA = {
      orderStatus: data.paymentDto.orderStatus,
      orderInfoDto: {
        id: data.orderInfoDto.id,
        merchantUid: data.orderInfoDto.merchantUid,
        orderDate: data.orderInfoDto.orderDate,
        orderType: data.orderInfoDto.orderType,
        memberName: data.orderInfoDto.memberName,
        phoneNumber: data.orderInfoDto.phoneNumber,
        package: data.orderInfoDto.package,
        subscribe: data.orderInfoDto.subscribe,
        email: data.orderInfoDto.email,
      },
      orderItemAndOptionDtoList: data.orderItemAndOptionDtoList.map((info) => ({
        orderItemDto: {
          orderItemId: info.orderItemDto.orderItemId,
          itemName: info.orderItemDto.itemName,
          amount: info.orderItemDto.amount,
          finalPrice: info.orderItemDto.finalPrice,
          couponName: info.orderItemDto.couponName,
          discountAmount: info.orderItemDto.discountAmount,
          status: info.orderItemDto.status,
        },
        selectOptionDtoList: info.selectOptionDtoList.map((op) => ({
          optionName: op.optionName,
          price: op.price,
          amount: op.amount,
        })),
      })),
      paymentDto: {
        orderPrice: data.paymentDto.orderPrice,
        deliveryPrice: data.paymentDto.deliveryPrice,
        discountReward: data.paymentDto.discountReward,
        couponName: data.paymentDto?.couponName || null, // ! 서버에서 데이터 추가필요
        discountCoupon: data.paymentDto?.discountCoupon|| data.orderItemAndOptionDtoList?.map((info)=>info.orderItemDto.discountAmount).reduce((acc, cur)=> acc+ cur) || null , // ! 서버에서 데이터 추가 필요
        paymentPrice: data.paymentDto.paymentPrice,
        paymentMethod: data.paymentDto.paymentMethod,
        orderStatus: data.paymentDto.orderStatus,
        orderConfirmDate: data.paymentDto.orderConfirmDate,
      },
      deliveryDto: {
        recipientName: data.deliveryDto.recipientName,
        recipientPhone: data.deliveryDto.recipientPhone,
        zipcode: data.deliveryDto.zipcode,
        street: data.deliveryDto.street,
        detailAddress: data.deliveryDto.detailAddress,
        departureDate: data.deliveryDto.departureDate,
        arrivalDate: data.deliveryDto.arrivalDate,
        deliveryNumber: data.deliveryDto.deliveryNumber,
        request: data.deliveryDto.request,
      },
    };
    
    if(isCancelReturnExchangeStatus(DATA.orderStatus)){
      // ! 취소/반품/교환 상태일 경우 ===> 취소반품교환 정보 표기
      const orderItemIdList = DATA.orderItemAndOptionDtoList.map(list=>list.orderItemDto.orderItemId);
      for (const orderItemId in orderItemIdList) {
        const cancelApiUrl = `/api/admin/orders/orderItem/${orderItemId}`;
        const r = await getDataSSR(req, cancelApiUrl);
        console.log(r)
        if(r.data){ // ! PRODUCT CODE
          const data = r.data;
          // console.log('CANCEL RESPONSE DATA: ',data)
          const cancleInfo = data?.orderItemAndOptionDto[0] || {}; // 취소 사유는, 모든 아이템이 "공통적"으로 입력되므로, 아이템을 특정해도 무방함
          DATA = {
            ...DATA,
            orderInfoDto: {
              ...DATA.orderInfoDto,
              cancelRequestDate: cancleInfo.cancelRequestDate,
              cancelConfirmDate: cancleInfo.cancelConfirmDate,
              cancelReason: cancleInfo.cancelReason,
              cancelDetailReason: cancleInfo.cancelDetailReason,
              returnRequestDate: cancleInfo.returnRequestDate,
              returnConfirmDate: cancleInfo.returnConfirmDate,
              returnReason: cancleInfo.returnReason,
              returnDetailReason: cancleInfo.returnDetailReason,
              exchangeRequestDate: cancleInfo.exchangeRequestDate,
              exchangeConfirmDate: cancleInfo.exchangeConfirmDate,
              exchangeReason: cancleInfo.exchangeReason,
              exchangeDetailReason: cancleInfo.exchangeDetailReason,
            },
          }
        // }else { // ! else문 전부 , TEST 코드
        //   //'2022-09-13T21:14:27.98',
        //   DATA = {
        //     ...DATA,
        //     orderInfoDto: {
        //       ...DATA.orderInfoDto,
        //       cancelRequestDate: '2022-09-13T21:14:27.98',
        //       cancelConfirmDate: '2022-09-13T21:14:27.98',
        //       cancelReason: '유저입력 취소사유',
        //       cancelDetailReason: '유저입력 취소상세사유',
        //       returnRequestDate: '2022-09-13T21:14:27.98',
        //       returnConfirmDate: '2022-09-13T21:14:27.98',
        //       returnReason: '유저입력 교환사유',
        //       returnDetailReason: '유저입력 교환상세사유',
        //       exchangeRequestDate: '2022-09-13T21:14:27.98',
        //       exchangeConfirmDate: '2022-09-13T21:14:27.98',
        //       exchangeReason: '유저입력 반품사유',
        //       exchangeDetailReason: '유저입력 반품상세사유',
        //     },
        //   }
        }
      }
     
      
    }
  
  }
  return { props: { data: DATA, orderStatus } };
}





const DUMMY_DEFAULT_RES = {
  data: {
    orderInfoDto: {
      id: 7039,
      merchantUid: 'merchant_uid1',
      orderDate: '2022-08-18T11:19:49.783',
      orderType: 'general',
      memberName: '김회원',
      phoneNumber: '01099038544',
      package: false,
      subscribe: true,
      email: 'user@gmail.com',
    },
    orderItemAndOptionDtoList: [
      {
        orderItemDto: {
          orderItemId: 7030,
          itemName: '굿즈 상품1',
          amount: 1,
          finalPrice: 9000,
          couponName: '관리자 직접 발행 쿠폰1',
          discountAmount: 0,
          status: 'CONFIRM',
        },
        selectOptionDtoList: [
          {
            optionName: '옵션1',
            price: 1000,
            amount: 1,
          },
        ],
      },
      {
        orderItemDto: {
          orderItemId: 7036,
          itemName: '굿즈 상품2',
          amount: 2,
          finalPrice: 18000,
          couponName: '관리자 직접 발행 쿠폰2',
          discountAmount: 0,
          status: 'CONFIRM',
        },
        selectOptionDtoList: [
          {
            optionName: '옵션1',
            price: 1000,
            amount: 1,
          },
          {
            optionName: '옵션2',
            price: 2000,
            amount: 2,
          },
        ],
      },
    ],
    paymentDto: {
      orderPrice: 120000,
      deliveryPrice: 3000,
      discountReward: 7000,
      couponName: '관리자 직접 발행 쿠폰1',
      discountCoupon: 50000,
      paymentPrice: 60000,
      orderStatus: 'CONFIRM',
      orderConfirmDate: '2022-08-20T08:19:49.782',
    },
    deliveryDto: {
      recipientName: '김회원',
      recipientPhone: '01099038544',
      zipcode: '12345',
      street: '부산광역시 해운대구 센텀2로 19',
      detailAddress: '106호',
      departureDate: '2022-08-19T11:19:49.782',
      arrivalDate: '2022-08-21T11:19:49.782',
      deliveryNumber: 'cj0239234231',
    },
    _links: {
      self: {
        href: 'http://localhost:8080/api/admin/orders/7039/general',
      },
      profile: {
        href: '/docs/index.html#resources-query-admin-order-general',
      },
    },
  },
};

const DUMMY_CANCEL_EXCHANGE_RETURN_RES = {
  data: {
    orderInfoDto: {
      orderId: 7069,
      merchantUid: 'merchant_uid1',
      orderDate: '2022-08-12T11:19:50.638',
      orderType: 'general',
      memberName: '김회원',
      phoneNumber: '01099038544',
      package: false,
      subscribe: true,
      email: 'user@gmail.com',
    },
    orderItemAndOptionDto: {
      orderItemDto: {
        orderItemId: 7066,
        itemName: '굿즈 상품2',
        amount: 2,
        finalPrice: 18000,
        couponName: '관리자 직접 발행 쿠폰2',
        discountAmount: 0,
        status: 'CONFIRM',
        cancelReason: '이유',
        cancelDetailReason: '상세이유',
        cancelRequestDate: '2022-08-09T11:19:50.637',
        cancelConfirmDate: null,
        returnReason: '이유',
        returnDetailReason: '상세이유',
        returnRequestDate: '2022-08-09T11:19:50.637',
        returnConfirmDate: null,
        exchangeReason: '이유',
        exchangeDetailReason: '상세이유',
        exchangeRequestDate: '2022-08-09T11:19:50.637',
        exchangeConfirmDate: null,
      },
      selectOptionDtoList: [
        {
          optionName: '옵션1',
          price: 1000,
          amount: 1,
        },
        {
          optionName: '옵션2',
          price: 2000,
          amount: 2,
        },
      ],
    },
    paymentDto: {
      orderPrice: 120000,
      deliveryPrice: 0,
      discountReward: 10000,
      paymentPrice: 110000,
      orderStatus: 'CONFIRM',
      orderConfirmDate: '2022-08-12T08:19:50.637',
    },
    deliveryDto: {
      recipientName: '김회원',
      recipientPhone: '01099038544',
      zipcode: '12345',
      street: '부산광역시 해운대구 센텀2로 19',
      detailAddress: '106호',
      departureDate: '2022-08-08T11:19:50.637',
      arrivalDate: '2022-08-11T11:19:50.637',
      deliveryNumber: 'cj0239234231',
    },
    _links: {
      self: {
        href: 'http://localhost:8080/api/admin/orders/orderItem/7066',
      },
      profile: {
        href: '/docs/index.html#resources-query-admin-order-orderItem',
      },
    },
  },
};
