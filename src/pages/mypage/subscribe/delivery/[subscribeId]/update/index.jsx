import React, { useEffect, useState } from 'react';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import WindowOpener from '/util/func/window-opener';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { useRouter } from 'next/router';
import Image from 'next/image';
import s from '../../../subscribe.module.scss';
import { validate } from '/util/func/validation/validation_delivery';
import { formattedProductionAndReceivingDate } from '/util/func/formattedProductionAndReceivingDate';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import ErrorMessage from '../../../../../../components/atoms/ErrorMessage';
import Modal_confirm from '../../../../../../components/modal/Modal_confirm';
import { postData } from '../../../../../api/reqData';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';

export default function SubscribeInfoPage({ data }) {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  //   const { subscribeId } = data;
  //   const subscribeInfo = useSubscribeInfo(subscribeId);
  const [formErrors, setFormErrors] = useState({});
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const initialDeliveryInfo = {
    zipcode: null, // 우편번호 (묶음 배송일 경우, null)
    street: null, // 도로명 주소 (묶음 배송일 경우, null)
    city: null,
    detailAddress: null, // 상세주소 (묶음 배송일 경우, null)
    recipientName: '',
    deliveryName: '',
    phoneNumber: '',
    request: '',
  };

  const [deliveryInfo, setDeliveryInfo] = useState(initialDeliveryInfo);
  const [onMount, setOnMount] = useState(false);

  useEffect(() => {
    if (!onMount) {
      setOnMount(true);
    }

    // 초기화
    setDeliveryInfo({
      zipcode: null, // 우편번호 (묶음 배송일 경우, null)
      street: null, // 도로명 주소 (묶음 배송일 경우, null)
      city: null,
      detailAddress: null, // 상세주소 (묶음 배송일 경우, null)
      recipientName: '',
      deliveryName: '',
      phoneNumber: '',
      request: '',
    });
    setIsActive(false);
    setFormErrors({});
  }, []);

  //   if (!subscribeInfo) {
  //     return <FullScreenLoading />;
  //   }

  const onReceivePopupData = (err, data) => {
    // MEMO DATA from POSTCODE API
    // MEMO ERROR CASE- 'data type string': popup window close event & popup window open event
    if (typeof data === 'string' || !Object.keys(data).length) return;
    const { address, zonecode, sido } = data;
    if (err) {
      // console.log(err);
    }

    setDeliveryInfo((prevState) => ({
      ...prevState,
      zipcode: zonecode,
      street: address,
      city: sido,
    }));

    const errObj = validate(deliveryInfo);
    const isPassed = valid_hasFormErrors(errObj);

    if (isPassed) {
      setFormErrors({});
      setIsActive(true);
    }
  };

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
    }

    setDeliveryInfo((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));

    const errObj = validate(deliveryInfo);
    const isPassed = valid_hasFormErrors(errObj);

    if (isPassed) {
      setFormErrors({});
      setIsActive(true);
    }
  };

  // 유효성 검사
  const validateForm = async () => {
    const errObj = await validate(deliveryInfo);
    const isPassed = valid_hasFormErrors(errObj);
    if (isPassed) {
      setFormErrors({});
      setIsActive(true);
      return true;
    } else if (!isPassed) {
      setFormErrors(errObj);
      setIsActive(false);
      return false;
    }
  };

  const onClickModalButton = () => {
    // mct.alertHide();
  };

  // 모달창 open
  const onActiveConfirmModal = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      return;
    } else {
      setActiveConfirmModal(true);
    }
  };

  const onChangeHandler = async (confirm) => {
    setActiveConfirmModal(true);
    if (!confirm) {
      return setActiveConfirmModal(false);
    }

    try {
      const apiUrl =
        data.changeType === 'once'
          ? `/api/address/subscribe/${data.subscribeId}/onetime`
          : `/api/address/subscribe/${data.subscribeId}/permanent`;
      const res = await postData(apiUrl, deliveryInfo);
      console.log(res.status);
      if (res.status === 200) {
        router.push(`/mypage/subscribe/delivery/${data.subscribeId}`);
        mct.alertShow(`주소가 변경되었습니다.`, onSuccessCallback);
      } else {
        mct.alertShow('변경에 실패하였습니다.');
      }
      setActiveConfirmModal(false);
    } catch (err) {
      mct.alertShow('서버 통신 장애 발생');
      console.error(err);
    } finally {
    }
  };

  const onSuccessCallback = () => {
    // window.location.reload();
    router.push(`/mypage/subscribe/delivery/${data.subscribeId}`);
  };

  const onPrevPage = () => {
    router.push(`/mypage/subscribe/delivery/${data.subscribeId}`);
  };

  // console.log(deliveryInfo);

  return (
    <>
      <MetaTitle title="구독 배송지 관리" />
      <LayoutWithoutFooter>
        <Wrapper>
          <MypageWrapper>
            <header>
              <div className={s.prev_btn} style={{ cursor: 'pointer' }}>
                <Image
                  src={'/img/order/left_arrow.svg'}
                  alt="left_arrow"
                  width={24}
                  height={24}
                  onClick={onPrevPage}
                />
              </div>
            </header>

            <section className={s.title}>
              <div className={s.title_delivery_detail}>
                <strong>
                  {' '}
                  {data.changeType === 'once'
                    ? '1회'
                    : data.changeType === 'permanent'
                    ? '영구'
                    : ''}{' '}
                  변경
                </strong>
                을 선택하셨습니다.
              </div>
              <div className={s.title_delivery_detail_info}>
                {data.changeType === 'once'
                  ? '1회 변경 후 다시 기존 주소로 배송됩니다.'
                  : data.changeType === 'permanent'
                  ? '주소 변경 시 해당 주소로 매번 배송됩니다.'
                  : ''}{' '}
              </div>
            </section>

            <div className={s.address_list}>
              <div className={s.grid_box}>
                <p>배송지 명칭</p>
                <div className={s.input_col}>
                  <input
                    id={'deliveryName'}
                    type={'text'}
                    className={s.input_box}
                    placeholder={'예) 댕댕이네'}
                    value={deliveryInfo.deliveryName || ''}
                    onChange={onInputChangeHandler}
                    style={{ marginBottom: '20px' }}
                  />
                  {formErrors.deliveryName && (
                    <ErrorMessage>{formErrors.deliveryName}</ErrorMessage>
                  )}
                </div>

                <p>받는 분</p>
                <div className={s.input_col}>
                  <input
                    id={'recipientName'}
                    type={'text'}
                    className={s.input_box}
                    placeholder={'이름'}
                    value={deliveryInfo.recipientName || ''}
                    onChange={onInputChangeHandler}
                    style={{ marginBottom: '20px' }}
                  />
                  {formErrors.recipientName && (
                    <ErrorMessage>{formErrors.recipientName}</ErrorMessage>
                  )}
                </div>

                <p>연락처</p>
                <div className={s.input_col}>
                  <input
                    id={'phoneNumber'}
                    type={'text'}
                    className={s.input_box}
                    data-input-type={'number'}
                    placeholder={'‘-’ 없이 숫자만 입력'}
                    value={deliveryInfo.phoneNumber || ''}
                    onChange={onInputChangeHandler}
                    style={{ marginBottom: '20px' }}
                  />
                  {formErrors.phoneNumber && (
                    <ErrorMessage>{formErrors.phoneNumber}</ErrorMessage>
                  )}
                </div>

                <p className={s.row_title}>주소</p>
                {formErrors.street && (
                  <ErrorMessage>{formErrors.street}</ErrorMessage>
                )}
                <ul className={s.address_box}>
                  <li className={`${s.input_col} ${s.zipcode}`}>
                    <input
                      id={'zipcode'}
                      type={'text'}
                      className={`${s.input_box}`}
                      data-input-type={'number'}
                      placeholder={'우편번호'}
                      disabled
                      value={deliveryInfo.zipcode || ''}
                    />
                    {onMount && (
                      <WindowOpener
                        url={'/popup/searchAddress'}
                        bridge={onReceivePopupData}
                      >
                        <span className={`${s.btn} ${s.btn_box}`}>
                          {deliveryInfo?.city ? '재검색' : '주소검색'}
                        </span>
                      </WindowOpener>
                    )}
                  </li>

                  <li className={s.input_col}>
                    <input
                      className={s.input_box}
                      placeholder={'주소'}
                      id={'street'}
                      type={'text'}
                      disabled
                      value={deliveryInfo.street || ''}
                    />
                  </li>
                  <li className={s.input_col}>
                    <input
                      id={'detailAddress'}
                      type={'text'}
                      className={s.input_box}
                      placeholder={'상세주소'}
                      value={deliveryInfo.detailAddress || ''}
                      onChange={onInputChangeHandler}
                    />
                    {formErrors.detailAddress && (
                      <ErrorMessage>{formErrors.detailAddress}</ErrorMessage>
                    )}
                  </li>
                </ul>

                <p style={{ marginTop: '20px' }}>배송 요청사항</p>
                <div className={s.input_col}>
                  <input
                    className={s.input_box}
                    placeholder={'직접입력'}
                    id={'request'}
                    type={'text'}
                    value={deliveryInfo.request || ''}
                    onChange={onInputChangeHandler}
                  />
                </div>
              </div>
              <button
                className={`${s.change_address_btn}     ${
                  isActive ? s.isActive : ''
                }`}
                onClick={onActiveConfirmModal}
                disabled={!isActive}
              >
                변경하기
              </button>
            </div>
          </MypageWrapper>
        </Wrapper>
      </LayoutWithoutFooter>
      {/* {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )} */}

      {activeConfirmModal && (
        <Modal_confirm
          title={
            data.changeType === 'once'
              ? '1회 변경을 선택하셨습니다.'
              : '영구 변경을 선택하셨습니다.'
          }
          text={`
변경된 주소로 
${data.changeType === 'once' ? '1회' : '영구'} 변경 예정입니다.
(${formattedProductionAndReceivingDate().formattedReceivingDate}건에 해당)

이대로 변경하시겠습니까?`}
          isConfirm={onChangeHandler}
          positionCenter
          height={'270px'}
        />
      )}
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { subscribeId, changeType } = query;

  const data = {
    subscribeId,
    changeType,
  };

  return { props: { data } };
}
