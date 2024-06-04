import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from 'src/pages/mypage/orderHistory/orderHistoryOrdersheet.module.scss';
import Image from 'next/image';
import { getDataSSR } from '/src/pages/api/reqData';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import popupWindow from '/util/func/popupWindow';
import { valid_deliveryCondition } from '/util/func/validation/valid_deliveryCondition';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformDate from '/util/func/transformDate';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import { Modal_subscribeCancel } from '/src/components/modal/Modal_subscribeCancel';
import { paymentMethodType } from '/store/TYPE/paymentMethodType';
import { roundedOneMealGram } from '/util/func/subscribe/roundedOneMealGram';
import { seperateStringViaComma } from '/util/func/seperateStringViaComma';
import { postPaymentDataToApiServer } from '../../../api/postPaymentDataToApiServer';
import { redirectBySSR } from '../../../../../util/func/redirectBySSR';
import { CancelReasonName } from '../../../../../store/TYPE/order/CancelReasonName';

/*! 참고)
   구독상품: 교환 및 환불 불가
   주문상태에 따른 구독 취소의 reason / detailReason
   PAYMENT_DONE => 이미 입력된 값으로 전달
   PRODUCING => Modal활성화 => 사용자가 입력한 값으로 전달
*/

export default function SubScribe_OrderHistoryPage({ data, orderIdx }) {
  // // console.log(data);

  // data.orderDto.deliveryStatus = orderStatus.PAYMENT_DONE; // ! TEST CODE TEST CODE TEST CODE TEST CODE
  // data.orderDto.deliveryStatus = orderStatus.PRODUCING; // ! TEST CODE TEST CODE TEST CODE TEST CODE
  const currentOrderStatus = data.orderDto.orderStatus;
  const availableCancelStatusList = [
    orderStatus.PAYMENT_DONE,
    orderStatus.PRODUCING,
  ];
  const availableCancleStatus =
    availableCancelStatusList.indexOf(currentOrderStatus) >= 0;

  const [activeModal, setActiveModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined')
      return console.error('window is not defined');
    const href = e.currentTarget.href;
    popupWindow(href, { width: 540, height: 480, left: 200, top: 100 });
  };

  const initializeModalState = () => {
    // setFilteredItemList(originItemList);
    setConfirmMessage('');
    setActiveModal(null);
  };

  const onStartCancelBeforeProducing = () => {
    setActiveModal({ cancle: true });
    setConfirmMessage(
      `정기구독 상품이 즉시 주문 취소 처리됩니다. (구독 중인 반려견 없이 묶음배송 요청한 상품이 있다면, 반드시 관리자에게 문의하세요.)`,
    );
  };

  const onOrderCancleBeforeProducing = async (confirm) => {
    if (!confirm) return initializeModalState();

    const data = {
      reason: CancelReasonName.cancelNowOfSubscribeOrderByBuyer,
      detailReason:
        CancelReasonName.cancelNowOfSubscribeOrderByBuyerAsDetailReason,
    };
    // console.log(data);
    try {
      const r = await postPaymentDataToApiServer(
        `/api/orders/${orderIdx}/subscribe/cancelRequest`,
        data,
      );
      // console.log(r);
      if (r.isDone) {
        // alert(CancelReasonName.cancelNowOfSubscribeOrderByBuyer,);
        window.location.reload();
      } else {
        alert(`주문취소 실패\n${r.error}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActiveModal(null);
    }
  };

  const onStartCancel = () => {
    setActiveModal({ cancleRequest: true });
  };

  const onPrevPage = async () => {
    window.location.href = '/mypage/orderHistory';
  };

  if (!data) return;

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
                  {availableCancleStatus && (
                    <button
                      type={'button'}
                      className={`${s.btn} ${s.cancel}`}
                      onClick={
                        currentOrderStatus === orderStatus.PRODUCING
                          ? onStartCancel
                          : onStartCancelBeforeProducing
                      }
                    >
                      주문취소
                    </button>
                  )}
                </div>
              </h1>

              <span className={s.change}>
                {data?.orderDto.beforePlan === null &&
                data?.orderDto.beforeOneMealGramsPerRecipe === null &&
                data?.orderDto.beforeRecipeName === null &&
                data?.orderDto.beforeOrderPrice === 0
                  ? ''
                  : '* 구독 정보 변경으로 주문 변경 내용이 있습니다. '}
              </span>

              <ul className={s.body_content}>
                <li className={s.left_box}>
                  <figure className={`${s.image} img-wrap`}>
                    {data?.recipeDto.thumbnailUrl && (
                      <Image
                        priority
                        src={data?.recipeDto.thumbnailUrl}
                        objectFit="cover"
                        layout="fill"
                        alt="레시피 썸네일"
                      />
                    )}
                  </figure>
                </li>

                <li className={s.right_box}>
                  {/* 2가지로 나눔 */}
                  <div className={s.grid_box}>
                    <span>구독정보</span>
                    <span>
                      {data?.recipeNames}
                      {/* ({data?.orderDto.subscribeCount}회차) */}
                    </span>

                    <span>반려견</span>
                    <span>{data?.orderDto.dogName}</span>

                    <span>플랜</span>
                    <div>
                      <span>
                        {data?.orderDto.plan &&
                          subscribePlanType[data?.orderDto.plan].KOR}
                      </span>
                      {data?.orderDto.beforePlan &&
                        data?.orderDto.plan &&
                        data?.orderDto.beforePlan !== data?.orderDto.plan && (
                          <span className={s.beforeData}>
                            {subscribePlanType[data?.orderDto.beforePlan].KOR}
                          </span>
                        )}
                    </div>

                    <span>레시피</span>
                    <div>
                      <span>{data?.recipeNames}</span>
                      {data?.orderDto.beforeRecipeName !==
                        data?.recipeNames && (
                        <span className={s.beforeData}>
                          {data?.orderDto.beforeRecipeName}
                        </span>
                      )}
                    </div>

                    <span>급여량</span>
                    <div>
                      <span>
                        {data?.orderDto.oneMealGramsPerRecipe &&
                          seperateStringViaComma(
                            data?.orderDto.oneMealGramsPerRecipe,
                          )
                            .map(
                              (gram) =>
                                `${transformLocalCurrency(
                                  roundedOneMealGram(gram),
                                )}g`,
                            )
                            .join(', ')}
                      </span>
                      {data?.orderDto.beforeOneMealGramsPerRecipe &&
                        data?.orderDto.beforeOneMealGramsPerRecipe !==
                          data?.orderDto.oneMealGramsPerRecipe && (
                          <span className={s.beforeData}>
                            {seperateStringViaComma(
                              data?.orderDto.beforeOneMealGramsPerRecipe,
                            )
                              .map(
                                (gram) =>
                                  `${transformLocalCurrency(
                                    roundedOneMealGram(gram),
                                  )}g`,
                              )
                              .join(', ')}
                          </span>
                        )}
                    </div>

                    <span>가격</span>
                    <div>
                      <span>
                        {transformLocalCurrency(data?.orderDto.orderPrice)}원
                      </span>
                      {data?.orderDto.beforeOrderPrice > 0 &&
                        data?.orderDto.beforeOrderPrice !==
                          data?.orderDto.orderPrice && (
                          <span className={s.beforeData}>
                            {transformLocalCurrency(
                              data?.orderDto.beforeOrderPrice,
                            )}
                            원
                          </span>
                        )}
                    </div>
                  </div>
                  <div className={s.info_autoConfirmation}>
                    구독상품은 배송완료 후, 자동으로 구매확정됩니다.
                  </div>
                </li>
              </ul>
            </section>

            {/* 주문상품 결제정보 배송정보 */}
            <section className={s.body}>
              <div className={s.body_title}>주문정보</div>

              <div className={s.body_content_2}>
                <div className={s.grid_box}>
                  <span>주문상태</span>
                  <span>{orderStatus.KOR[currentOrderStatus]}</span>
                  <span>주문번호</span>
                  <span>{data?.orderDto.merchantUid}</span>
                  <span>주문(결제)일시</span>
                  <span>
                    {transformDate(data?.orderDto.orderDate, 'time', {
                      seperator: '/',
                    })}
                  </span>
                  <span>배송정보</span>
                  <span>정기 구독 배송</span>
                </div>
              </div>
            </section>

            <section className={s.body}>
              <div className={s.body_title}>배송조회</div>

              {/* 주문상품 결제정보 배송정보 */}

              <div className={s.body_content_3}>
                {valid_deliveryCondition(data?.orderDto.deliveryStatus) ? (
                  <ul className={s.content_grid}>
                    <li>
                      {data?.orderDto.deliveryCode === 'EPOST'
                        ? '우체국'
                        : '대한통운'}
                    </li>
                    <li>
                      운송장번호&nbsp;
                      {data?.orderDto.deliveryNumber || '(발급 전)'}
                    </li>
                    <li className={s.deliveryStatus}>
                      {orderStatus.KOR[data?.orderDto.deliveryStatus]}
                    </li>
                    <li>
                      <a
                        href={`https://trace.goodsflow.com/VIEW/V1/whereis/${process.env.NEXT_PUBLIC_GOODSFLOW_SITECODE}/${data?.orderDto.deliveryCode}/${data?.orderDto.deliveryNumber}`}
                        target="_blank"
                        rel={'noreferrer'}
                        onClick={onPopupHandler}
                      >
                        <button>배송조회</button>
                      </a>
                    </li>
                  </ul>
                ) : (
                  <p className={s.emptyCont}>배송 시작 후 조회 가능합니다.</p>
                )}
              </div>
            </section>

            {/* 주문상품 결제정보 배송정보 */}
            <section className={s.body}>
              <div className={s.body_title}>결제정보</div>

              <div className={s.body_content_2}>
                <div className={s.grid_box}>
                  <span>주문금액</span>
                  <span>
                    {transformLocalCurrency(data?.orderDto.orderPrice)}원
                  </span>

                  <span>배송비</span>
                  <span>정기구독 무료</span>

                  <span>총 할인금액</span>
                  <span>
                    {data?.orderDto.discountTotal > 0 && '-'}
                    {transformLocalCurrency(
                      data?.orderDto.discountTotal -
                        (data?.orderDto.overDiscount || 0),
                    )}
                    원
                  </span>

                  <span>ㄴ 등급할인</span>
                  <span>
                    {data?.orderDto.discountGrade > 0 && '-'}
                    {transformLocalCurrency(data?.orderDto.discountGrade)}원
                  </span>

                  <span>ㄴ 적립금 사용</span>
                  <span>
                    {data?.orderDto.discountReward > 0 && '-'}
                    {transformLocalCurrency(data?.orderDto.discountReward)}원
                  </span>

                  <span>ㄴ 쿠폰사용</span>
                  <span>
                    {data?.orderDto.discountCoupon > 0 && '-'}
                    {transformLocalCurrency(data?.orderDto.discountCoupon)}원
                  </span>

                  {data?.orderDto.overDiscount > 0 && (
                    <>
                      <span>ㄴ 쿠폰 할인 소멸 </span>
                      <span className={'pointColor'}>
                        +&nbsp;
                        {transformLocalCurrency(data?.orderDto.overDiscount)}원
                      </span>
                    </>
                  )}

                  <span>결제 금액</span>
                  <span>
                    {transformLocalCurrency(data?.orderDto.paymentPrice)}원
                  </span>
                  {/* TODO: */}
                  <span>적립예정금액</span>
                  <span>
                    {transformLocalCurrency(data?.orderDto.saveReward)}원
                  </span>

                  <span>결제방법</span>
                  <span>
                    {paymentMethodType.KOR[data.orderDto.paymentMethod]}
                  </span>
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
                      .replace(
                        /^([0-9*]{0,3})([0-9*]{0,4})([0-9*]{0,4})$/g,
                        '$1-$2-$3',
                      )
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
            {(currentOrderStatus === orderStatus.CANCEL_DONE_SELLER ||
              currentOrderStatus === orderStatus.CANCEL_DONE_BUYER) && (
              <section className={`${s['additional-info-section']}`}>
                <h6 className={s.body_title}>환불 정보</h6>
                <ul className={s.body_content_2}>
                  <li className={s.grid_box}>
                    <span>취소 요청일자</span>
                    <span>
                      {transformDate(data.orderDto.cancelRequestDate, 'time', {
                        seperator: '/',
                      })}
                    </span>
                    <span>취소 승인일자</span>
                    <span>
                      {transformDate(data.orderDto.cancelConfirmDate, 'time', {
                        seperator: '/',
                      })}
                    </span>
                    <span>환불 사유</span>
                    <span>{data.orderDto.cancelReason || '-'}</span>
                    <span>환불 상세사유</span>
                    <span>{data.orderDto.cancelDetailReason || '-'}</span>
                    <span>총 환불 금액</span>
                    <span>{data.orderDto.paymentPrice}원</span>
                    <span>환불 수단</span>
                    <span>
                      {paymentMethodType.KOR[data.orderDto.paymentMethod]}
                    </span>
                  </li>
                </ul>
              </section>
            )}
            <section className={s.btn_section}>
              <button
                type={'button'}
                className={'custom_btn solid basic_l'}
                onClick={onPrevPage}
              >
                돌아가기
              </button>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {activeModal?.cancle && (
        <Modal_confirm
          text={confirmMessage}
          isConfirm={onOrderCancleBeforeProducing}
          positionCenter
          option={{ wordBreak: true }}
        />
      )}
      {activeModal?.cancleRequest && (
        <Modal_subscribeCancel
          onHideModal={initializeModalState}
          subscribeId={data.orderDto.subscribeId}
        />
      )}
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const orderIdx = query.orderIdx;

  let DATA = null;
  const getApiUrl = `/api/orders/${orderIdx}/subscribe`;

  const res = await getDataSSR(req, getApiUrl);
  // // console.log('SERVER REPONSE: ', res);
  const data = res?.data;
  // console.log('REPONSE DATA:',data);
  if (!data || data.status === 500) {
    return redirectBySSR('/mypage/orderHistory');
  } else if (data) {
    DATA = {
      recipeDto: {
        thumbnailUrl: data.recipeDto.thumbnailUrl || null,
        recipeName: data.recipeDto.recipeName,
      },
      recipeNames: data.recipeNames,
      orderDto: {
        subscribeId: orderIdx,
        subscribeCount: data.orderDto.subscribeCount,
        dogName: data.orderDto.dogName,
        oneMealGramsPerRecipe: data.orderDto.oneMealGramsPerRecipe || null, // api-server field 변경에 대응 -> 추후 null 대응 제외해도 됨
        plan: data.orderDto.plan,
        // paymentDate: data.orderDto.paymentDate,
        orderPrice: data.orderDto.orderPrice,
        beforeSubscribeCount: data.orderDto.beforeSubscribeCount,
        beforePlan: data.orderDto.beforePlan,
        beforeOneMealGramsPerRecipe:
          data.orderDto.beforeOneMealGramsPerRecipe || null, // api-server field 변경에 대응 -> 추후 null 대응 제외해도 됨
        beforeRecipeName: data.orderDto.beforeRecipeName,
        beforeOrderPrice: data.orderDto.beforeOrderPrice,
        orderStatus: data.orderDto.orderStatus, // ! 주문상태
        cancelRequestDate: data.orderDto.cancelRequestDate,
        cancelConfirmDate: data.orderDto.cancelConfirmDate,
        cancelReason: data.orderDto.cancelReason,
        cancelDetailReason: data.orderDto.cancelDetailReason,
        merchantUid: data.orderDto.merchantUid,
        orderType: data.orderDto.orderType,
        orderDate: data.orderDto.orderDate,
        deliveryNumber: data.orderDto.deliveryNumber,
        deliveryCode: data.orderDto.deliveryCode,
        deliveryStatus: data.orderDto.deliveryStatus, // ! 배송상태
        deliveryPrice: data.orderDto.deliveryPrice,
        discountGrade: data.orderDto.discountGrade || 0, // 등급할인 (0908 신규 추가)
        discountTotal: data.orderDto.discountTotal,
        discountReward: data.orderDto.discountReward,
        discountCoupon: data.orderDto.discountCoupon,
        overDiscount: data.orderDto.overDiscount || null, // 쿠폰 할인 소멸  // api-server field 변경에 대응 -> 추후 null 대응 제외해도 됨
        paymentPrice: data.orderDto.paymentPrice,
        paymentMethod: data.orderDto.paymentMethod,
        recipientName: data.orderDto.recipientName,
        recipientPhone: data.orderDto.recipientPhone,
        zipcode: data.orderDto.zipcode,
        street: data.orderDto.street,
        detailAddress: data.orderDto.detailAddress,
        request: data.orderDto.request,
        // package: data.orderDto.package
        saveReward: data.orderDto.saveReward || 0,
      },
      // savedRewardTotal:data.savedRewardTotal
    };
    // // console.log(DATA);
  }
  return { props: { orderIdx, data: DATA } };
}
