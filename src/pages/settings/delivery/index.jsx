import React, {useEffect, useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import filter_emptyValue from "/util/func/filter_emptyValue";
import filter_onlyNumber from "/util/func/filter_onlyNumber";
import filter_extraIntegerNumberZero from "/util/func/filter_extraIntegerNumberZero";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {useModalContext} from "/store/modal-context";
import {getData, putObjData} from "/src/pages/api/reqData";
import {validate} from "/util/func/validation/validation_siteSettings";
import {valid_hasFormErrors} from "/util/func/validation/validationPackage";
import Spinner from "/src/components/atoms/Spinner";
import transformDate from "/util/func/transformDate";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import transformClearLocalCurrency from "/util/func/transformClearLocalCurrency";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import Tooltip from "/src/components/atoms/Tooltip";
import s from "/src/components/admin/settings/adminSettings.module.scss";





function DeliverySettingPage() {
  const getFormValuesApiUrl = `/api/admin/setting`;
  const postFormValuesApiUrl = `/api/admin/setting`;
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [settingModifiedDate, setSettingModifiedDate] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // // console.log(formValues);
  
  
  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getFormValuesApiUrl);
        // console.log(res);
        const DATA = res.data;
        
        const initialFormValues = {
          activityVeryMuch: DATA.activityConstant.activityVeryMuch,
          activityMuch: DATA.activityConstant.activityMuch,
          activityNormal: DATA.activityConstant.activityNormal,
          activityLittle: DATA.activityConstant.activityLittle,
          activityVeryLittle: DATA.activityConstant.activityVeryLittle,
          // snackVeryMuch: DATA.snackConstant.snackVeryMuch, // ! API parameter 추가 필요함
          snackMuch: DATA.snackConstant.snackMuch,
          snackNormal: DATA.snackConstant.snackNormal,
          snackLittle: DATA.snackConstant.snackLittle,
          // snackVeryLittle: DATA.snackConstant.snackVeryLittle, // ! API parameter 추가 필요함
          price: transformLocalCurrency(DATA.deliveryConstant.price),
          freeCondition: transformLocalCurrency(DATA.deliveryConstant.freeCondition),
        };
        
        setFormValues(initialFormValues);
        const modifiedDate = transformDate(DATA.modifiedDate, 'time');
        setSettingModifiedDate(modifiedDate);
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);


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
      if (filteredType.indexOf('currency') >= 0) {
        filteredValue = transformLocalCurrency(filteredValue);
      }
  
      filteredValue = filter_extraIntegerNumberZero(filteredValue);
    }


    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue
    }));
  };



  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return window.location.reload();
    let convertedFormValues = {};
    for (const key in formValues) {
      const val = formValues[key];
      convertedFormValues = {
        ...convertedFormValues,
        [key]: key === 'freeCondition' || key === 'price' ? transformClearLocalCurrency(val) : val,
      }
    }
    const errObj = validate(convertedFormValues);
    setFormErrors(errObj);
    
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return mct.alertShow('유효하지 않은 항목이 있습니다.');
    
    if (!confirm('사이트 배송비 정책이 변경됩니다. 정말 변경하시겠습니까?')) return;
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      
      const res = await putObjData(postFormValuesApiUrl, convertedFormValues);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow('사이트 설정이 성공적으로 저장되었습니다.', onSuccessCallback);
        setIsSubmitted(true);
      } else {
        mct.alertShow('데이터 전송에 실패하였습니다.');
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
  
  
  const onSuccessCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="배송정책 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper id={s.main}>
          <div className="title_main">
            <h1 className={s['main-title']}>
              배송정책 설정<Tooltip message={`- 배송정책 수정일과 연동되어있습니다.`} wordBreaking={true} width={'300px'}/>
              {isLoading.fetching ? <Spinner /> : <span className={s.date}>최종수정일: {settingModifiedDate}</span>}
            </h1>
          </div>
          <form action="/" method="post">
            <div className="cont">
              <div className="cont_body">
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={`price`}>
                        기본 택배비
                        <Tooltip messagePosition={'center'} message={'모든 상품에 기본 적용되는 택배비용입니다.'}/>
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className={`inp_box`}>
                        <input
                          id={`price`}
                          className={'text-align-right'}
                          type="text"
                          data-input-type={'number, currency'}
                          value={formValues.price || ''}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">원</em>
                        {formErrors.price && <ErrorMessage>{formErrors.price}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={`freeCondition`}>
                        배송조건
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className={`inp_box`}>
                        <input
                          id={`freeCondition`}
                          className={'text-align-right'}
                          type="text"
                          data-input-type={'number, currency'}
                          value={formValues.freeCondition || ''}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">원 이상 무료배송</em>
                        {formErrors.freeCondition && <ErrorMessage>{formErrors.freeCondition}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
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
      {hasAlert && <Modal_global_alert onClick={onClickModalButton} background/>}
    </>
  );
}

export default DeliverySettingPage;
