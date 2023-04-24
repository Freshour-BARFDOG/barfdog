import ModalWrapper from "./ModalWrapper";
import s from "./modal_paymentMethod.module.scss";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {OrdersheetMethodOfPayment} from "../order/OrdersheetMethodOfPayment";
import {paymentMethodType} from "../../../store/TYPE/paymentMethodType";

export default function Modal_paymentMethod({data, onChangeCard, setActiveModal, ...props}) {

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

  const executeHandler = useCallback(() => {
    // 벨리데이션 추가하고.
    const {paymentMethod} = form;
    const subscribeId = cardInfo.subscribeId;

    // Validation
    if (paymentMethod === paymentMethodType.NAVER_PAY) {
      return alert("네이버페이는 연동 준비 중입니다.")
    }

    if(!subscribeId || !paymentMethod) {
      return alert(" 결제수단 처리 중 오류가 발생하여 카드 변경이 불가능합니다.");
    }

    // Data setting
    const data = {
      subscribeId: subscribeId,
      paymentMethod: paymentMethod
    };

    onChangeCard(data);

    // 성공했을 경우, 카드변경 실행

  }, [form]);

  const onHideModal = () => {
    setActiveModal(false)
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
      <div className={s['info-section']}>
        (<span className={s.dogName}>{cardInfo?.info?.dogName}</span>)
      </div>
      <div className={s['body-section']}>
        <OrdersheetMethodOfPayment id={"paymentMethod"} form={form} setForm={setForm} formErrors={{}}/>
      </div>
      <div className={s['btn-section']}>
        <button className={'custom_btn solid popup'} onClick={executeHandler}>확인</button>
        <button className={'custom_btn line popup'} onClick={onHideModal}>취소</button>
      </div>
    </ModalWrapper>
  );
};
