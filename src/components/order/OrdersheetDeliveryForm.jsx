import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import React, { useEffect, useState } from 'react';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import ErrorMessage from '../atoms/ErrorMessage';
import WindowOpener from '/util/func/window-opener';
import CustomRadioTrueOrFalse from '../admin/form/CustomRadioTrueOrFalse';

export const OrdersheetDeliveryForm = ({ info, form, setForm, formErrors }) => {
  
  const initialDeliveryInfos = {
    name: null, // 수령자 이름 ("정기배송과" 묶음 배송일 경우, null => 정기배송 수령자를 따름)
    phone: null, // 수령자 전화번호 (묶음 배송일 경우, null)
    zipcode: null, // 우편번호 (묶음 배송일 경우, null)
    street: null, // 도로명 주소 (묶음 배송일 경우, null)
    city: null,
    detailAddress: null, // 상세주소 (묶음 배송일 경우, null)
    request: null, // 배송 요청사항 (묶음 배송일 경우, null)
  }
  // 묶음배송여부 ! Client ONLY  (cf. 묶음배송아닐 경우, form.deliveryId = null)
  const [bundle, setBundle] = useState( false );
  const [sameUserInfo, setSameUserInfo] = useState( false );
  // 배송정보
  const [deliveryInfo, setDeliveryInfo] = useState(initialDeliveryInfos);
  // console.log(deliveryInfo)
  // console.log(sameUserInfo)

  useEffect(() => {
    
     const deliveryDto = {}
    for (const key in deliveryInfo) {
      const val = deliveryInfo[key];
      deliveryDto[key] = bundle ? null : val;
    }
    
    setForm((prevState) => ({
      ...prevState,
      deliveryDto,
      deliveryId: bundle ? info.deliveryId : null,
      bundle
    }));
    
  }, [deliveryInfo]);
  
  useEffect( () => {
    // !bundle && form.sameUserInfo ? info.phoneNumber : deliveryInfo.phone || ''
    // console.log('배송정버 뱐걍 ')
    // {!bundle && form.sameUserInfo ? info.name : deliveryInfo.name || ''}
    setDeliveryInfo(prevState => ({
      ...prevState,
      name: bundle ? null : sameUserInfo ? info.name : '',
      phone: bundle ? null : sameUserInfo ? info.phone : '', // 수령자 전화번호 (묶음 배송일 경우, null)
      zipcode: bundle ? null : sameUserInfo ? info.address.zipcode : '', // 우편번호 (묶음 배송일 경우, null)
      street: bundle ? null : sameUserInfo ? info.address.street : '', // 도로명 주소 (묶음 배송일 경우, null)
      city: bundle ? null : sameUserInfo ? info.address.city : '',
      detailAddress: bundle ? null : sameUserInfo ? info.address.detailAddress : '', // 상세주소 (묶음 배송일 경우, null)
      request: bundle ? null : sameUserInfo ? info.address.request : '', // 배송 요청사항 (묶음 배송일 경우, null)
    }))
    if(bundle){
      setDeliveryInfo(initialDeliveryInfos)
    }
  }, [bundle, sameUserInfo] );
  

  const onReceivePopupData = (err, data) => {
    // MEMO DATA from POSTCODE API
    // MEMO ERROR CASE- 'data type string': popup window close event & popup window open event
    if (typeof data === 'string' || !Object.keys(data).length) return;
    const { address, zonecode, sido } = data;
    if (err) {
      console.log(err);
    }
    setDeliveryInfo((prevState) => ({
      ...prevState,
      zipcode: zonecode,
      street: address,
      city: sido,
    }));
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
  };

  return (
    <>
      <section className={s.reciever}>
        <div className={s.title}>받는 사람 정보</div>
        <div className={s.check_box}>
          <div className={s.auto__login__check}>
            <PureCheckbox
              id={'sameUserInfo'}
              className={s.text}
              value={!bundle && sameUserInfo || ''}
              setValue={setSameUserInfo}
              disabled={bundle}
              returnBoolean
            >
              주문자 정보와 같습니다.
            </PureCheckbox>
          </div>
        </div>
        <div className={s.grid_box}>
          <p>받는 분</p>
          <div className={s.input_col}>
            <input
              id={'name'}
              type={'text'}
              className={s.input_box}
              placeholder={bundle ? '다음 정기구독 수령자': '이름'}
              value={!bundle && deliveryInfo.name || ''}
              onChange={onInputChangeHandler}
              disabled={bundle}
            />
            <ErrorMessage>{formErrors.name}</ErrorMessage>
          </div>

          <p>연락처</p>
          <div className={s.input_col}>
            <input
              id={'phone'}
              type={'text'}
              className={s.input_box}
              data-input-type={'number'}
              placeholder={bundle ? '' : "‘-’없이 숫자만 입력"}
              value={!bundle && deliveryInfo.phone || ''}
              onChange={onInputChangeHandler}
              disabled={bundle}
            />
            <ErrorMessage>{formErrors.phone}</ErrorMessage>
          </div>

          <p className={s.row_title}>주소</p>
          <ul className={s.adress_box}>
            <li className={`${s.input_col} ${s.zipcode}`}>
              <input
                id={'zipcode'}
                type={'text'}
                className={`${s.input_box}`}
                data-input-type={'number'}
                placeholder={bundle ? '': '우편번호'}
                disabled
                value={!bundle && deliveryInfo.zipcode || ''}
              />
              <WindowOpener
                url={'/popup/searchAddress'}
                bridge={onReceivePopupData}
                disabled={!bundle && !!form.sameUserInfo || bundle}
              >
                <span className={`${s.btn} ${s.btn_box} ${(bundle || form.sameUserInfo) ? s.disabled : ''}`}>
                  {deliveryInfo?.city ? '재검색' : '주소검색'}
                </span>
              </WindowOpener>
            </li>

            <li className={s.input_col}>
              <input
                className={s.input_box}
                placeholder={bundle ? '다음 정기구독 배송 수령지' : '주소'}
                id={'street'}
                type={'text'}
                disabled
                value={!bundle && deliveryInfo.street || ''}
              />
              <ErrorMessage>{formErrors.street}</ErrorMessage>
            </li>
            <li className={s.input_col}>
              <input
                id={'detailAddress'}
                type={'text'}
                className={s.input_box}
                placeholder={bundle ? '':'상세주소'}
                value={!bundle && deliveryInfo.detailAddress || ''}
                onChange={onInputChangeHandler}
                disabled={bundle}
              />
              <ErrorMessage>{formErrors.detailAddress}</ErrorMessage>
            </li>
          </ul>

          <p>배송 요청사항</p>
          <div className={s.input_col}>
            <input
              className={s.input_box}
              placeholder={bundle ? '': '직접입력'}
              id={'request'}
              type={'text'}
              value={!bundle && deliveryInfo.request || ''}
              onChange={onInputChangeHandler}
              disabled={bundle}
            />
          </div>
        </div>
      </section>

      <section className={s.line}>
        <hr />
      </section>
      <section className={s.shipping}>
        <h3 className={s.title}>배송 정보</h3>
        <div className={s.box}>
          <ul className={s.grid_box}>
            <li className={s.left_box}>
              <span>단품</span>
              {form?.orderItemDtoList && (
                <p>
                  {form.orderItemDtoList[0].name}
                  {form.orderItemDtoList.length >= 2 &&
                    ` 외 ${form?.orderItemDtoList.length - 2}건`}
                </p>
              )}
            </li>
            <li></li>
            <li className={s.mid_box}>
              <span>배송방법</span>
              <p>배송 예정 일시</p>
            </li>

            <li className={s.right_box}>
              <span>단품주문</span>
              <p>
                {/*정기구독 묶음 배송이 true인 경우, 최근 정기배송일자 //// false인 경우,, 단품배송일자*/}
                <span>
                  {form.deliveryId
                    ? info.nextSubscribeDeliveryDate
                    : '***TEST_일반배송일 경우, 배송예정일시***'}
                </span>
                (배송 후 카톡 안내)
              </p>
            </li>
          </ul>
        </div>
        {info.deliveryId && (
          <CustomRadioTrueOrFalse
            name="bundle"
            returnBooleanValue
            value={bundle}
            setValue={setBundle}
            labelList={['HIDDEN-LABEL-TRUE', 'HIDDEN_LABEL-FALSE']}
            className={`${s.bundleShipping} ${bundle ? s.active : s.inActive}`}
            components={[
              <div className={s.text}>
                정기구독 배송시 묶음 배송 신청
                <p>배송비가 추가 되지 않아요</p>
              </div>,
              <div className={s.text}>
                단품 주문으로 별도 배송 요청
                <p>배송비가 추가 됩니다</p>
              </div>,
            ]}
          />
        )}
      </section>
      <section className={s.line}>
        <hr />
      </section>
    </>
  );
};
