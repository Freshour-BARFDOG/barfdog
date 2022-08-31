import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import React, {useContext, useEffect, useState} from 'react';
import {useModalContext} from "/store/modal-context";
import {ToggleBoxContext} from "/src/components/atoms/ToggleBox";
import {FullScreenLoading} from "/src/components/atoms/FullScreenLoading";
import {postObjData} from "/src/pages/api/reqData";
import Modal_confirm from "/src/components/modal/Modal_confirm";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import CustomRadio from "/src/components/admin/form/CustomRadio";
import {subscribePlanType} from "/store/TYPE/subscribePlanType";
import transformDate from "/util/func/transformDate";
import {calcChangedSubscribeDeliveryDate} from "/util/func/calcNextSubscribeDeliveryDate";
import {subscribeSkipType} from "/store/TYPE/subscribeSkipType";



export const SubscribeSkipPayment = ({subscribeInfo}) => {
  // console.log(subscribeInfo);
  const curPlan = subscribeInfo.plan.name;
  const curPlanWeeklyPaymentCycle = subscribePlanType[curPlan].weeklyPaymentCycle;
  const inputIdKey = 'weeklySkipCount';
  const inputIdList = [`${inputIdKey}-1`, `${inputIdKey}-${curPlanWeeklyPaymentCycle}`];
  const inputLabelList = ['1주 건너뛰기','1회 건너뛰기'];
  const initialInputValue = inputIdList[0];
  const initialDelvieryDate = subscribeInfo.info.nextDeliveryDate;
  
  
  const mct = useModalContext();
  const tbContext = useContext(ToggleBoxContext);
  const [skipCount, setSkipCount] = useState( initialInputValue);
  const [changedDelvieryDate, setChangedDelvieryDate] = useState(initialDelvieryDate);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect( () => {
    const periodInWeeks = Number(skipCount.split('-')[1]);
    const result = calcChangedSubscribeDeliveryDate(initialDelvieryDate, periodInWeeks);
    // console.log(initialDelvieryDate)
    // console.log(periodInWeeks)
    setChangedDelvieryDate(result);
  }, [skipCount] );
  
  const onSubmit = async (confirm) => {
    if (!confirm) {
      return setActiveConfirmModal(false);
    }
    if (submitted) return console.error('이미 제출된 양식입니다.');
    const selectedSkipCount = Number(skipCount.split('-')[1]);
    const skipType = selectedSkipCount === 1 ? subscribeSkipType.WEEK : subscribeSkipType.ONCE; // 건너뛰기 타입
    
    const body = {
      id: subscribeInfo.info.subscribeId,
      type: skipType,
    }
    
    try {
      setIsLoading(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/skip/${skipType}`;
      const res = await postObjData(url, body);
      console.log(res);
      // if (!res.isDone) {
        // ! TEST CODE //
        if (res.isDone) {  // ! PRODUCT CODE //
        setSubmitted(true);
        mct.alertShow('구독 건너뛰기가 적용되었습니다.');
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
      }
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('err: ', err);
    }
    setIsLoading(false);
  };
  
  const onSuccessChangeSubscribeOrder = () => {
    setIsLoading({ reload: true });
    mct.alertHide();
    window.location.reload();
  };
  
  
  
  return (
    <>
      {isLoading.reload && <FullScreenLoading />}
      <div className={`${s.content_inner_box4}`}>
        <div className={s.text}>
          이번 구독만 잠시 쉬고 싶으신가요? <br />
          건너뛰기 주기를 선택해주세요.
        </div>

        <div className={s.radio_box}>
          <CustomRadio
            className={`${s['customRadio-weeklySkipCount']}`}
            name="weeklySkipCount"
            idList={inputIdList}
            labelList={inputLabelList}
            value={skipCount}
            setValue={setSkipCount}
            getDirValue
          />
        </div>

        <p className={s.d_day_text}>
          기존 발송 예정일은<span>{transformDate(initialDelvieryDate, '월일') || '정보없음'}</span>입니다
        </p>
        <p className={s.d_day_text2}>
          변경 발송 예정일은<span className={s.red_span}>{transformDate(changedDelvieryDate, '월일')}</span>입니다
        </p>

        <div className={s.picture_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority={false}
              src={require('public/img/mypage/subscribe/dogldx/subscribe_ldx_slide4.png')}
              objectFit="cover"
              layout="fill"
              alt="배송 안내 이미지"
            />
          </div>
        </div>

        <div className={s.btn_box}>
          <button type={'button'} className={s.btn} onClick={()=>{
            setActiveConfirmModal(true);
          }}>건너뛰기 적용하기</button>
        </div>
      </div>
      {activeConfirmModal && (
        <Modal_confirm text={`${(()=>{
          const selectedIndex =  inputIdList.indexOf(skipCount);
          const skipMethodName = inputLabelList.filter((label,index)=>index === selectedIndex)[0];
          const skipWeeklyCount = inputIdList[selectedIndex].split('-')[1];
          return `건너뛰기 해지는 구독취소&재결제해야합니다.\n정말 ${skipMethodName}(${skipWeeklyCount}주)를 적용하시겠습니까?`;
        })()}`} isConfirm={onSubmit} positionCenter option={{wordBreak: true}} />
      )}
      {tbContext.visible && (
        <Modal_global_alert
          onClick={submitted ? onSuccessChangeSubscribeOrder : mct.alertHide}
          background
        />
      )}
    </>
  );
};