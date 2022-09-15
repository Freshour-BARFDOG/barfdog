import ModalWrapper from '@src/components/modal/ModalWrapper';
import CloseButton from '@src/components/atoms/CloseButton';
import ScrollContainer from '@src/components/atoms/ScrollContainer';
import React, { useEffect, useState } from 'react';
import s from './modal_previewRecipeThumb.module.scss';
import { postObjData } from '@src/pages/api/reqData';
import filter_emptyValue from '@util/func/filter_emptyValue';
import filter_onlyNumber from '@util/func/filter_onlyNumber';
import filter_specialCharacter from '@util/func/filter_specialCharacter';
import ErrorMessage from '@src/components/atoms/ErrorMessage';
import { valid_hasFormErrors } from '@util/func/validation/validationPackage';
import { validate } from '@util/func/validation/valid_sendSmsMessage';
import Spinner from "@src/components/atoms/Spinner";
import {useModalContext} from "@store/modal-context";


const Modal_sendPhoneMessage = ({ setModalState, data, setModalMessage }) => {
  const mct = useModalContext();
  const [siteLink, setSiteLink] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false); // boolean
  const [enteredForm, setEnteredForm] = useState({
    friendName: '',
    friendPhoneNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});
  useEffect(() => {
    if (window && typeof window !== 'undefined') {
      setSiteLink(window.location.origin);
    }
  }, []);

  const onModalHide = () => {
    setModalState(false);
  };

  const onInputChangeHandler = (event) => {
    const input = event.currentTarget;
    const { id, value } = input;
    let filteredValue = value;
    const filterType = input.dataset.inputType;
    filteredValue = filter_emptyValue(filteredValue);
    filteredValue = filter_specialCharacter(filteredValue);
    if (filterType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }
    setEnteredForm((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSendPhoneMessage = async () => {
    const errObj = validate(enteredForm);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return;
    const body = {
      name: enteredForm.friendName, // 친구 이름
      phone: enteredForm.friendPhoneNumber, // 친구 휴대폰전화번호
      homePageUrl: siteLink, // 현재 사이트 링크
    };
    try {
      setIsLoading(true);
      const url = '/api/mypage/inviteSms';
      const res = await postObjData(url, body);
      console.log(res);
      if (res.isDone) {
  
        ////////////////////////////////////////////////////////
        //// - TEST : 성공했다고 가정하고, 이후 CLIENT TEST상태 진행
        if (res.isDone) {
          await setModalMessage('친구에게 메시지를 성공적으로 전송했습니다.')
          mct.alertShow();
          onModalHide();
        }
        ////////////////////////////////////////////////////////
        
        const smsStatus = res.data.data.responseCode;
        // 전송 SUCCESS
        if (smsStatus === 0) {
          setModalMessage('친구에게 메시지를 성공적으로 전송했습니다.')
          mct.alertShow();
        }
     
        // 전송 FAIL
        const smsErrObj= {}
        if (smsStatus === 100) {
        } else if (smsStatus === 101) {
          smsErrObj.sendResult = '전송자의 번호가 유효하지 않습니다.'
        } else if (smsStatus === 102) {
          smsErrObj.sendResult = '수신자의 번호가 유효하지 않습니다.'
        } else if (smsStatus === 200 || smsStatus === 201 || smsStatus === 205 || smsStatus >= 500) {
          smsErrObj.sendResult = `(ERROR: ${smsStatus}) 메시지를 전송할 수 없습니다. 관리자에게 문의하세요.`
        }
        setFormErrors(smsErrObj);
        /* ! CF ) SENDMESSAGE API RESPONS STATUS & MESSAGE
          - 100 : POST validation 실패
          - 101 : sender 유효한 번호가 아님
          - 102 : recipient 유효한 번호가 아님
          - 103 : 회원정보가 일치하지 않음
          - 104 : 받는 사람이 없습니다
          - 105 : message length = 0, message length >= 2000, title >= 20
          - 106 : message validation 실패
          - 107 : 이미지 업로드 실패
          - 108 : 이미지 갯수 초과
          - 109 : return_url이 유효하지 않습니다
          - 110 : 이미지 용량 300kb 초과
          - 111 : 이미지 확장자 오류
          - 112 : euckr 인코딩 에러 발생
          - 114 : 예약정보가 유효하지 않습니다.
          - 200 : 동일 예약시간으로는 200회 이상 API 호출을 할 수 없습니다.
          - 201 : 분당 300회 이상 API 호출을 할 수 없습니다.
          - 205 : 잔액부족
          - 999 : Internal Error.
        */
      }
    } catch (err) {
        console.error(err)
    }
    setIsLoading(false)
    
  };

  return (
    <ModalWrapper background positionCenter className={'modal_sendPhoneMessage'} id={'modal'}>
      <CloseButton className={'top-close-button'} onClick={onModalHide} />
      <div className="row">
        <section className={'title-section'}>
          <h2>문자보내기</h2>
        </section>
        <section className="cont-section">
          <ScrollContainer scrollBarWidth={'0'}>
            <p>[바프독]</p>
            <p>
              <span>{data.name}</span>님이
              <span>
                <input
                  id={'friendName'}
                  className={s['user-entered-input']}
                  type="text"
                  data-input-type={'onlyString'}
                  value={enteredForm.friendName}
                  onChange={onInputChangeHandler}
                  placeholder={'친구이름'}
                />
              </span>
              님에게 바프독 적립금을 선물했습니다.
            </p>
            <p>가입 후 마이페이지에서 추천코드를 입력해주세요!</p>
            <p>
              추천코드 : <span>{data.recommendCode}</span>
            </p>
            <p>
              가입하러가기 : <span>{siteLink}</span>
            </p>
            <p className={s['input-phoneNumber-wrap']}>
              <span>친구 연락처: </span>
              <input
                id={'friendPhoneNumber'}
                className={`${s['user-entered-input']} ${s.phoneNumber}`}
                type="text"
                data-input-type={'number'}
                value={enteredForm.friendPhoneNumber}
                onChange={onInputChangeHandler}
                placeholder={'"-"를 제외한 휴대전화번호'}
              />
            </p>
          </ScrollContainer>
        </section>
        {formErrors.friendName && (
          <div>
            <ErrorMessage>{formErrors.friendName}</ErrorMessage>
          </div>
        )}
        {formErrors.friendPhoneNumber && (
          <div>
            <ErrorMessage>{formErrors.friendPhoneNumber}</ErrorMessage>
          </div>
        )}
        {formErrors.sendResult && (
          <div>
            <ErrorMessage>{formErrors.sendResult}</ErrorMessage>
          </div>
        )}
        <section className="btn-section">
          <button type={'button'} className={'btn line'} onClick={onModalHide}>
            취소
          </button>
          <button type={'button'} className={'btn solid'} onClick={onSendPhoneMessage}>
            {isLoading ? <Spinner style={{color:'#fff'}}/>  : '확인'}
          </button>
        </section>
      </div>
    </ModalWrapper>
  );
};

export default Modal_sendPhoneMessage;
