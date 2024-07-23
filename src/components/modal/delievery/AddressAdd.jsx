import React, { useEffect, useState } from 'react';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import WindowOpener from '/util/func/window-opener';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import ErrorMessage from '../../../components/atoms/ErrorMessage';
import { validate } from '/util/func/validation/validation_delivery';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';

export default function AddressAdd({
  deliveryInfo,
  setDeliveryInfo,
  formErrors,
  setFormErrors,
  setIsActive,
}) {
  // 묶음배송여부 ! Client ONLY  (cf. 묶음배송아닐 경우, form.deliveryId = null) // 정기구독중이지 않을 경우, 묶음배송기능 아예 작동하지 않게함
  const [bundle, setBundle] = useState(false);
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

  return (
    <>
      <h1
        style={{
          paddingBottom: '20px',
        }}
      >
        배송지 입력
      </h1>
      <div className={s.address_list}>
        <div className={s.grid_box}>
          <p>배송지 명칭</p>
          <div className={s.input_col}>
            <input
              id={'deliveryName'}
              type={'text'}
              className={s.input_box}
              placeholder={'예) 댕댕이네'}
              value={(!bundle && deliveryInfo.deliveryName) || ''}
              onChange={onInputChangeHandler}
              disabled={bundle}
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
              placeholder={bundle ? '다음 정기구독 수령자' : '이름'}
              value={(!bundle && deliveryInfo.recipientName) || ''}
              onChange={onInputChangeHandler}
              disabled={bundle}
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
              placeholder={bundle ? '' : '‘-’ 없이 숫자만 입력'}
              value={(!bundle && deliveryInfo.phoneNumber) || ''}
              onChange={onInputChangeHandler}
              disabled={bundle}
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
          <ul className={s.adress_box}>
            <li className={`${s.input_col} ${s.zipcode}`}>
              <input
                id={'zipcode'}
                type={'text'}
                className={`${s.input_box}`}
                data-input-type={'number'}
                placeholder={bundle ? '' : '우편번호'}
                disabled
                value={(!bundle && deliveryInfo.zipcode) || ''}
              />
              {onMount && (
                <WindowOpener
                  url={'/popup/searchAddress'}
                  bridge={onReceivePopupData}
                  // disabled={(!bundle && !!form.sameUserInfo) || bundle}
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
                placeholder={bundle ? '다음 정기구독 배송 수령지' : '주소'}
                id={'street'}
                type={'text'}
                disabled
                value={(!bundle && deliveryInfo.street) || ''}
              />
            </li>
            <li className={s.input_col}>
              <input
                id={'detailAddress'}
                type={'text'}
                className={s.input_box}
                placeholder={bundle ? '' : '상세주소'}
                value={(!bundle && deliveryInfo.detailAddress) || ''}
                onChange={onInputChangeHandler}
                disabled={bundle}
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
              placeholder={bundle ? '' : '직접입력'}
              id={'request'}
              type={'text'}
              value={(!bundle && deliveryInfo.request) || ''}
              onChange={onInputChangeHandler}
              disabled={bundle}
            />
          </div>
        </div>
      </div>
    </>
  );
}
