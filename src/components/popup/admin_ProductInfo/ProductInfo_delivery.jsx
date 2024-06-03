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

  const onSuccessCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  const onAddressChangeHandler = async () => {
    try {
      const url = `/api/admin/deliveries/${orderId}/recipientAddress`;
      const res = await putObjData(url, recipientAddress);
      console.log(res);
      if (res.isDone) {
        mct.alertShow('배송지 주소를 변경하였습니다.', onSuccessCallback);
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
      }
    } catch (err) {
      alert(err);
    }
  };

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
              <span>{deliveryInfo.recipientName}</span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>연락처</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformPhoneNumber(deliveryInfo.recipientPhone)}</span>
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
                  <button onClick={onAddressChangeHandler}>변경</button>
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
              <span>{deliveryInfo.request || '-'}</span>
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
