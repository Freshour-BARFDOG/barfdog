import React, {useEffect, useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import Tooltip from '/src/components/atoms/Tooltip';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import UnitBox from '/src/components/atoms/UnitBox';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import { useRouter } from 'next/router';
import filter_limitedNumber from '/util/func/filter_limitedNumber';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import Spinner from "/src/components/atoms/Spinner";
import {validate} from "/util/func/validation/validation_createCupon";
import {valid_couponCode, valid_hasFormErrors} from "/util/func/validation/validationPackage";
import {postObjData} from "/src/pages/api/reqData";
import {useModalContext} from "/store/modal-context";
import transformClearLocalCurrencyInEveryObject from "/util/func/transformClearLocalCurrencyInEveryObject";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {discountUnitType} from "/store/TYPE/discountUnitType";
import {couponUseType, global_couponType} from "/store/TYPE/couponType";
import {filterObjectKeys, filterObjectValues} from "/util/func/filter/filterTypeFromObejct";

const initialFormValues = {
  couponType: global_couponType.CODE_PUBLISHED,
  name: '', // str
  description: '', // str
  couponTarget: 'ALL', //str // Radio Button
  code: '', // str
  discountDegree: '0', // ui comma표기 시, str => submit시 num으로 변경
  discountType: discountUnitType.FIXED_RATE, // str
  availableMaxDiscount: '0', // ui comma표기 시, str => submit시 num으로 변경
  availableMinPrice: '0', // ui comma표기 시, str => submit시 num으로 변경
  amount: '0', // ui comma표기 시, str => submit시 num으로 변경
};



export default function CreateCouponPage() {

  const couponLimitedAmount = 9999;
  const unitSettings = [
    { label: '%', value: discountUnitType.FIXED_RATE },
    { label: '원', value: discountUnitType.FLAT_RATE },
  ]
  
  
  const router = useRouter();
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // // console.log(formValues)
  
  useEffect( () => {
    setFormValues(prevState => ({
      ...prevState,
      discountDegree:  '0'
    }))
  }, [formValues.discountType] );
  
  

  const onCouponAmountCheckboxHandler = (isChecked) => {
    const infiniteNum = transformLocalCurrency(`${couponLimitedAmount*10+9}`);

    setFormValues((prevState) => ({
      ...prevState,
      amount: isChecked ? infiniteNum : 0,
    }));
  };

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    if(id === 'code'){
      const errorMessage = valid_couponCode(value);
      setFormErrors(prevState => ({
        ...prevState,
        [id]: errorMessage
      }))
    }
    if (filteredType) {
      filteredValue = filter_emptyValue(value);
    }
    
    if (filteredType && filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }
    if (id === 'amount') {
      filteredValue = filter_limitedNumber(filteredValue, couponLimitedAmount);
    }

    if (filteredType && filteredType.indexOf('currency') >= 0) {
      filteredValue = transformLocalCurrency(filteredValue);
    }

    if (filteredType && filteredType.indexOf('discountPercent') >= 0) {
      filteredValue = transformClearLocalCurrency(filteredValue) > '100' ? '100' : filteredValue;
      // - MEMO 100 : string이어야함.
    }

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSubmit = async () => {
    if (isSubmitted) return console.error("Already submitted!");
    const body = {
      name: formValues.name,
      description: formValues.description,
      couponTarget: formValues.couponTarget,
      code: formValues.code,
      couponType: formValues.couponType,
      discountDegree: transformClearLocalCurrency(formValues.discountDegree),//
      discountType: formValues.discountType,
      availableMaxDiscount: transformClearLocalCurrency(formValues.availableMaxDiscount),//
      availableMinPrice: transformClearLocalCurrency(formValues.availableMinPrice),//
      amount: transformClearLocalCurrency(formValues.amount),//
      type: formValues.type,
    }
    // console.log(body);

    const errObj = validate(body);
    setFormErrors(errObj);

    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return mct.alertShow('유효하지 않은 항목이 있습니다.');


    try {
      setIsSubmitted(true);
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const apiUrl = '/api/admin/coupons';
      const res = await postObjData(apiUrl, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow('쿠폰이 성공적으로 등록되었습니다.', onGlobalModalCallback);
      } else {
        mct.alertShow(`쿠폰을 등록할 수 없습니다.\n (${res.error})`);
        setIsSubmitted(false);
      }
    } catch (err) {
      console.error(err.response);
      mct.alertShow('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      setIsSubmitted(true);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  };

  const returnToListPage = () => {
    if (confirm('목록 페이지로 이동하시겠습니까?')) {
      window.location.href = '/bf-admin/coupon/search';
    }
  };

  const onGlobalModalCallback = () => {
    window.location.href = '/bf-admin/coupon/search';
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };
  
  return (
    <>
      <MetaTitle title="쿠폰 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>쿠폰 생성</h1>
          </div>
          <div className="cont">
            <div className="cont_body">
              <section className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title">
                      쿠폰 타입
                      <Tooltip
                        message={`- '프로모션' 타입: 프로모션 생성 페이지에서 발급 가능`}
                        messagePosition={'left'}
                        width={'320px'} wordBreaking={true}/>
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <CustomRadio
                        setValue={setFormValues}
                        name="couponType"
                        idList={[global_couponType.CODE_PUBLISHED, global_couponType.PROMOTION_PUBLISHED]}
                        labelList={[global_couponType.KOR.CODE_PUBLISHED, global_couponType.KOR.PROMOTION_PUBLISHED]}
                      />
                      {formErrors.couponType && (
                        <ErrorMessage>{formErrors.couponType}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      쿠폰 이름
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'name'}
                        type="text"
                        name="create-coupon"
                        className="fullWidth"
                        value={formValues.name}
                        onChange={onInputChangeHandler}
                      />
                      {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <section className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="description">
                      쿠폰 설명
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'description'}
                        type="text"
                        name="create-coupon"
                        className="fullWidth"
                        value={formValues.description}
                        onChange={onInputChangeHandler}
                      />
                      {formErrors.description && (
                        <ErrorMessage>{formErrors.description}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              {/* cont_divider */}
              <section className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title">사용처</label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <CustomRadio
                        setValue={setFormValues}
                        name="couponTarget"
                        idList={filterObjectKeys(couponUseType)}
                        labelList={filterObjectValues(couponUseType.KOR)}
                      />
                      {formErrors.couponTarget && (
                        <ErrorMessage>{formErrors.couponTarget}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              {/* cont_divider */}
              <section className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="code">
                      쿠폰 코드
                      <Tooltip
                        message={`- 쿠폰코드 규칙\n1. 문자열 15자 이내 (영문 대소문자)\n2. 회원 마이페이지에서 쿠폰코드 후 사용가능\n3. 동일한 쿠폰에 대하여 1회 사용가능.`}
                        messagePosition={'left'}
                        width={'280px'} wordBreaking={true}/>
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'code'}
                        className={'text-align-right'}
                        type="text"
                        name="create-coupon"
                        data-filter-type={'code'}
                        value={formValues.code}
                        onChange={onInputChangeHandler}
                      />
                      {formErrors.code && (
                        <ErrorMessage>{formErrors.code}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              {/* cont_divider */}
              <section className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="discountDegree">
                      할인{formValues.discountType === discountUnitType.FIXED_RATE ? "률" : "금액"}
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'discountDegree'}
                        className={'text-align-right'}
                        name="create-coupon"
                        type="text"
                        data-input-type={`currency, number, ${
                          formValues.discountType === discountUnitType.FIXED_RATE && 'discountPercent'
                        }`}
                        value={formValues.discountDegree || '0'}
                        onChange={onInputChangeHandler}
                      />
                      <UnitBox
                        name={'discountType'}
                        setValue={setFormValues}
                        unitList={unitSettings}
                      />
                      {formErrors.discountDegree && (
                      <ErrorMessage>{formErrors.discountDegree}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              {/* cont_divider */}
              <section className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="availableMaxDiscount">
                      최대 할인금액
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'availableMaxDiscount'}
                        className={'text-align-right'}
                        name="create-coupon"
                        type="text"
                        data-input-type={'number, currency'}
                        value={formValues.availableMaxDiscount || '0'}
                        onChange={onInputChangeHandler}
                      />
                      <span>원 할인</span>
                      {formErrors.availableMaxDiscount && (
                        <ErrorMessage>{formErrors.availableMaxDiscount}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              {/* cont_divider */}
              <section className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="availableMinPrice">
                      최소 사용금액
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'availableMinPrice'}
                        className={'text-align-right'}
                        name="create-coupon"
                        type="text"
                        data-input-type={'number, currency'}
                        value={formValues.availableMinPrice || '0'}
                        onChange={onInputChangeHandler}
                      />
                      <span className="unit"> 원 이상</span>
                      {formErrors.availableMinPrice && (
                        <ErrorMessage>{formErrors.availableMinPrice}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              {/* cont_divider */}
              <section className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="amount">
                      사용한도(횟수)
                      <Tooltip
                        message={`사용한도가 ${couponLimitedAmount}회 이상일 경우, 무제한 체크박스를 활용하세요.`}
                        messagePosition={'left'}
                      />
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'amount'}
                        className={'text-align-right'}
                        data-input-type={'number, currency'}
                        value={formValues.amount || '0'}
                        type="text"
                        name="create-coupon"
                        disabled={
                          transformClearLocalCurrency(formValues.amount) >= couponLimitedAmount
                        }
                        onChange={onInputChangeHandler}
                      />
                      <span>회</span>
                      <div className="checkbox-wrap">
                        <PureCheckbox
                          id={'amout-unlimited'}
                          eventHandler={onCouponAmountCheckboxHandler}
                        >
                          무제한
                        </PureCheckbox>
                      </div>
                      {formErrors.amount && (
                        <ErrorMessage>{formErrors.amount}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              {/* cont_divider */}
            </div>
          </div>
          <div className="btn_section outer">
            <button
              type="button"
              id="btn-cancle"
              className="admin_btn confirm_l line"
              onClick={returnToListPage}
            >
              목록
            </button>
            <button
              type="button"
              id="btn-create"
              className="admin_btn confirm_l solid"
              onClick={onSubmit}
            >
              {isLoading.submit ? <Spinner style={{color:'#fff'}}/> : '등록'}
            </button>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert onClick={onClickModalButton} background/>}
    </>
  );
}
