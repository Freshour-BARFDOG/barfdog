import React, {useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import filter_emptyValue from "/util/func/filter_emptyValue";
import filter_onlyNumber from "/util/func/filter_onlyNumber";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {useModalContext} from "/store/modal-context";
import {getDataSSR, putObjData} from "/src/pages/api/reqData";
import {validate} from "/util/func/validation/validation_siteSettingPricePolicy";
import {valid_hasFormErrors} from "/util/func/validation/validationPackage";
import Spinner from "/src/components/atoms/Spinner";
import transformDate from "/util/func/transformDate";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import s from "/src/components/admin/settings/adminSettings.module.scss";
import {subscribePlanType} from "/store/TYPE/subscribePlanType";




function PricePolicyPage({data}) {
  
  const initFormValues = {
    [subscribePlanType.FULL.NAME] : data.full,
    [subscribePlanType.HALF.NAME] : data.half,
    [subscribePlanType.TOPPING.NAME] : data.topping,
  }
  
  const info = {
    ...initFormValues,
    createdDate: data.createdDate,
    modifiedDate: data.modifiedDate,
  }

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState(initFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);


  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      filteredValue = filter_onlyNumber(filteredValue);
    }


    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue
    }));
  };
  
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitted) return window.location.reload();

    const errObj = validate(formValues);
    setFormErrors(errObj);
    
    const isPassed = valid_hasFormErrors(errObj);
    if(!isPassed) return mct.alertShow('유효하지 않은 항목이 존재합니다.');
    
    if (!confirm(`사이트 할인율은 '최초 정기결제' 및 '예약된 구독상품 정보 변경' 시 반영됩니다. \n정말 변경하시겠습니까?`)) return;
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
        const body = {
          full: parseFloat(formValues[subscribePlanType.FULL.NAME]),
          half:parseFloat(formValues[subscribePlanType.HALF.NAME]),
          topping: parseFloat(formValues[subscribePlanType.TOPPING.NAME]),
        };
        // // console.log(body);
        const apiUrl = '/api/admin/planDiscount';
        const res = await putObjData(apiUrl, body);
        
        // console.log(res);
        if (res.isDone) {
          setSubmitted(true);
          mct.alertShow('성공적으로 할인율이 재설정되었습니다.', onSuccessCallback);
        } else {
          mct.alertShow(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        }
      
    } catch (err) {
      mct.alertShow('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
    
  };
  
  const onSuccessCallback = ()=>{
    window.location.reload();
  }
  
  const onClickModalButton = () => {
    mct.alertHide();
  };
  

  return (
    <>
      <MetaTitle title="플랜 할인율 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper id={s.main}>
          <div className="title_main">
            <h1 className={s['main-title']}>
              <span>가격 정책
                {isLoading.fetching && <Spinner />}</span>
              <span className={s.date}>최종수정일: {info.modifiedDate}</span>
            </h1>
          </div>
          <form action="/" method="post">
            <div className="cont">
              <div className="cont_body">
                <h2 className={`${s['title']} ${s['has-notice']}`}>
                  플랜 할인율
                  <span className={s.notice}>
                    1) 플랜 할인율 적용 시점: &lsquo;최초 정기결제&rsquo;, &lsquo;예약된 구독상품의 플랜&middot;레시피&middot;한 팩 무게 변경&rsquo;<br/>
                    2) 플랜 할인율 변경 시, 구독 중인 구독상품의 결제원금은 변경되지 않으며, 위 시점(1)에 따릅니다.
                  </span>
                </h2>
               
                
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={`price`}>
                        {subscribePlanType.FULL.KOR}
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className={`inp_box`}>
                        <input
                          id={subscribePlanType.FULL.NAME}
                          className={'text-align-right'}
                          type="text"
                          data-input-type={'number'}
                          value={formValues[subscribePlanType.FULL.NAME] || 0}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">%</em>
                        {formErrors[subscribePlanType.FULL.NAME] && <ErrorMessage>{formErrors[subscribePlanType.FULL.NAME]}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={`price`}>
                        {subscribePlanType.HALF.KOR}
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className={`inp_box`}>
                        <input
                          id={subscribePlanType.HALF.NAME}
                          className={'text-align-right'}
                          type="text"
                          data-input-type={'number'}
                          value={formValues[subscribePlanType.HALF.NAME] || 0}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">%</em>
                        {formErrors[subscribePlanType.HALF.NAME] && <ErrorMessage>{formErrors[subscribePlanType.HALF.NAME]}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={`price`}>
                        {subscribePlanType.TOPPING.KOR}
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className={`inp_box`}>
                        <input
                          id={subscribePlanType.TOPPING.NAME}
                          className={'text-align-right'}
                          type="text"
                          data-input-type={'number'}
                          value={formValues[subscribePlanType.TOPPING.NAME] || 0}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">%</em>
                        {formErrors[subscribePlanType.TOPPING.NAME] && <ErrorMessage>{formErrors[subscribePlanType.TOPPING.NAME]}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
              </div>
            </div>
            <section className="btn_section">
              <button type="button" id="btn-create" className="admin_btn confirm_l solid" onClick={onSubmit}>
                {isLoading.submit ? <Spinner style={{color:'#fff'}}/> : '설정 저장'}
              </button>
            </section>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert onClick={onClickModalButton} background />}
    </>
  );
}

export default PricePolicyPage;


export async function getServerSideProps ({ req }) {
  let DATA = null;
  const apiUrl = '/api/planDiscount';
  const res = await getDataSSR(req, apiUrl);
  
  if(res.data){
    const data = res.data._embedded.planDiscountResponseDtoList[0];
    // // console.log(data)
    DATA = {
      full: data.full,
      half: data.half,
      topping: data.topping,
      createdDate: transformDate(data.createdDate,'time'),
      modifiedDate: transformDate(data.modifiedDate,'time'),
    }
  }

  return {
    props: {data: DATA}
  }
}
