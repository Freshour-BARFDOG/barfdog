import s from './modal_mypageSubscribeCancel.module.scss';
import ModalWrapper from './ModalWrapper';
import CloseButton from '../atoms/CloseButton';
import CustomRadio from '../admin/form/CustomRadio';
import Spinner from '../atoms/Spinner';
import React, { useEffect, useState } from 'react';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { postObjData } from '/src/pages/api/reqData';
import { useModalContext } from '/store/modal-context';
import animateWindow from '/util/func/animateWindow';
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

export const Modal_mypageSubscribeCancel = ({ onHideModal, subscribeId }) => {
  const initialFormValues = {
    reasonList: [],
    enteredReason: '',
  };

  const mct = useModalContext();
  const [form, setForm] = useState(initialFormValues);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState({});
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
    onHideModal(null);
  };

  const onSubmit = async (e) => {
    const emptyReasonCount = form.reasonList
      .map((reason) => (reason === '기타' ? form.enteredReason : reason))
      .filter((reason) => reason.trim() === '').length;

    if (form.reasonList.length === 0) {
      return mct.alertShow('중단 사유를 선택해주세요.');
    } else if (emptyReasonCount) {
      return mct.alertShow('기타 항목이 비어있습니다.');
    }

    e.preventDefault();
    if (!confirm) return setActiveConfirmModal(false);

    const body = {
      reasonList: form.reasonList.map((reason) =>
        reason === '기타' ? form.enteredReason.trim() : reason,
      ),
    };

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      const url = `/api/subscribes/${subscribeId}/stop`;
      const res = await postObjData(url, body);
      console.log(body);
      console.log('RESPONSE subscribe Cancle', res);
      if (res.isDone) {
        // if (!res.isDone) { //  ! TEST TEST
        mct.alertShow('구독이 취소되었습니다.', onSuccessChangeSubscribeOrder);
        setIsSubmitted(true);
      } else {
        mct.alertShow(`구독 취소요청에 실패하였습니다.`);
      }
    } catch (err) {
      console.error('통신에러: ', err);
      mct.alertShow(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onSuccessChangeSubscribeOrder = () => {
    setIsLoading({ reload: true });
    mct.alertHide();
    window.location.href = `/mypage/subscribe/${subscribeId}`;
  };

  const onSuccessSubmitCallback = () => {
    mct.alertHide();
    window.location.reload();
  };

  const onCheckboxValueChange = (checked, id) => {
    const selectedCheckbox = checkboxList.filter(
      (checkbox) => checkbox.id === id,
    )[0];

    const thisVal = selectedCheckbox.label;
    setForm((prevState) => {
      let nextReasonList = prevState.reasonList || [];
      if (checked) {
        // 기존 arr에 없으면, 추가
        prevState.reasonList?.indexOf(thisVal) < 0 &&
          nextReasonList.push(thisVal);
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
        enteredReason:
          id === etcInput.id && !checked ? '' : prevState.enteredReason,
      };
    });
  };

  return (
    <>
      {' '}
      <ModalWrapper
        id={s.modal}
        background
        positionCenter
        className={'animation-show'}
      >
        <section className={s['title-section']}>
          <CloseButton onClick={hideModal} className={s['closeButton']} />
          <h2>바프독 정기구독 해지 신청</h2>
        </section>
        <section className={s['body-section']}>
          <div className={s.form}>
            <div>
              정기구독을 중단하고 싶으신가요? <br />
              바프독이 더 나은 서비스를 제공할 수 있도록 <br />
              중단하시는 사유를 알려주세요
              <br /> <br />
              (현재 정기구독 상품이 마지막으로 배송되며,
              <br /> 예약된 정기구독 서비스는 즉시 중지됩니다.)
            </div>

            <ul
              className={`${s['checkbox-container']} animation-show-all-child`}
            >
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
                  {form.reasonList.filter(
                    (label) => label === checkbox.label,
                  )[0] &&
                    checkbox.label === '기타' && (
                      <div>
                        <input
                          id={'enteredReason'}
                          className={'animation-show'}
                          type="text"
                          value={form.enteredReason || ''}
                          onChange={onInputChange}
                          placeholder={'상세사유를 입력해주세요.'}
                        />
                      </div>
                    )}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className={s['btn-section']}>
          <button
            type={'button'}
            className={`${s['cancle']}`}
            onClick={isSubmitted ? onSuccessSubmitCallback : hideModal}
          >
            정기구독 유지하기
          </button>
          <button
            type={'button'}
            className={`${s['confirm']}`}
            onClick={onSubmit}
          >
            {isLoading.submit ? (
              <Spinner style={{ color: '#fff' }} />
            ) : (
              `정기구독 해지하기`
            )}
          </button>
        </section>
      </ModalWrapper>
      {mounted && (
        <Modal_global_alert onClick={isSubmitted && onSuccessSubmitCallback} />
      )}
    </>
  );
};
