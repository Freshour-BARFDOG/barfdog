import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from 'src/pages/mypage/orderHistory/orderHistoryOrdersheet.module.scss';
import Image from 'next/image';
import { getDataSSR, postObjData } from '/src/pages/api/reqData';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import popupWindow from '/util/func/popupWindow';
import {valid_deliveryCondition} from "/util/func/validation/valid_deliveryCondition";
import {subscribePlanType} from "/store/TYPE/subscribePlanType";
import transformDate from "/util/func/transformDate";
import {orderStatus} from "/store/TYPE/orderStatusTYPE";
import { useState } from 'react';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import { filter_availableReturnAndExchangeItemList } from '/util/func/filter_availableReturnAndExchangeItemList';
import { valid_availableCancelOrder } from '/util/func/validation/valid_availableCancelOrder';

export default function SubScribe_OrderHistoryPage({ data, orderIdx }) {

  // console.log(data);

  const [activeModal, setActiveModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmType, setConfirmType] = useState('');

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return console.error('window is not defined');
    const href = e.currentTarget.href;
    popupWindow(href, { width: 540, height: 480, left: 200, top: 100 });
  };
  
  const initializeModalState = () => {
    // setFilteredItemList(originItemList);
    setConfirmMessage('');
    setActiveModal(null);
    setConfirmType(null);
  };

  const onStartCancel = () => {
    setActiveModal({ cancle: true });
    setConfirmMessage(`구독 상품이 주문 취소됩니다.`);
    setConfirmType(orderStatus.CANCEL_REQUEST);
  };

  const onOrderCancle = async (confirm) => {
    if (!confirm) return initializeModalState();
    console.log('전체 주문취소 API 실행 // 부분 취소 불가');
    
    const r = await postObjData(`/api/orders/${orderIdx}/subscribe/cancelRequest`);
    console.log(r);
    if(r.isDone){
      alert('구독 주문 결제취소완료');
      window.location.reload();
    }
    
    setActiveModal(null);
    
  };

  const confirmBCallbackType = {
    [orderStatus.CANCEL_REQUEST]: onOrderCancle,
    // [orderStatus.CONFIRM]: addSomeFunction, // 필요한 function을 추가하면 됨
  };

  return (
    <>
      <MetaTitle title="마이페이지 주문내역 정기구독" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>주문상세정보</section>

            <section>
              <h1 className={s.body_title}>
                <p>주문상품</p>
                <div className={s['order-button-controller']}>
                  <button
                    type={'button'}
                    className={`${s.btn} ${s.cancel}`}
                    onClick={onStartCancel}
                  >
                    주문취소
                  </button>
                  <>
                    <button type={'button'} className={`${s.btn}`}>
                      반품신청
                    </button>
                    <button type={'button'} className={`${s.btn}`}>
                      교환신청
                    </button>
                  </>
                </div>
              </h1>


              <span className={s.change}>
                {data?.orderDto.beforePlan === null &&
                data?.orderDto.beforeOneMealRecommendGram === null &&
                data?.orderDto.beforeRecipeName === null &&
                data?.orderDto.beforeOrderPrice === 0
                  ? ''
                  : '* 구독 정보 변경으로 주문 변경 내용이 있습니다. '}
              </span>

              <div className={s.body_content}>
                <div className={s.left_box}>
                  <figure className={`${s.image} img-wrap`}>
                    {data?.recipeDto.thumbnailUrl && <Image
                      priority
                      src={data?.recipeDto.thumbnailUrl}
                      objectFit="cover"
                      layout="fill"
                      alt="레시피 썸네일"
                    />}
                  </figure>
                </div>

                <div className={s.right_box}>
                  {/* 2가지로 나눔 */}
                  <div className={s.grid_box}>
                    <span>구독정보</span>
                    <span>
                      {data?.recipeNames} ({data?.orderDto.subscribeCount}회차)
                    </span>

                    <span>반려견</span>
                    <span>{data?.orderDto.dogName}</span>

                    <span>급여량</span>
                    <span>{data?.orderDto.oneMealRecommendGram}g</span>

                    <span>플랜</span>
                    <span>
                      {/* 풀플랜(28개) */}
                      {subscribePlanType[data?.orderDto.plan].KOR}
                    </span>

                    <span>레시피</span>
                    <span>
                      {/* 믹스레시피(스타터프리미엄, 덕&amp;램) */}
                      {data?.recipeDto.recipeName}
                    </span>

                    <span>가격</span>
                    <span>{transformLocalCurrency(data?.orderDto.orderPrice)}원</span>
                  </div>
                </div>
              </div>
            </section>


            {/* 주문상품 결제정보 배송정보 */}
            <section className={s.body}>
              <div className={s.body_title}>주문정보</div>

              <div className={s.body_content_2}>
                <div className={s.grid_box}>
                  <span>주문번호</span>
                  <span>{data?.orderDto.merchantUid}</span>
                  <span>주문(결제)일시</span>
                  <span>{transformDate(data?.orderDto.orderDate, 'time', {seperator: '/'})}</span>
                  <span>배송정보</span>
                  <span>정기 구독 배송</span>
                </div>
              </div>
            </section>

            <section className={s.body}>
              <div className={s.body_title}>배송조회</div>


              {/* 주문상품 결제정보 배송정보 */}
           
              <div className={s.body_content_3}>
                {!valid_deliveryCondition(data?.orderDto.deliveryStatus) ? <ul className={s.content_grid}>
                  <li>CJ대한통운</li>
                  <li>
                    운송장번호&nbsp;{data?.orderDto.deliveryNumber || '(발급 전)'}
                  </li>
                  <li className={s.deliveryStatus}>{orderStatus.KOR[data?.orderDto.deliveryStatus]}</li>
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
                </ul> : <p className={s.emptyCont}>배송 중 상태에서 조회 가능합니다.</p>}
                
              </div>
            </section>

            {/* 주문상품 결제정보 배송정보 */}
            <section className={s.body}>
              <div className={s.body_title}>결제정보</div>


              <div className={s.body_content_2}>
                <div className={s.grid_box}>
                  <span>주문금액</span>
                  <span>{transformLocalCurrency(data?.orderDto.orderPrice)}원</span>

                  <span>배송비</span>
                  <span>정기구독 무료</span>

                  <span>할인금액</span>
                  <span>{transformLocalCurrency(data?.orderDto.discountTotal)}원</span>

                  <span>적립금 사용</span>
                  <span>{transformLocalCurrency(data?.orderDto.discountReward)}원</span>

                  <span>쿠폰사용</span>
                  <span>{transformLocalCurrency(data?.orderDto.discountCoupon)}원</span>

                  <span>결제 금액</span>
                  <span>{transformLocalCurrency(data?.orderDto.paymentPrice)}원</span>
                  {/* TODO: */}
                  <span>적립예정금액</span>
                  <span>3,000원</span>

                  <span>결제방법</span>
                  <span>카드결제</span>
                </div>
              </div>
            </section>

            <section className={s.body}>
              <div className={s.body_title}>배송정보</div>


              <div className={s.body_content_2}>
                <div className={s.grid_box}>
                  <span>받는 분</span>
                  <span>{data?.orderDto.recipientName}</span>

                  <span>핸드폰</span>
                  <span>
                    {data?.orderDto.recipientPhone
                      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
                      .replace(/\-{1,2}$/g, '')}
                  </span>

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
    </>
  );
}


export async function getServerSideProps(ctx) {
  
  const { query, req } = ctx;
  // console.log(query, req)

  // const { orderIdx } = query;
  const orderIdx = query.orderIdx;

  let DATA = null;
  const getApiUrl = `/api/orders/${orderIdx}/subscribe`;
  
  const res = await getDataSSR(req, getApiUrl);
  console.log('SERVER REPONSE: ',res);
  const data = res?.data;
  console.log(data);
  if (data) {
    DATA = {
      recipeDto:{
        thumbnailUrl: data.recipeDto.thumbnailUrl,
        recipeName: data.recipeDto.recipeName
      },
      recipeNames:data.recipeNames,
      orderDto:{
        subscribeCount: data.orderDto.subscribeCount,
        dogName: data.orderDto.dogName,
        oneMealRecommendGram: data.orderDto.oneMealRecommendGram,
        plan: data.orderDto.plan,

        // paymentDate: data.orderDto.paymentDate,
        orderPrice:data.orderDto.orderPrice,
        beforeSubscribeCount: data.orderDto.beforeSubscribeCount,
        beforePlan: data.orderDto.beforePlan,
        beforeOneMealRecommendGram: data.orderDto.beforeOneMealRecommendGram,
        beforeRecipeName: data.orderDto.beforeRecipeName,
        beforeOrderPrice: data.orderDto.beforeOrderPrice,
        merchantUid: data.orderDto.merchantUid,
        orderType: data.orderDto.orderType,
        orderDate: data.orderDto.orderDate,
        deliveryNumber: data.orderDto.deliveryNumber,
        deliveryStatus: data.orderDto.deliveryStatus,
        deliveryPrice: data.orderDto.deliveryPrice,

        discountTotal: data.orderDto.discountTotal,
        discountReward: data.orderDto.discountReward,
        discountCoupon: data.orderDto.discountCoupon,
        paymentPrice: data.orderDto.paymentPrice,
        paymentMethod: data.orderDto.paymentMethod,
        recipientName: data.orderDto.recipientName,
        recipientPhone: data.orderDto.recipientPhone,
        zipcode: data.orderDto.zipcode,
        street: data.orderDto.street,
        detailAddress: data.orderDto.detailAddress,
        request: data.orderDto.request,
        // package: data.orderDto.package
      },
      // savedRewardTotal:data.savedRewardTotal
    };
    console.log(DATA);
  }
  return { props: { orderIdx, data: DATA } };

}