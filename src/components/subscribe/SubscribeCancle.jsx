import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import React, { useContext, useState } from 'react';
import { postObjData } from '../../pages/api/reqData';
import { useModalContext } from '../../../store/modal-context';
import { ToggleBoxContext } from '../atoms/ToggleBox';
import Modal_global_alert from '../modal/Modal_global_alert';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import PureCheckbox from '/src/components/atoms/PureCheckbox';

const checkboxList = [
  {
    id: 'checkbox-0',
    label: '아이가 잘 먹지 않아요.',
  },
  {
    id: 'checkbox-1',
    label: '급여방식이 너무 번거로워요',
  },
  {
    id: 'checkbox-2',
    label: '더 작은 용량의 샘플구매를 하고싶어요.',
  },
  {
    id: 'checkbox-3',
    label: '제품 패키징이 불편해요.',
  },
  {
    id: 'checkbox-4',
    label: '급여 방법을 잘 모르겠어요.',
  },
  {
    id: 'checkbox-5-기타',
    label: '기타',
  },
];

export const SubscribeCancle = ({ subscribeInfo }) => {
  // console.log(subscribeInfo);
  const initialFormValues = {
    reasonList: [],
    enteredReason: '',
  };

  const mct = useModalContext();
  const [form, setForm] = useState(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmitButtonClick = () => {
    const hasEmptyETCValue = form.reasonList
      .map((reason) => (reason === '기타' ? form.enteredReason : reason))
      .filter((reason) => !reason).length;

    if (form.reasonList.length === 0) {
      mct.alertShow('중단 사유를 선택해주세요.');
    } else if (hasEmptyETCValue) {
      mct.alertShow('기타항목이 비어있습니다.');
    } else {
      setActiveConfirmModal(true);
    }
  };


  const onCheckboxValueChange = (checked, id) => {
    const selectedCheckbox = checkboxList.filter((checkbox) => checkbox.id === id)[0];

    const thisVal = selectedCheckbox.label;
    setForm((prevState) => {
      let nextReasonList = prevState.reasonList || [];
      if (checked) {
        // 기존 arr에 없으면, 추가
        prevState.reasonList?.indexOf(thisVal) < 0 && nextReasonList.push(thisVal);
      } else {
        nextReasonList = prevState.reasonList?.filter((val) => {
          return val !== thisVal;
        });
      }

      // 기타 인풋 초기화
      const etcInput = checkboxList.filter((obj) => obj.label === '기타')[0];

      return {
        ...prevState,
        reasonList: nextReasonList,
        enteredReason: id === etcInput.id && !checked ? '' : prevState.enteredReason,
      };
    });
  };

  const onInputChange = (e) => {
    const { value, id } = e.currentTarget;
    // ! maxLength
    setForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  
  
  
  const onSubmit = async (confirm) => {
    if (!confirm) return setActiveConfirmModal(false);
    if (submitted) return console.error('이미 제출된 양식입니다.');
    
    const body = {
      reasonList: form.reasonList.map((reason) =>
        reason === '기타' ? form.enteredReason : reason,
      ),
    };
    
    try {
      setIsLoading(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/stop`;
      const res = await postObjData(url, body);
      console.log(res);
      // if (!res.isDone) { // ! TEST CODE //
      if (res.isDone) {  // ! PRODUCT CODE //
        setSubmitted(true);
        mct.alertShow('구독이 취소되었습니다.', onSuccessChangeSubscribeOrder);
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
    window.location.href = '/mypage/subscribe';
  };
  
  return (
    <>
      {isLoading.reload && <FullScreenLoading />}
      <div className={s.content_inner_box5}>
        <h2 className={s.title_text}>정기구독 중단 사유</h2>
        <p className={s.text}>
          정기구독을 중단하고 싶으신가요?
          <br />
          바프독이 더 나은 서비스를 제공할 수 있도록 중단하시는 이유를 알려주세요.
          <br />
          (현재 정기구독 상품이 마지막으로 배송되며, 예약된 정기구독 서비스는 즉시 중지됩니다.)
        </p>
        <ul className={`${s['checkbox-container']} animation-show-all-child`}>
          {checkboxList.map((checkbox, index) => (
            <li key={`checkbox-${index}`}>
              <PureCheckbox
                id={checkbox.id}
                className={s.checkbox}
                setValue={onCheckboxValueChange}
                returnBoolean
              >
                {checkbox.label}
              </PureCheckbox>
              {/*{form.reasonList.indexOf(checkbox.label) >= 0 && checkbox.children}*/}
              {form.reasonList.filter((label) => label === checkbox.label)[0] &&
                checkbox.label === '기타' && (
                  <input
                    id={'enteredReason'}
                    className={'animation-show'}
                    type="text"
                    value={form.enteredReason || ''}
                    onChange={onInputChange}
                    placeholder={'상세사유를 입력해주세요.'}
                  />
                )}
            </li>
          ))}
        </ul>
        <button type={'button'} className={s.btn} onClick={onSubmitButtonClick}>
          구독 중단하기
        </button>
      </div>
      {activeConfirmModal && (
        <Modal_confirm text={`구독을 취소하시겠습니까?`} isConfirm={onSubmit} positionCenter />
      )}
      {/*{tbContext.visible && (*/}
      {/*  <Modal_global_alert*/}
      {/*    onClick={submitted ? onSuccessChangeSubscribeOrder : mct.alertHide}*/}
      {/*    background*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};
