import React, {useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import filter_emptyValue from "/util/func/filter_emptyValue";
import filter_onlyNumber from "/util/func/filter_onlyNumber";
import filter_numberZeoFromTheIntegerPartOfTheDecimal from "/util/func/filter_numberZeoFromTheIntegerPartOfTheDecimal";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import ToolTip from "/src/components/atoms/Tooltip";
import transformLocalCurrency from "/util/func/transformLocalCurrency";




const initialFormValues = {
  deliveryFree: 0,
  freeDeliveryCondition: 0,
};

const initialFormErrors = {};



function DeliverySettingPage() {


  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  // console.log(formValues);



  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
    }

    if (filteredType && filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }

    if (filteredType && filteredType.indexOf('currency') >= 0) {
      filteredValue = transformLocalCurrency(filteredValue);
    }

    filteredValue = filter_numberZeoFromTheIntegerPartOfTheDecimal(filteredValue);

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue
    }));
  };


  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('제출!');
    alert('전체 배송비가 변경됩니다. 정말 변경하시겠습니까?')
  }; // * onSubmitHandler


  return (
    <>
      <MetaTitle title="배송정책 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>배송정책 설정</h1>
          </div>
          <form action="/src/pages" method="post" onSubmit={onSubmitHandler}>
            <div className="cont">
              <div className="cont_body">
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={`deliveryFee`}>
                        기본택배비
                        <ToolTip messagePosition={'center'} message={'모든 상품에 기본 적용되는 택배비용입니다.'}/>
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className={`inp_box`}>
                        <input
                          id={`deliveryFee`}
                          type="text"
                          data-input-type={'number, currency'}
                          value={formValues.deliveryFee || ''}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">원</em>
                        {formErrors.deliveryFee && <ErrorMessage>{formErrors.deliveryFee}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={`freeDeliveryCondition`}>
                        배송조건
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className={`inp_box`}>
                        <input
                          id={`freeDeliveryCondition`}
                          type="text"
                          data-input-type={'number, currency'}
                          value={formValues.freeDeliveryCondition || ''}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">원 이상 무료배송</em>
                        {formErrors.freeDeliveryCondition && <ErrorMessage>{formErrors.freeDeliveryCondition}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section className="btn_section">
              <button type="submit" id="btn-create" className="admin_btn confirm_l solid">
                설정저장
              </button>
            </section>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default DeliverySettingPage;
