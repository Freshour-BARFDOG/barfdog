import React, {useEffect, useState} from 'react';
import s from './subscribeOrderChanged.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import {getDataSSR, putObjData} from '/src/pages/api/reqData';
import {useSelector} from 'react-redux';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import transformDate from '/util/func/transformDate';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Spinner from "/src/components/atoms/Spinner";
import {subscribePlanType} from "/store/TYPE/subscribePlanType";
import {useModalContext} from "/store/modal-context";
import Modal_confirm from "/src/components/modal/Modal_confirm";
import {seperateStringViaComma} from "/util/func/seperateStringViaComma";
import {FullScreenLoading} from "../../../../components/atoms/FullScreenLoading";


/* ! 플랜 주기가 변경될 경우 (2주 => 4주 또는 4주 => 2주 )
    재결제 필요
    ! 해당 기능은 건너뛰기가 아니므로,
      (구독실적에 자동적으로 반영되기 위하여) 기존 예약일정 이후로, 해당 플랜변경이 이루어지는게 자연스럽다.
* */
export default function SubscribeOrderChangedPage({ data }) {

  
  const mct = useModalContext();
  const cart = useSelector((s) => s.cart);
  const info = cart.subscribeOrder;
  const subscribeId = cart.subscribeOrder.subscribeId;
  const [isLoading, setIsLoading] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [activeConfirmModal, setActiveConfirmModal] = useState({});

  useEffect(() => {
    if(!data || !DATA.prev.plan || !DATA.next.plan) return onFailCallback();
    
  },[])
  const DATA = { // DATA Ref. ) order/subscribeShop => onChangeSubscribeOrder()
    lastSurveyDate: data.surveyReportInfo.lastSurveyDate,
    prev: {
      ...info.prev,
    },
    next: {
      ...info.next,
    },
  };
  
  const onActiveConfirmModal = (e) => {
    const btn = e.currentTarget;
    const btnType = btn.dataset.buttonType;
    setActiveConfirmModal({ [btnType]: true });
  };
  
  
  const onChangeSubscribeOrder = async (confirm) => {
    if (submitted === true) return;
    if(!confirm){
      return setActiveConfirmModal(false);
    }
    
    
    const nextPaymentPrice = DATA.next.nextPaymentPrice;
    const body = {
      plan: DATA.next.plan,
      recipeIdList: DATA.next.recipeIdList,
      nextPaymentPrice: nextPaymentPrice, // 최종 계산된 가격
    };

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const apiUrl = `/api/subscribes/${subscribeId}`;
      const res = await putObjData(apiUrl, body);
      console.log(res);
      // if (!res.isDone) { //! TEST CODE //
        if(res.isDone){  // ! PRODUCT CODE
        setSubmitted(true);
        onShowModal('맞춤레시피 변경이 완료되었습니다.');
      } else {
        onShowModal(`데이터를 전송하는데 실패했습니다.\n${res.error}`);
      }
  
      setActiveConfirmModal(false);
    } catch (err) {
      console.error(err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onPrevPage = (confirm) => {
    if(confirm){
      window.location.href = `/mypage/dogs`;
    } else {
      setActiveConfirmModal(false);
    }
  };

  const onShowModal = (message) => {
    if (message) mct.alertShow();
    setModalMessage(message);
  };

  const onHideModal = () => {
    setModalMessage('');
    mct.alertHide();
  };

  const onSuccessChangeSubscribeOrder = () => {
    onHideModal();
    window.location.href = `/mypage/dogs`;
  };
  
  const onFailCallback = () => {
    window.location.href = `/mypage/dogs`;
  };

  if (!data || !DATA.prev.plan || !DATA.next.plan ) {
    return <FullScreenLoading/>;
  }
  
  return (
    <>
      <MetaTitle title={`정기구독 플랜레시피 변경`} />
      <Layout>
        <Wrapper>
          <section className={s.title}>
            <div className={s.title_text}>구독정보 변경</div>
            <div className={s.title_text_2}>{DATA.lastSurveyDate} 설문결과</div>
            <div className={`${s.notice}`}>
              변경사항은 &apos;다음 정기결제&apos;부터 적용되며, <br />
              발송예정일이 공휴일인 경우 익일 배송됩니다.
            </div>
          </section>

          <section className={s.before_result}>
            <div className={s.before_result_content}>
              <div className={s.inner_content}>
                <div className={s.line_box}>
                  <span className={s.left_box}>플랜</span>
                  <span className={s.right_box}>{subscribePlanType[DATA.prev.plan].KOR}</span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>레시피</span>
                  <span className={s.right_box}>
                    {seperateStringViaComma(DATA.prev.recipeName).map((recipeName, i)=><em key={`prev-recipeName-${i}`}>{recipeName}</em>)}
                  </span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>급여량</span>
                  <span className={s.right_box}>
                       {DATA.prev.oneMealGrams.map((gram, i)=><em key={`prev-oneMealGrams-${i}`}>{transformLocalCurrency( gram ) + "g "}</em>)}
                  </span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>다음 결제일</span>
                  <span className={s.right_box}>{transformDate(DATA.prev.nextPaymentDate)}</span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>결제 예정 금액</span>
                  <span className={s.right_box}>
                    {transformLocalCurrency(DATA.prev.nextPaymentPrice)}원
                  </span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>발송 예정일</span>
                  <span className={s.right_box}>{DATA.prev.nextDeliveryDate}</span>
                </div>
              </div>
            </div>
          </section>

          <section className={s.mid_image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require('public/img/survey/survey_down_arrow.png')}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </section>

          <section className={s.after_result}>
            <div className={s.after_result_content}>
              <div className={s.inner_content}>
                <div className={s.line_box}>
                  <span className={s.left_box}>플랜</span>
                  <span className={s.right_box}>{subscribePlanType[DATA.next.plan].KOR}</span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>레시피</span>
                  <span className={s.right_box}>
                     {seperateStringViaComma(DATA.next.recipeName).map((recipeName, i)=><em key={`next-recipeName-${i}`}>{recipeName}</em>)}
                  </span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>급여량</span>
                  <span className={s.right_box}>
                    {DATA.next.oneMealGrams.map((gram, i)=><em key={`next-oneMealGrams-${i}`}>{transformLocalCurrency( gram ) + "g "}</em>)}
                  </span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>다음 결제일</span>
                  <span className={s.right_box}>
                    <em>{transformDate(DATA.prev.nextPaymentDate)}</em>
                    <em>{transformDate(DATA.next.nextPaymentDate)}</em>
                  </span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>결제 예정 금액</span>
                  <span className={s.right_box}>
                    <em>{transformLocalCurrency(DATA.prev.nextPaymentPrice)}원</em>
                    <em>{transformLocalCurrency(DATA.next.nextPaymentPrice)}원</em>
                  </span>
                </div>
                <div className={s.line_box}>
                  <span className={s.left_box}>발송 예정일</span>
                  <span className={s.right_box}>
                    <em>{DATA.prev.nextDeliveryDate}</em>
                    <em>{DATA.next.nextDeliveryDate}</em>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className={s.btn_section}>
            <div className={s.box_btn}>
              <button type={'button'} className={s.top_btn} data-button-type={'submit'} onClick={onActiveConfirmModal}>
                {isLoading.submit ? <Spinner style={{color:'#fff'}}/> : '구독정보 변경'}
              </button>
              <button type={'button'} className={s.bot_btn} data-button-type={'cancel'} onClick={onActiveConfirmModal}>
                취소
              </button>
            </div>
          </section>
        </Wrapper>
      </Layout>
      {(activeConfirmModal.submit || activeConfirmModal.cancel) && (
        <Modal_confirm
          text={
            activeConfirmModal.submit
              ? '구독정보를 변경하시겠습니까?\n변경사항은 기존 예약된 정기결제 배송완료 및\n그 다음 정기결제 완료 시 적용됩니다.'
              : `구독정보변경을 취소하시겠습니까?`
          }
          isConfirm={activeConfirmModal.submit ? onChangeSubscribeOrder : onPrevPage}
          positionCenter
        />
      )}
      <Modal_global_alert
        message={modalMessage}
        onClick={submitted ? onSuccessChangeSubscribeOrder : onHideModal}
        background
      />
      
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { dogId } = query;

  let data = null;
  const getSurveyReportApiUrl = `/api/dogs/${dogId}/surveyReport`;
  const surveyResportInfoRes = await getDataSSR(req, getSurveyReportApiUrl);
  if(surveyResportInfoRes.data){
    data = {
      surveyReportInfo: surveyResportInfoRes.data,
    };
  }

  

  if(!data){
    return {
      redirect: {
        permanent: false,
        destination: "/account/login",
      },
      props:{},
    }
  }

  return { props: { data } };
}
