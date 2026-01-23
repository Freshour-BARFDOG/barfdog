import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@src/components/common/Layout';
import Wrapper from '@src/components/common/Wrapper';
import MypageWrapper from '@src/components/mypage/MypageWrapper';
import MetaTitle from '@src/components/atoms/MetaTitle';
import s from './card.module.scss';
import Image from 'next/image';
import { getDataSSR, postObjData } from '@src/pages/api/reqData';
import { EmptyContMessage } from '@src/components/atoms/emptyContMessage';
import { subscribePlanType } from '@store/TYPE/subscribePlanType';
import { subscribeStatus } from '@store/TYPE/subscribeStatus';
import transformDate from '@util/func/transformDate';
import transformLocalCurrency from '@util/func/transformLocalCurrency';
import { calcSubscribeNextPaymentPrice } from '@util/func/subscribe/calcSubscribeNextPaymentPrice';
import { generateCustomerUid } from '@util/func/order/generateCustomerUid';
import Modal_paymentMethod from '../../../components/modal/Modal_paymentMethod';
import { paymentMethodType, pgType } from '@store/TYPE/paymentMethodType';
import Modal_global_alert from '../../../components/modal/Modal_global_alert';
import { useModalContext } from '@store/modal-context';
import { useRouter } from 'next/router';
import { getAmountOfPaymentRegisterationByPaymentMethod } from '/util/func/subscribe/getAmountOfPaymentRegisterationByPaymentMethod';
import { getNaverpaySubscribePaymentParam } from '/store/TYPE/NaverpayPaymentParams';
import useDeviceState from '../../../../util/hook/useDeviceState';
import { getItemNameWithPrefixByPaymentMethod } from 'util/func/subscribe/getItemNameWithPrefixByPaymentMethod';
import Spinner from '../../../components/atoms/Spinner';
import { deleteData, postData } from '../../api/reqData';
import Modal_confirm from '../../../components/modal/Modal_confirm';

export default function MypageCardPage({ data }) {
  const mct = useModalContext();
  const router = useRouter();
  const hasAlert = mct.hasAlert;

  const ds = useDeviceState();
  const isMobile = ds.isMobile;

  const cardList = useMemo(() => data || [], [data]);
  const cardNumberUICount = 6;
  const [activeModal, setActiveModal] = useState(false);
  const [updatedCardData, setUpdatedCardData] = useState({});
  const [isLoading, setIsLoading] = useState({ submit: false });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [cardIdNumber, setCardIdNumber] = useState('');

  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';

    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';

    document.head.appendChild(jquery);
    document.head.appendChild(iamport);

    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const onChangeCard = async ({ subscribeId, paymentMethod }) => {
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');

    // validation
    if (!subscribeId || !paymentMethod)
      return mct.alertShow(
        `결제수단 처리 중 오류가 발생하여 카드 변경을 할 수 없는 상태입니다.`,
      );

    // validation: 구독 정보
    const currentCardDto = cardList.filter(
      (dto) => dto.subscribeCardDto.subscribeId === subscribeId,
    )[0];
    if (!currentCardDto?.subscribeCardDto)
      return mct.alertShow(
        '구독에 연동된 카드정보조회 중 오류가 발생하였습니다.',
      );

    try {
      // 카드 변경: 신규 결제 등록 시작
      // + API Server 기존 아임포트 빌링키 등록 해지 (네이버페이 = 정기등록해지)
      setIsSubmitted(true);
      setIsLoading((prevState) => ({ ...prevState, submit: true }));

      // Set DATA
      const itemName = currentCardDto.recipeNameList.join(', ');
      const {
        name,
        phoneNumber,
        email,
        street,
        detailAddress,
        nextPaymentPrice,
      } = currentCardDto.subscribeCardDto;

      /* 1. 가맹점 식별하기 */
      const IMP = window.IMP;
      IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);

      const buyer_addr = `${street}, ${detailAddress}`;
      const customerUid = generateCustomerUid();
      /* 2. 결제 데이터 정의하기 */
      const localOrigin = window.location.origin;
      const m_redirect_url = `${localOrigin}/mypage/card`;
      const params = `${subscribeId}/${customerUid}/${paymentMethod}`;
      const data = {
        pg: pgType.SUBSCRIBE[paymentMethod], // PG사 => TODO : 카카오페이, 네이버페이 대응필요
        pay_method: 'card', // 결제수단
        merchant_uid: null,
        amount: getAmountOfPaymentRegisterationByPaymentMethod({
          method: paymentMethod,
          originAmount: nextPaymentPrice,
        }),
        customer_uid: customerUid,
        name: getItemNameWithPrefixByPaymentMethod({
          paymentMethod,
          itemName: itemName,
          prefix: '[카드변경]',
        }),
        buyer_name: name,
        buyer_tel: phoneNumber,
        buyer_email: email, // 구매자 이메일
        buyer_addr: buyer_addr, // 구매자 주소
        m_redirect_url: `${m_redirect_url}/${params}`,
      };

      if (paymentMethod === paymentMethodType.NAVER_PAY) {
        Object.assign(
          data,
          getNaverpaySubscribePaymentParam({ subscribeId, isMobile: isMobile }),
        ); // 네이버페이 데이터 합침
      }

      const callbackData = {
        paymentMethod: paymentMethod,
      };

      IMP.request_pay(data, callback.bind(null, callbackData));

      /* 4. 결제 창 호출하기 */
      async function callback(callbackData, response) {
        // console.log("- callbackData: ", callbackData, "\n- response: ", response)
        const { success, customer_uid, error_msg } = response;

        /* 3. 콜백 함수 정의하기 */
        if (success) {
          // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
          // TODO: 결제 정보 전달
          const r = await postObjData(`/api/cards/subscribes/${subscribeId}`, {
            customerUid: customer_uid,
            paymentMethod: callbackData.paymentMethod,
          });
          // console.log(r);
          if (r.isDone) {
            mct.alertShow('카드변경 성공', onSuccessCallback);
          } else {
            mct.alertShow(
              `카드변경 실패\n데이터 처리 중 오류가 발생하였습니다.\n사이트 관리자에게 문의해주세요.\nerror_msg: ${r.error}`,
              onSuccessCallback,
            );
          }
        } else {
          mct.alertShow(
            `카드변경 실패 \nerror_msg: ${error_msg}`,
            onFailCallback,
          );
          setIsSubmitted(false);
        }
      }
    } catch (err) {
      console.error(err);
      mct.alertShow(`데이터 처리 중 오류가 발생했습니다.\n${err.response}`);
      setIsSubmitted(false);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, submit: false }));
    }
  };

  const onSuccessCallback = () => {
    window.location.reload();
  };

  const onFailCallback = () => {
    window.location.reload();
  };

  const onSelectPaymentMethod = ({ subscribeId, paymentMethod, info }) => {
    setActiveModal(true);
    setUpdatedCardData({ subscribeId, paymentMethod, info });
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  //* 주문서 페이지로 이동
  const moveToOrdersheetHandler = (subscribeId, plan) => {
    if (plan === subscribePlanType.TOPPING.NAME) {
      return mct.alertShow('토핑 플랜은 서비스가 종료되어 재결제가 불가능합니다. 반려견을 새로 등록하신뒤 이용해 주세요.');
    }
    router.push(`/order/ordersheet/subscribe/${subscribeId}`);
  };

  //* 구독 중단 취소 (재활성화)
  const onReactiveHandler = async (subscribeId, plan) => {
    if (plan === subscribePlanType.TOPPING.NAME) {
      return mct.alertShow('토핑 플랜은 서비스가 종료되어 재결제가 불가능합니다. 반려견을 새로 등록하신뒤 이용해 주세요.');
    }
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        reactive: true,
      }));
      const apiUrl = `/api/subscribes/${subscribeId}/reactive`;
      const res = await postData(apiUrl);
      // console.log(res);
      if (res.data) {
        mct.alertShow(`재구독이 정상적으로 완료되었습니다.`, onSuccessCallback);
      } else {
        mct.alertShow('재구독에 실패하였습니다.');
      }
    } catch (err) {
      mct.alertShow('서버 통신 장애 발생');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        reactive: false,
      }));
    }
  };

  //* 카드 삭제
  // 모달창 open
  const onActiveConfirmModal = (cardId) => {
    setCardIdNumber(cardId);
    setActiveConfirmModal(true);
  };

  const onDeleteCardHandler = async (confirm) => {
    setActiveConfirmModal(true);
    if (!confirm) {
      return setActiveConfirmModal(false);
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: true,
      }));
      const apiUrl = `/api/cards/${cardIdNumber}`;
      const res = await deleteData(apiUrl);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow(`카드가 정상적으로 삭제되었습니다.`, onSuccessCallback);
      } else {
        mct.alertShow('삭제에 실패하였습니다.');
      }
      setActiveConfirmModal(false);
      setCardIdNumber(''); // 카드번호 초기화
    } catch (err) {
      mct.alertShow('서버 통신 장애 발생');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: false,
      }));
    }
  };

  // console.log(data);
  // console.log(cardIdNumber);

  return (
    <>
      <MetaTitle title="마이페이지 카드관리" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>카드관리</section>

            <section className={s.body}>
              <div className={s.table_box}>
                <div className={s.grid_title_box}>
                  <div className={s.col_1}>카드명</div>
                  <div>결제수단</div>
                  <div>구독상품</div>
                  <div>구독상태</div>
                  <div>예약 결제일자</div>
                  <div>예약 결제금액</div>
                  <div></div>
                  <div></div>
                </div>

                <section className={s.line_box}>
                  <hr className={s.line} />
                </section>
                {cardList.length === 0 ? (
                  <EmptyContMessage message={'구독 중인 카드가 없습니다.'} />
                ) : (
                  <ul className={'card-list-container'}>
                    {cardList.map((card, index) => {
                      const cardName = card.subscribeCardDto.cardName;
                      {
                        /* || paymentMethodType.KOR[card.paymentMethod]; */
                      }
                      const cardNumber =
                        card.subscribeCardDto.cardNumber?.slice(
                          0,
                          cardNumberUICount,
                        ) || ' - ';

                      return (
                        <li
                          key={`subscribe-card-${index}`}
                          className={s.grid_body_box}
                        >
                          <div className={s.col_1}>
                            <div className={`${s.image} img-wrap`}>
                              <Image
                                src={require('public/img/pages/card/card_card.png')}
                                objectFit="cover"
                                layout="fill"
                                alt="카드 이미지"
                              />
                            </div>
                            <span>
                              {/* 네이버페이, 카카오페이는 -> cardName 값이 없음 */}
                              {cardName
                                ? `${cardName} (${cardNumber})`
                                : '( - )'}
                            </span>
                          </div>
                          <div>
                            <span className={s.col_title_m}>결제수단</span>
                            {paymentMethodType.KOR[card.paymentMethod] || '-'}
                          </div>

                          <div className={s.col_plan}>
                            <span className={s.col_title_m}>구독상품</span>(
                            {card.subscribeCardDto.dogName}){' '}
                            {subscribePlanType[card.subscribeCardDto.plan].KOR}{' '}
                            / {card.recipeNameList.join(', ')}
                          </div>

                          <div className={s.col_status}>
                            <span className={s.col_title_m}>구독상태</span>
                            {subscribeStatus.KOR[card.subscribeCardDto.status]}
                          </div>

                          <div>
                            <span className={s.col_title_m}>예약 결제일자</span>
                            {transformDate(
                              card.subscribeCardDto.nextPaymentDate,
                              null,
                              { seperator: '.' },
                            ) || '-'}
                          </div>

                          <div>
                            <span className={s.col_title_m}>예약 결제금액</span>
                            {transformLocalCurrency(
                              calcSubscribeNextPaymentPrice({
                                originPrice:
                                  card.subscribeCardDto.nextPaymentPrice,
                                discountCoupon:
                                  card.subscribeCardDto.discountCoupon,
                                discountGrade:
                                  card.subscribeCardDto.discountGrade,
                                overDiscount:
                                  card.subscribeCardDto.overDiscount,
                              }),
                            )}
                            원
                          </div>

                          {/* 1. '카드변경' 버튼  */}
                          {/* '구독 중' 일 때만 */}
                          {card.subscribeCardDto.status === 'SUBSCRIBING' && (
                            <div className={s.btn_box}>
                              <button
                                className={s.btn}
                                type={'button'}
                                onClick={() =>
                                  onSelectPaymentMethod({
                                    subscribeId:
                                      card.subscribeCardDto.subscribeId,
                                    paymentMethod: card.paymentMethod,
                                    info: card.subscribeCardDto,
                                  })
                                }
                              >
                                카드변경
                              </button>
                            </div>
                          )}

                          {/* 2-1. 주문서 페이지로 이동하는 '재구독' 버튼 */}
                          {/*  SUBSCRIBE_PENDING, SUBSCRIBE_CANCEL, BEFORE_PAYMENT 일 경우 */}
                          {(card.subscribeCardDto.status ===
                            'SUBSCRIBE_PENDING' ||
                            card.subscribeCardDto.status ===
                              'SUBSCRIBE_CANCEL' ||
                            card.subscribeCardDto.status ===
                              'BEFORE_PAYMENT') && (
                            <div className={s.btn_box}>
                              <button
                                className={s.btn}
                                type={'button'}
                                onClick={() =>
                                  moveToOrdersheetHandler(
                                    card.subscribeCardDto.subscribeId,
                                    card.subscribeCardDto.plan,
                                  )
                                }
                              >
                                재구독
                              </button>
                            </div>
                          )}

                          {/* 2-2. 주문서 페이지로 이동하는 '재구독' 버튼 */}
                          {/* SUBSCRIBE_WILL_CANCELT 일 경우 */}

                          {card.subscribeCardDto.status ===
                            'SUBSCRIBE_WILL_CANCEL' && (
                            <div className={s.btn_box}>
                              <button
                                className={s.btn}
                                type={'button'}
                                onClick={() =>
                                  onReactiveHandler(
                                    card.subscribeCardDto.subscribeId,
                                    card.subscribeCardDto.plan,
                                  )
                                }
                              >
                                {isLoading.reactive ? (
                                  <Spinner style={{ color: '#fff' }} />
                                ) : (
                                  '재구독'
                                )}
                              </button>
                            </div>
                          )}

                          {/* 3. 카드 삭제 */}
                          {/* 단, 구독 중 or 구독 취소 예정일 때 제외 */}
                          <div className={s.btn_box}>
                            <button
                              className={
                                card.subscribeCardDto.status ===
                                  'SUBSCRIBING' ||
                                card.subscribeCardDto.status ===
                                  'SUBSCRIBE_WILL_CANCEL'
                                  ? `${s.btn} ${s['btn-disabled']}`
                                  : s.btn
                              }
                              type={'button'}
                              onClick={
                                card.subscribeCardDto.status ===
                                  'SUBSCRIBING' ||
                                card.subscribeCardDto.status ===
                                  'SUBSCRIBE_WILL_CANCEL'
                                  ? undefined
                                  : () =>
                                      onActiveConfirmModal(
                                        card.subscribeCardDto.cardId,
                                      )
                              }
                              disabled={
                                card.subscribeCardDto.status ===
                                  'SUBSCRIBING' ||
                                card.subscribeCardDto.status ===
                                  'SUBSCRIBE_WILL_CANCEL'
                              }
                              title={
                                card.subscribeCardDto.status ===
                                  'SUBSCRIBING' ||
                                card.subscribeCardDto.status ===
                                  'SUBSCRIBE_WILL_CANCEL'
                                  ? '구독 중이거나 구독 취소 예정 카드는 삭제 불가능합니다.'
                                  : ''
                              }
                            >
                              {isLoading.delete ? (
                                <Spinner style={{ color: '#fff' }} />
                              ) : (
                                '카드삭제'
                              )}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>
            <section className={s.second_body}>
              <div className={s.text}>
                * 정기구독 예약에 연동된 카드 및 카드번호 앞 {cardNumberUICount}
                자리가 표기됩니다.
              </div>
              <div className={s.text}>
                * 간편결제(네이버&middot;카카오) 사용 시, 당사에서 카드명 확인
                불가합니다.
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {activeModal && (
        <Modal_paymentMethod
          center
          data={updatedCardData}
          onChangeCard={onChangeCard}
          setActiveModal={setActiveModal}
          isSubmitted={isSubmitted}
          isLoading={isLoading}
        />
      )}
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background={true} />
      )}
      {activeConfirmModal && (
        <Modal_confirm
          text={`카드를 삭제하시겠습니까?`}
          isConfirm={onDeleteCardHandler}
          positionCenter
        />
      )}
    </>
  );
}

export async function getServerSideProps({ req }) {
  const getApiUrl = '/api/cards';
  // const res = DUMMY_RESPONSE  // ! TSET
  const res = await getDataSSR(req, getApiUrl);
  let DATA = null;
  const embeddedData = res?.data._embedded;
  if (embeddedData) {
    const dataList = embeddedData?.querySubscribeCardsDtoList || [];
    if (!dataList.length) return;
    DATA = dataList.map((data) => ({
      subscribeCardDto: {
        name: data.subscribeCardDto.name || null, // 230302 신규 추가
        phoneNumber: data.subscribeCardDto.phoneNumber || null, // 230419 신규 추가
        email: data.subscribeCardDto.email || null, // 230419 신규 추가
        street: data.subscribeCardDto.street || null, // 230419 신규 추가
        detailAddress: data.subscribeCardDto.detailAddress || null, // 230419 신규 추가
        subscribeId: data.subscribeCardDto.subscribeId,
        cardId: data.subscribeCardDto.cardId,
        cardName: data.subscribeCardDto.cardName,
        cardNumber: data.subscribeCardDto.cardNumber,
        dogName: data.subscribeCardDto.dogName,
        plan: data.subscribeCardDto.plan,
        nextPaymentDate: data.subscribeCardDto.nextPaymentDate,
        nextPaymentPrice: data.subscribeCardDto.nextPaymentPrice,
        discountGrade: data.subscribeCardDto.discountGrade,
        discountCoupon: data.subscribeCardDto.discountCoupon,
        overDiscount: data.subscribeCardDto.overDiscount,
        status: data.subscribeCardDto.status,
      },
      recipeNameList: data.recipeNameList,
      paymentMethod: data.paymentMethod || null, // 230421 신규추가
    }));
  }
  return { props: { data: DATA } };
}
