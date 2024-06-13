import s from './popup_sell.module.scss';
import m from '/src/pages/account/signup/signup.module.scss';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import transformDate from '/util/func/transformDate';
import React, { useEffect, useState } from 'react';
import popupWindow from '../../../../util/func/popupWindow';
import dynamic from 'next/dynamic';
import SignInput_address from '../../user_signup/SignInput_address';
import SignupInput from '../../user_signup/SignupInput';
import { useModalContext } from '/store/modal-context';
import { Tooltip } from 'antd';
import filter_emptyValue from '/util/func/filter_emptyValue';
import DeliveryInput from './DeliveryInput';
import filter_specialCharacter from '/util/func/filter_specialCharacter';
import { putObjData } from '../../../pages/api/reqData';
import Modal_global_alert from '../../modal/Modal_global_alert';
const WindowOpener = dynamic(() => import('/util/func/window-opener'), {
  ssr: false,
});

const ProductInfo_delivery = ({ deliveryInfo, orderId }) => {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined')
      return console.error('window is not defined');
    const href = e.currentTarget.href;
    popupWindow(href, { width: 540, height: 480, left: 200, top: 100 });
  };

  const [formValues, setFormValues] = useState({
    recipientName: deliveryInfo.recipientName,
    recipientPhone: transformPhoneNumber(deliveryInfo.recipientPhone),
    request: deliveryInfo.request,
  });

  const [recipientAddress, setRecipientAddress] = useState({
    zipcode: deliveryInfo.zipcode,
    street: deliveryInfo.street,
    detailAddress: deliveryInfo.detailAddress,
  });

  useEffect(() => {
    setRecipientAddress({
      zipcode: deliveryInfo.zipcode,
      street: deliveryInfo.street,
      detailAddress: deliveryInfo.detailAddress,
    });
  }, [deliveryInfo]);

  // console.log('orderId', orderId);
  // console.log('deliveryInfo', deliveryInfo);
  // console.log('recipientAddress', recipientAddress);

  const onReceivePopupData = (err, data) => {
    const { address, zonecode, sido } = data;

    if (address === undefined) {
      return;
    } else {
      setRecipientAddress((prevState) => ({
        ...prevState,
        street: address,
        zipcode: zonecode,
      }));
    }
  };

  const onDetailAddressHandler = (e) => {
    const { value } = e.currentTarget;
    const detailAddress = filter_specialCharacter(value);

    setRecipientAddress((prevState) => ({
      ...prevState,
      detailAddress: detailAddress,
    }));
  };

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    // console.log('value', value);
    // console.log('filteredType', filteredType);

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
    }

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSuccessCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  const onSubmitHandler = async (text) => {
    if (formValues.recipientName === '') {
      mct.alertShow('수취인명을 입력해주세요.');
      return;
    }
    if (formValues.recipientPhone === '') {
      mct.alertShow('수취인 연락처를 입력해주세요.');
      return;
    }

    // 입력된 번호에서 숫자만 추출
    let normalizedPhone = formValues.recipientPhone.replace(/[^0-9]/g, '');
    const phoneRegExp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
    const isValidPhone = phoneRegExp.test(normalizedPhone);
    if (!isValidPhone) {
      mct.alertShow('수취인 연락처를 올바르게 입력해주세요.');
      return;
    }

    try {
      const body = {
        recipient: {
          zipcode:
            text === '배송지 주소'
              ? recipientAddress.zipcode
              : deliveryInfo.zipcode,
          street:
            text === '배송지 주소'
              ? recipientAddress.street
              : deliveryInfo.street,
          detailAddress:
            text === '배송지 주소'
              ? recipientAddress.detailAddress
              : deliveryInfo.detailAddress,
          name:
            text === '수취인명'
              ? formValues.recipientName
              : deliveryInfo.recipientName,
          phone:
            text === '연락처' ? normalizedPhone : deliveryInfo.recipientPhone,
        },
        request:
          text === '요청사항' ? formValues.request : deliveryInfo.request,
      };
      const url = `/api/admin/deliveries/${orderId}/recipientAndRequest`;
      const res = await putObjData(url, body);

      // console.log('body', body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow(`${text}를 변경하였습니다.`, onSuccessCallback);
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
      }
    } catch (err) {
      alert(err);
    }
  };
  // console.log(deliveryInfo);
  // console.log('formValues', formValues);

  return (
    <>
      <div className={s['t-header']}>
        <h4 className={s.title}>배송정보</h4>
      </div>
      <ul className={s['t-body']}>
        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>수취인명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              {/* <span>{deliveryInfo.recipientName}</span> */}
              <input
                type="text"
                id="recipientName"
                value={formValues.recipientName || ''}
                onChange={onInputChangeHandler}
                // data-input-type={'number, demicals, currency'}
                className={`${s.recipientNameInput}`}
              ></input>
              <button
                className={`admin_btn line point basic_s ${s.recipe_change_btn}`}
                onClick={() => {
                  onSubmitHandler('수취인명');
                }}
              >
                변경
              </button>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>연락처</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              {/* <span>{transformPhoneNumber(deliveryInfo.recipientPhone)}</span> */}
              <input
                type="text"
                id="recipientPhone"
                value={formValues.recipientPhone || ''}
                onChange={onInputChangeHandler}
                className={`${s.recipientNameInput}`}
              ></input>
              <button
                className={`admin_btn line point basic_s ${s.recipe_change_btn}`}
                onClick={() => {
                  onSubmitHandler('연락처');
                }}
              >
                변경
              </button>{' '}
            </div>
          </div>
        </li>
        <li className={`${s['t-row']} ${s['fullWidth']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label} ${s.deliveryInput}`}>
              <span>배송지 주소</span>
            </div>
            <div className={`${s.innerBox} ${s.cont} ${s.deliveryInput}`}>
              <DeliveryInput
                type={'text'}
                required={true}
                id={'address'}
                title={'주소 검색'}
                placeholder={'기본주소'}
                // errorMessage={errorMessage}
                addressStreet={deliveryInfo.street}
                addedClassName={['add-btn-section', 'active-address']}
                disabled
                value={recipientAddress.street || deliveryInfo.street || ''}
                setFormValues={setRecipientAddress}
                icon={
                  deliveryInfo.street && (
                    <Tooltip
                      className={m.addressToolTip}
                      message={`${deliveryInfo.street}\n(우:${deliveryInfo.zipcode})`}
                      messagePosition={'right'}
                      theme={'white'}
                      device={'mobile'}
                    />
                  )
                }
              >
                <WindowOpener
                  url={'/popup/searchAddress'}
                  bridge={onReceivePopupData}
                >
                  <span className={`${m.btn} ${m.bigbtn}`}>
                    {deliveryInfo.city ? '재검색' : '주소검색'}
                  </span>
                </WindowOpener>
                {/* {formErrors.address && (
                    <ErrorMessage>{formErrors.address}</ErrorMessage>
                  )} */}
                <label>
                  <input
                    type="text"
                    id={'address-detailAddress'}
                    placeholder={'상세주소'}
                    value={recipientAddress.detailAddress}
                    onChange={onDetailAddressHandler}
                  />
                  <button onClick={() => onSubmitHandler('배송지 주소')}>
                    변경
                  </button>
                  {/* {(!formValues.address.detailAddress ||
                        formValues.address.detailAddress === '') &&
                        formErrors.detailAddress && (
                          <ErrorMessage>
                            {formErrors.detailAddress}
                          </ErrorMessage>
                        )} */}
                </label>
              </DeliveryInput>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']} ${s['fullWidth']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송 요청사항</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              {/* <span>{deliveryInfo.request || '-'}</span> */}
              <input
                type="text"
                id="request"
                value={formValues.request || ''}
                onChange={onInputChangeHandler}
                className={`${s.requestInput}`}
              ></input>
              <button
                className={`admin_btn line point basic_s ${s.recipe_change_btn}`}
                onClick={() => {
                  onSubmitHandler('요청사항');
                }}
              >
                변경
              </button>{' '}
            </div>
          </div>
        </li>

        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>발송처리일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                {transformDate(deliveryInfo.departureDate, 'time', {
                  seperator: '/',
                }) || '-'}
              </span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송완료일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                <span>
                  {transformDate(deliveryInfo.arrivalDate, 'time', {
                    seperator: '/',
                  }) || '-'}
                </span>
              </span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']} ${s.autoHeight}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}  ${s['auto-height']}`}>
              <span>송장번호</span>
            </div>
            <div className={`${s.innerBox} ${s.cont} ${s['auto-height']}`}>
              {!deliveryInfo.deliveryNumber ? (
                '-'
              ) : (
                <>
                  <span>
                    {deliveryInfo.deliveryCode === 'EPOST'
                      ? '우체국 '
                      : '대한통운 '}
                    {deliveryInfo.deliveryNumber}
                  </span>
                  <span>
                    <a
                      // 배송지키미
                      href={`https://trace.goodsflow.com/VIEW/V1/whereis/${process.env.NEXT_PUBLIC_GOODSFLOW_SITECODE}/${deliveryInfo.deliveryCode}/${deliveryInfo.deliveryNumber}`}
                      // href={`http://nexs.cjgls.com/web/service02_01.jsp?slipno=${deliveryInfo.deliveryNumber}`}
                      target="_blank"
                      className="admin_btn line basic_s"
                      rel={'noreferrer'}
                      onClick={onPopupHandler}
                    >
                      배송조회
                    </a>
                  </span>
                </>
              )}
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구매확정일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                {transformDate(deliveryInfo.orderConfirmDate, 'time', {
                  seperator: '/',
                }) || '-'}
              </span>
            </div>
          </div>
        </li>
      </ul>

      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
};

export default ProductInfo_delivery;
