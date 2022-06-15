import React, { useState } from 'react';
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
import filter_limitedNumber from './filter_limitedsNumber';
import transformLocalCurrency from './transformLocalCurrency';
import transformClearLocalCurrency from './transformClearLocalCurrency';

const initialFormValues = {
  name: '',
  description: '',
  couponTarget: 'ALL',
  code: '',
  discountDegree: 0,
  discountType: 'FLAT_RATE',
  availableMaxDiscount: 0,
  availableMinPrice: 0,
  amount: 0,
};



const initialFormErrors = {

};

function CreateCouponPage() {
  const router = useRouter();

  const couponLimitedAmount = 9999;
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  console.log(formValues);


  const onCouponAmountCheckboxHandler = (isChecked) => {
    const infiniteNum = transformLocalCurrency('99999');

    setFormValues(prevState=>({
      ...prevState,
      amount: isChecked ? infiniteNum : 0
    }))
  }



  const onInputChangeHandler = (e) => {
    const input = e.currentTarget
    const { id, value } = input;
    const filteredType = input.dataset.inputType
    let filteredValue = filter_emptyValue(value);
    if (filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }

    if(id === 'amount'){
      filteredValue = filter_limitedNumber(filteredValue, couponLimitedAmount);
    }

    console.log(filteredValue)

    if (filteredType.indexOf('currency') >= 0){
      filteredValue = transformLocalCurrency(filteredValue);
    }
    console.log(filteredValue)

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
    // console.log('id:',id,' val:',filteredValue);
  };


  const returnToPrevPage = () => {
    if (confirm("이전 페이지로 돌아가시겠습니까?")) {
      router.back();
    }
  };


  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('onSubmit!');
    // MEMO : 서버에 전송할 때, 가격은........ transformClearLocalCurrency() 적용해야함
    // transformClearLocalCurrency();
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
            <div onSubmit={onSubmitHandler}>
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
                          // onChange={handleChange}
                        />
                        {/*{formErrors.name && (*/}
                        {/*  <ErrorMessage>{formErrors.name}</ErrorMessage>*/}
                        {/*)}*/}
                      </div>
                    </div>
                  </div>
                </div>
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
                          id={'desc'}
                          type="text"
                          name="create-coupon"
                          className="fullWidth"
                          // onChange={handleChange}
                        />
                        {/*{formErrors.name && (*/}
                        {/*  <ErrorMessage>{formErrors.name}</ErrorMessage>*/}
                        {/*)}*/}
                      </div>
                    </div>
                  </div>
                </section>
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
                        {/*{formErrors.name && (*/}
                        {/*  <ErrorMessage>{formErrors.name}</ErrorMessage>*/}
                        {/*)}*/}
                      </div>
                    </div>
                  </div>
                </section>
                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="code">
                        쿠폰코드
                        <Tooltip
                          message={
                            '쿠폰코드가 포함될 경우, 사용자는 동일한 쿠폰에 대하여 1회만 등록가능'
                          }
                          messagePosition={'left'}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'code'}
                          className={'text-align-right'}
                          type="text"
                          name="create-coupon"
                          // className="fullWidth"
                          // onChange={handleChange}
                        />
                        {/*{formErrors.name && (*/}
                        {/*  <ErrorMessage>{formErrors.name}</ErrorMessage>*/}
                        {/*)}*/}
                      </div>
                    </div>
                  </div>
                </section>
                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="discountDegree">
                        할인금액
                        <Tooltip
                          message={
                            '할인단위를 반드시 확인하시기 바랍니다.'
                          }
                          messagePosition={'left'}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'discountDegree'}
                          className={'text-align-right'}
                          name="create-coupon"
                          type="text"
                          data-input-type={'currency, number'}
                          value={formValues.discountDegree}
                          onChange={onInputChangeHandler}
                        />
                        {/*{formErrors.name && (*/}
                        {/*  <ErrorMessage>{formErrors.name}</ErrorMessage>*/}
                        {/*)}*/}
                        <UnitBox
                          name={'discountType'}
                          setValue={setFormValues}
                          unitList={[
                            { label: '%', value: 'FLAT_RATE' },
                            { label: '원', value: 'FIXED_RATE' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </section>
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
                          value={formValues.availableMaxDiscount}
                          onChange={onInputChangeHandler}
                        />
                        <span>원 할인</span>
                      </div>
                    </div>
                  </div>
                </section>
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
                          value={formValues.availableMinPrice}
                          onChange={onInputChangeHandler}
                        />
                        <span className="unit"> 원 이상</span>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="amount">
                        사용한도(횟수)
                        <Tooltip message={`사용한도가 ${couponLimitedAmount}회 이상일 경우, 무제한 체크박스를 활용하세요.`} messagePosition={'left'}/>
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'amount'}
                          className={'text-align-right'}
                          data-input-type={'number, currency'}
                          value={formValues.amount}
                          type="text"
                          name="create-coupon"
                          disabled={transformClearLocalCurrency(formValues.amount) >= couponLimitedAmount}
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
                      </div>
                    </div>
                  </div>
                </section>
              </div>
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
              onClick={onSubmitHandler}
            >
              등록
            </button>
          </div>

        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateCouponPage;
