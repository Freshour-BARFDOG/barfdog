import React, {useCallback, useState} from 'react';
import s from '/src/components/admin/settings/couponSettingInput.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import {AdminContentWrapper} from '/src/components/admin/AdminWrapper';
import AutoPublishedCouponSettingInput from '/src/components/admin/settings/AutoPublishedCouponSettingInput';
import GradeCouponSettingInput from '/src/components/admin/settings/GradeCouponSettingInput';
import {useModalContext} from '/store/modal-context';
import {getDataSSR, putObjData} from '/src/pages/api/reqData';
import {validate} from '/util/func/validation/validation_autoCoupon';
import {valid_hasFormErrors} from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import {eventCouponNames, gradeCouponNames} from '/store/TYPE/couponType';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import {sortByDate} from "/util/func/sorting";
import transformDate from "/util/func/transformDate";

function CouponSettingPage({ data }) {

  const items = {
    gradeCoupons: data.gradeCoupons,
    eventCoupons: data.eventCoupons,
  };
  const lastModifiedDate = data.lastModifiedDate;
  
  const initFormValues = [...items.gradeCoupons, ...items.eventCoupons];

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState(initFormValues);
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isSubmitted) return window.location.reload();

    const convertedFormValues = formValues.map((itemObj) => ({
      id: itemObj.id,
      discountDegree: transformClearLocalCurrency(itemObj.discountDegree),
      availableMinPrice: transformClearLocalCurrency(
        itemObj.availableMinPrice,
      ),
    }));

    const errObj = validate(convertedFormValues);
    setFormErrors(errObj);
    
    const errObjForValidation = errObj.map((err)=>({discountDegree: err.discountDegree, availableMinPrice: err. availableMinPrice}));
    
    const isPassed = valid_hasFormErrors(errObjForValidation);
    if (!isPassed) return mct.alertShow('유효하지 않은 항목이 있습니다.');
    
    if (!confirm('사이트 자동쿠폰 정책이 변경됩니다. 정말 변경하시겠습니까?')) return;

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const body = {
        updateAutoCouponRequestDtoList: convertedFormValues,
      };
      console.log('body: ', body);
      const apiUrl = `/api/admin/coupons/auto/modification`;
      const res = await putObjData(apiUrl, body);
      console.log(res);
      if (res.isDone) {
        mct.alertShow('사이트 설정이 성공적으로 저장되었습니다.', onGlobalModalCallback);
        setIsSubmitted(true);
      } else {
        mct.alertShow('데이터처리에 실패하였습니다.');
      }
    } catch (err) {
      mct.alertShow('API통신 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  },[formValues, isSubmitted]);


  const onGlobalModalCallback = () => {
    window.location.reload();
  };

  return (
    <>
      <MetaTitle title="쿠폰정책 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper id={s.main}>
          <div className="title_main">
            <h1 className={s['main-title']}>
              쿠폰정책 설정
              {isLoading.fetching ? <Spinner /> : <span className={s.date}>최종수정일: {lastModifiedDate}</span>}
            </h1>
          </div>
          <form action="/" method="post">
            <div className="cont">
              <div className="cont_body">
                <section className={s.section}>
                  <h2 className={s['title']}>자동발행 쿠폰</h2>
                  {items.eventCoupons.length > 0 &&
                    items.eventCoupons.map((cp, i) => (
                      <AutoPublishedCouponSettingInput
                        key={`${cp.name}${cp.id}`}
                        label={cp.name}
                        id={cp.id}
                        index={i}
                        innerId={['discountDegree']}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        formErrors={formErrors}
                      />
                    ))}
                </section>
                <section className={s.section}>
                  <h2 className={s['title']}>등급할인 쿠폰</h2>
                  {items.gradeCoupons.length > 0 &&
                    items.gradeCoupons.map((cp, i) => (
                      <GradeCouponSettingInput
                        key={`${cp.name}${cp.id}`}
                        label={cp.name}
                        id={cp.id}
                        index={i}
                        innerId={['discountDegree', 'availableMinPrice']}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        formErrors={formErrors}
                      />
                    ))}
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
      {hasAlert && <Modal_global_alert background />}
    </>
  );
}

export default CouponSettingPage;

export async function getServerSideProps({ req }) {
  let DATA = null;
  const apiUrl = '/api/admin/coupons/auto/modification';
  const res = await getDataSSR(req, apiUrl);
  if (res.data?._embedded) {
    const data = res.data._embedded.autoCouponsForUpdateDtoList;
    const gradeCoupons =data.filter(
      (obj) => gradeCouponNames.indexOf(obj.name.replace(/(\s*)/gi, '')) >= 0, // 띄어쓰기 삭제
    )
    const eventCoupons=  data.filter(
      (obj) => eventCouponNames.indexOf(obj.name.replace(/(\s*)/gi, '')) >= 0,
    )
    
    const lastModifiedDateOrigin = sortByDate(gradeCoupons.concat(eventCoupons).map((c) => c.modifiedDate ), 'desc')[0] || null;
    const lastModifiedDate = lastModifiedDateOrigin && transformDate(lastModifiedDateOrigin, 'time', {seperator: '-'});
    
    DATA = {
      gradeCoupons,
      eventCoupons,
      lastModifiedDate
    };
  }
  
  return {
    props: {
      data: DATA,
    },
  };
}
