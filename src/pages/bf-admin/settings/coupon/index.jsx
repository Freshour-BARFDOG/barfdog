import React, { useEffect, useState } from 'react';
import s from '../../../../components/admin/settings/couponSettingInput.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import AutoPublishedCouponSettingInput from '../../../../components/admin/settings/AutoPublishedCouponSettingInput';
import GradeCouponSettingInput from '../../../../components/admin/settings/GradeCouponSettingInput';
import { useModalContext } from '/store/modal-context';
import { getData, putObjData } from '/src/pages/api/reqData';
import transformDate from '/util/func/transformDate';
import {valid_isEmptyInCustom, validate} from '/util/func/validation/validation_autoCoupon';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import Tooltip from '/src/components/atoms/Tooltip';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import {autoPublishedCouponType} from "/store/TYPE/couponType";
import {global_gradeType} from "/store/TYPE/gradeType";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import transformClearLocalCurrency from "../../../../../util/func/transformClearLocalCurrency";




const autoCouponKey = 'updateAutoCouponRequestDtoList';
const queryCouponKey = 'autoCouponsForUpdateDtoList';



function CouponSettingPage() {
  const getFormValuesApiUrl = `/api/admin/coupons/auto/modification`;
  const putFormValuesApiUrl = `/api/admin/coupons/auto/modification`;
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getFormValuesApiUrl);
        console.log(res);
        const DATA = res?.data._embedded[queryCouponKey];
        console.log(DATA);
        let initialFormValues = []
        for (const dataKey in DATA) {
          const val = DATA[dataKey];
          const tempObj = {
            id: val.id,
            name: val.name,
            discountDegree: val.discountType === "FLAT_RATE" ? transformLocalCurrency(val.discountDegree) : val.discountDegree  ,
            availableMinPrice: val.discountType === "FLAT_RATE" ? transformLocalCurrency(val.availableMinPrice) : val.discountDegree  ,
          }
          initialFormValues = initialFormValues.concat(tempObj)
        }
        setFormValues(initialFormValues);
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return; // ! IMPORTANT : submit 이후 enterKey event로 trigger되는 중복submit 방지
    
    const convertedFormValues = formValues.map((itemObj)=>{
      const convertedObj = {
        id: itemObj.id,
        discountDegree:transformClearLocalCurrency(itemObj.discountDegree),
        availableMinPrice:transformClearLocalCurrency(itemObj.availableMinPrice)
      }
      return convertedObj;
    })

    const errObj = validate(convertedFormValues);
    console.log(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    setFormErrors(errObj);
    // const confirmMessage = '사이트 자동쿠폰 정책이 변경됩니다. 정말 변경하시겠습니까?';
    // if (!confirm(confirmMessage)) return;
    
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const finalFormValues = {
        [autoCouponKey]: convertedFormValues
      }
      // console.log('formValues: ', formValues);
      // console.log('convertedFormValues: ', convertedFormValues);
      // console.log('formErrors: ', formErrors);
      // console.log('isPassed: ', isPassed);
      if (isPassed) {
        const res = await putObjData(putFormValuesApiUrl, finalFormValues);
        console.log(res);
        if (res.isDone) {
          onShowModalHandler('사이트 설정이 성공적으로 저장되었습니다.');
          setIsSubmitted(true);
        } else {
          alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        alert('유효하지 않은 항목이 있습니다.');
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

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onGlobalModalCallback = () => {
    mct.alertHide();
    window.location.reload();
  };

  return (
    <>
      <MetaTitle title="쿠폰정책 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper id={s.main}>
          <div className={'title_main'}>
            <h1>
              쿠폰정책 설정
              {isLoading.fetching && <Spinner />}
            </h1>
          </div>
          <form action="/" method="post">
            <div className="cont">
              <div className="cont_body">
                <section className={s.section}>
                  <h2 className={s['title']}>자동발행 쿠폰</h2>
                  {formValues.map((coupon, index)=>{
                    const couponName = coupon.name.replace(/(\s*)/gi, "");
                    const categoryList = autoPublishedCouponType; // ['정기구독할인쿠폰', '반려견생일쿠폰', '견주생일쿠폰']
                    if(categoryList.indexOf(couponName) >= 0){
                      return <AutoPublishedCouponSettingInput
                        key={`${coupon.name}${coupon.id}`}
                        label={coupon.name}
                        id={coupon.id}
                        index={index}
                        innerId={['discountDegree']}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        formErrors={formErrors}
                      />
                    }
                  })}
                </section>
                <section className={s.section}>
                  <h2 className={s['title']}>등급할인 쿠폰</h2>
                  {formValues.map((coupon, index)=>{
                    const couponName = coupon.name.replace(/(\s*)/gi, "");
                    const categoryList = global_gradeType //  ['브론즈','실버','골드','플레티넘','다이아','더바프'] ;
                    if(categoryList.indexOf(couponName) >= 0){
                      return <GradeCouponSettingInput
                        key={`${coupon.name}${coupon.id}`}
                        label={coupon.name}
                        id={coupon.id}
                        index={index}
                        innerId={['discountDegree','availableMinPrice']}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        formErrors={formErrors}
                      />
                    }
                  })}
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
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default CouponSettingPage;
