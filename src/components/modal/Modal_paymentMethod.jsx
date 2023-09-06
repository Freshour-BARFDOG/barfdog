import ModalWrapper from "./ModalWrapper";
import s from "./modal_paymentMethod.module.scss";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {OrdersheetMethodOfPayment} from "../order/OrdersheetMethodOfPayment";
import Spinner from "../atoms/Spinner";
import {paymentMethodType} from "../../../store/TYPE/paymentMethodType";

export default function Modal_paymentMethod({data, onChangeCard, setActiveModal, isSubmitted,isLoading,...props}) {

  const cardInfo = useMemo(() => data, [data]);
  const [targetScrollYPos, setTargetScrollYPos] = useState(null);
  const [form, setForm] = useState({paymentMethod: cardInfo.paymentMethod});


  useEffect(() => {
    const scrollYPos = window.scrollY;
    document.body.style.cssText = `
          position:fixed;
          top : -${scrollYPos}px;
        `;
    setTargetScrollYPos(scrollYPos);
    window.scrollTo(0, parseInt(scrollYPos || targetScrollYPos));
    return () => {
      document.body.style.cssText = ``;
      window.scrollTo(0, parseInt(scrollYPos || targetScrollYPos)); // alert가 unmounted 되고,  body의 fixed styled이 사라지면서, scrollY position이 화면 최상단으로 변경되는 것을 막음
    };
  }, []);

  const executeHandler = useCallback(async () => {
    const {paymentMethod} = form;
    const subscribeId = cardInfo.subscribeId;

    // ! Validation - 네이버페이
    if (paymentMethod === paymentMethodType.NAVER_PAY) {
      return alert("네이버페이는 연동 준비 중입니다.")
    }

    // Data setting
    const data = {
      subscribeId: subscribeId,
      paymentMethod: paymentMethod
    };

    onChangeCard(data);

  }, [form, cardInfo, isSubmitted, isLoading.submit]);

  const onHideModal = () => {
    setActiveModal(false);
  }

  if (!data) {
    return;
  }

  return (
    <ModalWrapper
      className={`${s['modal_wrap']}`}
      label="Modal_ChangePaymentMethod"
      background
      positionCenter
      {...props}
    >
      {cardInfo?.info?.dogName && <div className={s['info-section']}>
        (<span className={s.dogName}>{cardInfo?.info?.dogName}</span>)
      </div>}

      <div className={s['body-section']}>
        <OrdersheetMethodOfPayment id={"paymentMethod"} form={form} setForm={setForm} formErrors={{}}/>
      </div>
      <div className={s['btn-section']}>
        <button className={'custom_btn solid popup'} onClick={executeHandler}>{isLoading.submit ? <Spinner style={{color: '#fff'}}/> : "확인"}</button>
        <button className={'custom_btn line popup'} onClick={onHideModal}>취소</button>
      </div>
    </ModalWrapper>
  );
};
