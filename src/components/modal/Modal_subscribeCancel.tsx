import s from './modal_changeItemOrderState.module.scss';
import ModalWrapper from './ModalWrapper';
import CloseButton from '../atoms/CloseButton';
import CustomRadio from '../admin/form/CustomRadio';
import Spinner from '../atoms/Spinner';
import React, {useEffect, useState} from 'react';
import Modal_global_alert from "@src/components/modal/Modal_global_alert";
import {useModalContext} from "@store/modal-context";
import animateWindow from "@util/func/animateWindow";
import {postPaymentDataToApiServer} from "../../pages/api/postPaymentDataToApiServer";

const formIdList = [
  '구매의사 취소 (구매자 귀책)',
  '다른 상품 잘못 주문 (구매자 귀책)',
  '택배사의 귀책으로 상품이 훼손됐을 때 (판매자 귀책)',
  '고객이 주문한 제품과 다른 제품이 배송됐을 때 (판매자 귀책)',
  '상품이 파손되었을 때 (판매자 귀책)',
];
const formLabelList = [
  <p className={s.reason} key={'form-label-01'}>
    구매의사 취소&nbsp;<span className={s.responsibility}>(구매자 귀책)</span>
  </p>,
  <p className={s.reason} key={'form-label-02'}>
    다른 상품 잘못 주문&nbsp;<span className={s.responsibility}>(구매자 귀책)</span>
  </p>,
  <p className={s.reason} key={'form-label-03'}>
    택배사의 귀책으로 상품이 훼손됐을 때&nbsp;
    <span className={s.responsibility}>(판매자 귀책)</span>
  </p>,
  <p className={s.reason} key={'form-label-04'}>
    고객이 주문한 제품과 다른 제품이 배송됐을 때&nbsp;
    <span className={s.responsibility}>(판매자 귀책)</span>
  </p>,
  <p className={s.reason} key={'form-label-05'}>
    상품이 파손됐을 때&nbsp;<span className={s.responsibility}>(판매자 귀책)</span>
  </p>,
];

export const Modal_subscribeCancel = ({onHideModal, subscribeId}) => {
  const initialFormValues = {
    selectedItemIdList: [], // 주문한 상품orderItem Id List
    reason: formIdList[0],
    detailReason: '',
  };
  
  const mct = useModalContext();
  const [form, setForm] = useState(initialFormValues);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState({submit: false});
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    
    if (typeof window === 'undefined') return;
    const Y = window.scrollY || 0;
    document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        width:100%;
        top : -${Y}px;
      `;
    
    setMounted(true);
    return () => {
      animateWindow(Y);
      setMounted(false);
    };
  }, []);
  
  const onInputChange = (e) => {
    const { id, value } = e.currentTarget;
    
    setForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  
  const hideModal = () => {
    onHideModal( null );
  };
  
  const onSubmit = async () => {
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');
    const body = {
      reason: form.reason,
      detailReason: form.detailReason,
    };
    console.log('RESPONSE subscribe Cancle body:\n',body);

    try {
      setIsSubmitted(true);
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      const url = `/api/orders/${subscribeId}/subscribe/cancelRequest`;
      const res = await postPaymentDataToApiServer(url, body); // timeout(요청대기시간): 네이버페이 검수
      console.log('RESPONSE subscribe Cancle',res);
      if (res.isDone) {
        mct.alertShow(`구독 취소요청이 접수되었습니다.`);
      } else {
        setIsSubmitted(false);
        mct.alertShow(`구독 취소요청에 실패하였습니다.`);
      }
    } catch (err) {
      console.error('통신에러: ', err);
      mct.alertShow(`[데이터 처리 오류] \n${err}`);
      setIsSubmitted(false);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  };
  
  
  const onSuccessSubmitCallback = () => {
    mct.alertHide();
    window.location.reload();
  };
 
  
  return (
   <> <ModalWrapper id={s.modal} background positionCenter className={'animation-show'}>
     <section className={s['title-section']}>
       <h2>구독 취소요청</h2>
       <CloseButton onClick={hideModal} className={s['closeButton']}/>
     </section>
     <section className={s['body-section']}>
       <div className={s.form}>
         <h6 className={s.title}>취소 사유를 선택해주세요.</h6>
         <CustomRadio
           name="reason"
           className={s['radio-input-wrap']}
           idList={formIdList}
           labelList={formLabelList}
           value={form.reason}
           setValue={setForm}
           getDirValue={false}
         />
         <div className={s['detailReason']}>
            <textarea
              id={'detailReason'}
              name="detailReason"
              placeholder={'상세사유를 입력해주세요.'}
              value={form.detailReason}
              onChange={onInputChange}
            ></textarea>
         </div>
       </div>
     </section>
     <section className={s['btn-section']}>
       <button type={'button'} className={`${s['cancle']}`} onClick={isSubmitted ? onSuccessSubmitCallback : hideModal}>
         닫기
       </button>
       <button type={'button'} className={`${s['confirm']}`} onClick={onSubmit}>
         {isLoading.submit ? <Spinner style={{color: '#fff'}}/> : `취소요청`}
       </button>
     </section>
   </ModalWrapper>
     {mounted && <Modal_global_alert onClick={isSubmitted && onSuccessSubmitCallback} />}
   </>
  );
};
