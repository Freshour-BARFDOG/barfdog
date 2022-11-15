import React, { useEffect, useState } from 'react';
import s from '/src/components/admin/settings/couponSettingInput.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import AutoPublishedCouponSettingInput from '/src/components/admin/settings/AutoPublishedCouponSettingInput';
import GradeCouponSettingInput from '/src/components/admin/settings/GradeCouponSettingInput';
import { useModalContext } from '/store/modal-context';
import { getData, getDataSSR, putObjData } from '/src/pages/api/reqData';
import { validate } from '/util/func/validation/validation_autoCoupon';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { eventCouponNames, gradeCouponNames } from '/store/TYPE/couponType';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';

function CouponSettingPage({ data }) {
  // console.log(data);

  const items = {
    gradeCoupons: data.gradeCoupons,
    eventCoupons: data.eventCoupons,
  };

  const initFormValues = [...items.gradeCoupons, ...items.eventCoupons];

  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState(initFormValues);
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // console.log(formValues);

  useEffect(() => {
    // (async () => {
    //   try {
    //     setIsLoading((prevState) => ({
    //       ...prevState,
    //       fetching: true,
    //     }));
    //     const apiUrl = `/api/admin/coupons/auto/modification`;
    //     const res = await getData(apiUrl);
    //     console.log(res);
    //     const DATA = res?.data._embedded['autoCouponsForUpdateDtoList'];
    //     console.log(DATA);
    //     let initialFormValues = []
    //     for (const dataKey in DATA) {
    //       const val = DATA[dataKey];
    //       const tempObj = {
    //         id: val.id,
    //         name: val.name,
    //         discountDegree: val.discountType === "FLAT_RATE" ? transformLocalCurrency(val.discountDegree) : val.discountDegree  ,
    //         availableMinPrice: val.discountType === "FLAT_RATE" ? transformLocalCurrency(val.availableMinPrice) : val.discountDegree  ,
    //       }
    //       initialFormValues = initialFormValues.concat(tempObj);
    //       console.log(initialFormValues)
    //     }
    //     setFormValues(initialFormValues);
    //   } catch (err) {
    //     console.error(err);
    //   }
    //   setIsLoading((prevState) => ({
    //     ...prevState,
    //     fetching: false,
    //   }));
    // })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return; // ! IMPORTANT : submit 이후 enterKey event로 trigger되는 중복submit 방지

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
    if (!isPassed) return alert('유효하지 않은 항목이 있습니다.');

    const confirmMessage =
      '사이트 자동쿠폰 정책이 변경됩니다. 정말 변경하시겠습니까?';
    if (!confirm(confirmMessage)) return;

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
        onShowModalHandler('사이트 설정이 성공적으로 저장되었습니다.');
        setIsSubmitted(true);
      } else {
        alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        window.location.reload();
      }
    } catch (err) {
      alert('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
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
          <div className="title_main">
            <h1 className={s['main-title']}>
              <span>
                쿠폰정책 설정
                {isLoading.fetching && <Spinner />}
              </span>
              {/*<span className={s.date}>최종수정일: {info?.createdDate}</span>*/}
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
                {isLoading.submit ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '설정 저장'
                )}
              </button>
            </section>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert
        message={modalMessage}
        onClick={onGlobalModalCallback}
        background
      />
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
    console.log(data);
    DATA = {
      gradeCoupons: data.filter(
        (obj) => gradeCouponNames.indexOf(obj.name.replace(/(\s*)/gi, '')) >= 0,
      ),
      eventCoupons: data.filter(
        (obj) => eventCouponNames.indexOf(obj.name.replace(/(\s*)/gi, '')) >= 0,
      ),
    };
  }

  return {
    props: {
      data: DATA,
    },
  };
}
