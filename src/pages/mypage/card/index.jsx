import React, {useEffect, useMemo, useState} from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './card.module.scss';
import Image from 'next/image';
import {getDataSSR, postObjData} from '/src/pages/api/reqData';
import {EmptyContMessage} from '/src/components/atoms/emptyContMessage';
import {subscribePlanType} from "/store/TYPE/subscribePlanType";
import transformDate from "/util/func/transformDate";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import {calcSubscribeNextPaymentPrice} from "/util/func/subscribe/calcSubscribeNextPaymentPrice";
import {generateCustomerUid} from "/util/func/order/generateCustomerUid";
import Modal_paymentMethod from "../../../components/modal/Modal_paymentMethod";
import {paymentMethodType, pgType} from "/store/TYPE/paymentMethodType";


export default function MypageCardPage({ data }) {

  const cardList = useMemo(()=> data || [] , [data]);
  const cardNumberUICount = 6;
  const [activeModal, setActiveModal] = useState(false);
  const [updatedCardData, setUpdatedCardData] = useState({});


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

  const onChangeCard = async({subscribeId, paymentMethod}) => {


    // validation
    if(!subscribeId || !paymentMethod) {
      return alert(" 결제수단 처리 중 오류가 발생하여 카드 변경이 불가능합니다.");
    }
    const currentCardDto = cardList.filter(dto=> dto.subscribeCardDto.subscribeId === subscribeId)[0];
    if(!currentCardDto?.subscribeCardDto) return alert( "구독에 해당하는 카드를 찾을 수 없습니다." );


    // Set Import data
    const subscribeItemName = currentCardDto.recipeNameList.join(', ');
    const {name, phoneNumber, email, street, detailAddress } = currentCardDto.subscribeCardDto;
    const CLIENT_ORIGIN = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_CLIENT_URL_PRODUCT : process.env.NEXT_PUBLIC_CLIENT_URL_DEV;

   /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);

    // const randomStr= new Date().getTime().toString(36);
    const buyer_addr = `${street}, ${detailAddress}`;
    const customerUid = generateCustomerUid()
    /* 2. 결제 데이터 정의하기 */
    const m_redirect_url = `${CLIENT_ORIGIN}/mypage/card`;
    const params = `${subscribeId}/${customerUid}/${paymentMethod}`;
    const data = {
      pg: pgType.SUBSCRIBE[paymentMethod], // PG사 => TODO : 카카오페이, 네이버페이 대응필요
      pay_method: 'card', // 결제수단
      merchant_uid: new Date().getTime().toString(36),
      amount:0,
      customer_uid: customerUid,
      name: `[카드변경][구독상품]-${subscribeItemName}`,
      buyer_name: name,
      buyer_tel: phoneNumber,
      buyer_email: email, // 구매자 이메일
      buyer_addr: buyer_addr, // 구매자 주소
      m_redirect_url: `${m_redirect_url}/${params}`
    };
    //
    console.log(data, paymentMethod);
    const callbackData = {
      paymentMethod: paymentMethod
    }

    IMP.request_pay(data, callback.bind(null, callbackData));

    /* 4. 결제 창 호출하기 */
    async function callback(callbackData, response) {
      console.log("- callbackData: ",callbackData, "\n- response: ",response)
      const { success,customer_uid, error_msg } = response;

      /* 3. 콜백 함수 정의하기 */
      if (success) {
        // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
        // TODO: 결제 정보 전달
        const r = await postObjData(`/api/cards/subscribes/${subscribeId}`, {
          customerUid : customer_uid,
          paymentMethod: callbackData.paymentMethod // ! 신규 추가된 필드
        });
        console.log(r);
        if(r.isDone){
          alert('카드변경 성공');
        } else {
          alert('카드변경은 성공하였으나, 서버에서 나머지 요청을 처리하는데 실패하였습니다. 관리자에게 문의해주세요.');
        }
        window.location.reload();
      } else {
          alert(`카드변경 실패 ${error_msg}`);
          window.location.reload();
      }
    }
  }

  const onSelectPaymentMethod = ({subscribeId, paymentMethod, info}) => {
    setActiveModal(true);
    setUpdatedCardData({subscribeId, paymentMethod, info});
  };


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
                  <div>예약 결제일자</div>
                  <div>예약 결제금액</div>
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
                      console.log(card);
                      const cardName = card.subscribeCardDto.cardName || paymentMethodType.KOR[card.paymentMethod];
                      const cardNumber = card.subscribeCardDto.cardNumber?.slice(0, cardNumberUICount) || " - ";

                      return <li key={`subscribe-card-${index}`} className={s.grid_body_box}>
                        <div className={s.col_1}>
                          <div className={`${s.image} img-wrap`}>
                            <Image
                              src={require('public/img/pages/card/card_card.png')}
                              objectFit="cover"
                              layout="fill"
                              alt="카드 이미지"
                            />
                          </div>
                          <span>{cardName}&nbsp;({cardNumber})</span>
                        </div>
                        <div>
                          <span className={s.col_title_m}>결제수단</span>
                          {paymentMethodType.KOR[card.paymentMethod] || "-"}
                        </div>
                        <div className={s.col_plan}>
                          <span className={s.col_title_m}>구독상품</span>
                          ({card.subscribeCardDto.dogName}) {subscribePlanType[card.subscribeCardDto.plan].KOR} / {card.recipeNameList.join(', ')}
                        </div>

                        <div>
                          <span className={s.col_title_m}>예약 결제일자</span>
                          {transformDate(card.subscribeCardDto.nextPaymentDate, null, {seperator:'.'}) || "-"}
                        </div>

                        <div>
                          <span className={s.col_title_m}>예약 결제금액</span>
                          {transformLocalCurrency(
                            calcSubscribeNextPaymentPrice(
                              {
                                originPrice: card.subscribeCardDto.nextPaymentPrice,
                                discountCoupon: card.subscribeCardDto.discountCoupon,
                                discountGrade:card.subscribeCardDto.discountGrade,
                                overDiscount: card.subscribeCardDto.overDiscount
                              }
                            ))}원
                        </div>
                        <div className={s.btn_box}>
                          <button className={s.btn} type={'button'} onClick={()=> onSelectPaymentMethod({subscribeId: card.subscribeCardDto.subscribeId, paymentMethod: card.paymentMethod, info:card.subscribeCardDto})}>카드변경</button>
                        </div>
                      </li>
                    })}
                  </ul>
                )}
              </div>
            </section>
            <section className={s.second_body}>
              <div className={s.text}>* 정기구독 예약에 연동된 카드 및 카드번호 앞 {cardNumberUICount}자리가 표기됩니다.</div>
              <div className={s.text}>* 간편결제(네이버&middot;카카오) 사용 시, 당사에서 카드명 확인 불가합니다.</div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {activeModal && <Modal_paymentMethod data={updatedCardData} onChangeCard={onChangeCard} setActiveModal={setActiveModal} center/> }
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
        name:data.subscribeCardDto.name || null, // 230302 신규 추가
        phoneNumber:data.subscribeCardDto.phoneNumber || null, // 230419 신규 추가
        email:data.subscribeCardDto.email || null, // 230419 신규 추가
        street:data.subscribeCardDto.street || null, // 230419 신규 추가
        detailAddress:data.subscribeCardDto.detailAddress || null, // 230419 신규 추가
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
      },
      recipeNameList: data.recipeNameList,
      paymentMethod: data.paymentMethod || null, // 230421 신규추가
    }));
  }
  return { props: { data: DATA } };
}
