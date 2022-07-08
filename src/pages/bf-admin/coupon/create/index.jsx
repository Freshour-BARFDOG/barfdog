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
import {postObjData} from "/api/reqData";
import {useModalContext} from "/store/modal-context";
import transformClearLocalCurrencyInEveryObject from "/util/func/transformClearLocalCurrencyInEveryObject";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {discountUnitType} from "/store/TYPE/discountUnitType";
import errorMessage from "/src/components/atoms/ErrorMessage";

const initialFormValues = {
  name: '', // str
  description: '', // str
  couponTarget: 'ALL', //str // Radio Button
  code: '', // str
  discountDegree: '0', // ui comma표기 시, str => submit시 num으로 변경
  discountType: 'FLAT_RATE', // str
  availableMaxDiscount: '0', // ui comma표기 시, str => submit시 num으로 변경
  availableMinPrice: '0', // ui comma표기 시, str => submit시 num으로 변경
  amount: '0', // ui comma표기 시, str => submit시 num으로 변경
};



function CreateCouponPage() {
  const postFormValuesApiUrl = '/api/admin/coupons';
  const couponLimitedAmount = 9999;
  const unitSettings = [
    { label: '%', value: discountUnitType.FIXED_RATE },
    { label: '원', value: discountUnitType.FLAT_RATE },
  ]
  
  
  const router = useRouter();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  
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
  
  const onSubmit = async (e) => {
    e.preventDefault();
    const errObj = validate(formValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    let filteredFormValues = formValues;
    const filterStringObj = {
      discountDegree: 'discountDegree',
      availableMaxDiscount: 'availableMaxDiscount',
      availableMinPrice : 'availableMinPrice',
      amount: 'amount',
    }
    filteredFormValues = transformClearLocalCurrencyInEveryObject(filteredFormValues, filterStringObj);
    console.log(formValues);
    console.log(filteredFormValues);
    
    if(isSubmitted) {
      console.error('이미 제출된 양식입니다.');
      onGlobalModalCallback();
      return;
    } else if (!isPassed) {
      return alert('유효하지 않은 항목이 있습니다.');
    }
    
   
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const res = await postObjData(postFormValuesApiUrl, filteredFormValues);
      console.log(res);
      if (res.isDone) {
        onShowModalHandler('쿠폰이 성공적으로 등록되었습니다.');
        setIsSubmitted(true);
      } else {
        alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      alert('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };
  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };
  
  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };
  
  const onGlobalModalCallback = () => {
    mct.alertHide();
    router.push('/bf-admin/coupon/search');
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
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      쿠폰이름
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
                    <label className="title" htmlFor="desc">
                      쿠폰설명
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
                        idList={['ALL', 'SUBSCRIBE', 'GENERAL']}
                        labelList={['전체', '정기구독', '일반상품']}
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
                      쿠폰코드
                      <Tooltip
                        message={`- 쿠폰코드 규칙\n1. 문자열 15자 이내 (영문 대소문자, 숫자)\n2. 회원 마이페이지에서 쿠폰코드 후 사용가능\n3. 동일한 쿠폰에 대하여 1회 사용가능.`}
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
                      할인금액
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
              onClick={returnToPrevPage}
            >
              취소
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
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default CreateCouponPage;
