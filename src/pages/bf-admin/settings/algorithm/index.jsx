import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import s from '/src/components/admin/settings/adminSettings.module.scss';
import AlgorithmInput from '/src/components/admin/settings/AlgorithmInput';
import { useModalContext } from '/store/modal-context';
import { validate } from '/util/func/validation/validation_siteSettings';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { getData, putObjData } from '/src/pages/api/reqData';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Spinner from '/src/components/atoms/Spinner';
import Tooltip from '/src/components/atoms/Tooltip';
import transformDate from "/util/func/transformDate";



export default function AlgorithmSettingPage() {
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [settingModifiedDate, setSettingModifiedDate] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  
  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const apiUrl = `/api/admin/setting`;
        const res = await getData(apiUrl, 'admin');
        // console.log(res);
        const DATA = res.data;
        

        const initialFormValues = {
          activityVeryMuch: DATA.activityConstant.activityVeryMuch,
          activityMuch: DATA.activityConstant.activityMuch,
          activityNormal: DATA.activityConstant.activityNormal,
          activityLittle: DATA.activityConstant.activityLittle,
          activityVeryLittle: DATA.activityConstant.activityVeryLittle,
          snackMuch: DATA.snackConstant.snackMuch,
          snackNormal: DATA.snackConstant.snackNormal,
          snackLittle: DATA.snackConstant.snackLittle,
          price: DATA.deliveryConstant.price,
          freeCondition: DATA.deliveryConstant.freeCondition,
        };
        setFormValues(initialFormValues);
        const modifiedDate = transformDate(DATA.modifiedDate, 'time');
        setSettingModifiedDate(modifiedDate);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: false,
        }));
      }
      
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return window.location.reload();
    let convertedFormValues = {};
    for (const key in formValues) {
      const val = formValues[key];
      convertedFormValues = {
        ...convertedFormValues,
        [key]:Number(val)
      }
    }
    // // console.log('formValues: ',formValues);
    // // console.log('convertedFormValues: ',convertedFormValues);
    const errObj = validate(convertedFormValues);
    setFormErrors(errObj);

    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return mct.alertShow('유효하지 않은 항목이 있습니다.');
    
    if (!confirm('사이트 알고리즘 정책이 변경됩니다. 정말 변경하시겠습니까?')) return;

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const apiUrl = `/api/admin/setting`;
      const res = await putObjData(apiUrl, convertedFormValues);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow('사이트 설정이 성공적으로 저장되었습니다.', onGlobalModalCallback);
        setIsSubmitted(true);
      } else {
        mct.alertShow('데이터 전송에 실패하였습니다.');
      }
      
    } catch (err) {
      mct.alertShow('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };


  const onGlobalModalCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="알고리즘 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper id={s.main}>
          <div className="title_main">
            <h1 className={s['main-title']}>
              알고리즘 설정<Tooltip message={`- 배송정책 수정일과 연동되어있습니다.`} wordBreaking={true} width={'300px'}/>
              {isLoading.fetching ? <Spinner /> : <span className={s.date}>최종수정일: {settingModifiedDate}</span>}
            </h1>
          </div>
          <form action="/" method="post">
            <div className="cont">
              <div className="cont_body">
                <section className={s.section}>
                  <h2 className={s['title']}>
                    활동량 상수
                    <Tooltip message={`소수점 이하 2자리까지 사용가능합니다.`} wordBreaking={true} width={'300px'} messagePosition={'left'}/>
                  </h2>
                  <AlgorithmInput
                    id={'activityVeryMuch'}
                    label={'매우 많아요'}
                    numberUnit={'+'}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <AlgorithmInput
                    id={'activityMuch'}
                    label={'많아요'}
                    numberUnit={'+'}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <AlgorithmInput
                    id={'activityNormal'}
                    label={'보통'}
                    numberUnit={''}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <AlgorithmInput
                    id={'activityLittle'}
                    label={'적어요'}
                    numberUnit={'-'}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <AlgorithmInput
                    id={'activityVeryLittle'}
                    label={'매우 적어요'}
                    numberUnit={'-'}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                </section>
                <section>
                  <h2 className={s['title']}>간식량 상수
                    <Tooltip message={`소수점 이하 2자리까지 사용가능합니다.`} wordBreaking={true} width={'300px'} messagePosition={'left'}/></h2>
                  <AlgorithmInput
                    id={'snackMuch'}
                    label={'많아요'}
                    numberUnit={'+'}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <AlgorithmInput
                    id={'snackNormal'}
                    label={'보통'}
                    numberUnit={''}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <AlgorithmInput
                    id={'snackLittle'}
                    label={'적어요'}
                    numberUnit={'-'}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                </section>
              </div>
            </div>
            <section className="btn_section">
              <button
                type="button"
                id="btn-create"
                className="admin_btn confirm_l solid"
                onClick={onSubmit}
              >
                {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '설정 저장'}
              </button>
            </section>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert onClick={onClickModalButton} background/>}
    </>
  );
}
