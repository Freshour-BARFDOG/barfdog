import React, {useMemo, useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import {AdminContentWrapper} from '/src/components/admin/AdminWrapper';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import {useRouter} from 'next/router';
import filter_limitedNumber from '/util/func/filter_limitedNumber';
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import Spinner from "/src/components/atoms/Spinner";
import {validate} from "/util/func/validation/validation_promotion";
import {valid_hasFormErrors} from "/util/func/validation/validationPackage";
import {getDataSSR, putObjData} from "/src/pages/api/reqData";
import {useModalContext} from "/store/modal-context";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {promotionStatusType} from "/store/TYPE/promotionStatusType";
import {promotionType} from "/store/TYPE/promotionType";
import CustomSelect from "../../../../components/admin/form/CustomSelect";
import {DateTimeInput} from "../../../../components/admin/form/DateTimeInput";
import {filter_multipleSpaces} from "/util/func/filter_multipleSpaces";
import {filterObjectKeys, filterObjectValues} from "/util/func/filter/filterTypeFromObejct";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import {discountUnitType} from "/store/TYPE/discountUnitType";
import {filterDateTimeSeperator} from "../../../../../util/func/filter_dateAndTime";


export default function UpdatePromotionPage({DATA}) {

  const publishedCount = DATA.promotionType === promotionType.COUPON ? DATA.quantity - DATA.remaining : null;
  const initFormValues = useMemo(() => ({
    promotionType: DATA.promotionType, // str
    name: DATA.name,
    startDate: DATA.startDate,
    expiredDate: DATA.expiredDate,
    quantity: DATA.quantity,
    remaining: DATA.remaining,
    status: DATA.status,
    couponId: DATA.coupon.couponId,
  }), [DATA]);

  const couponOptions = useMemo(() => {
    const coupon = DATA.coupon;
    return [{
      value: coupon.couponId,
      label:`[ 할인: ${transformLocalCurrency(coupon.discountDegree)}${discountUnitType.KOR[coupon.discountType]} ] ${coupon.couponName}`,
    }];
  }, [DATA]);

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState({});
  const [form, setForm] = useState(initFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const {id, value} = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;


    if (filteredType) {
      filteredValue = filter_emptyValue(value);
    }

    if (filteredType && filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }

    if (id === 'quantity') {
      filteredValue = filter_limitedNumber(filteredValue);
    }

    setForm((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSubmit = async () => {
    if (submitted) return console.error("Already submitted!");

    const originData = {
      limitedAmount: publishedCount, // 잔여수량
      beforeStartDate: initFormValues.startDate,
      beforeExpiredDate: initFormValues.expiredDate,
    }

    const body = {
      promotionType: form.promotionType,
      name: filter_multipleSpaces(form.name),
      startDate: form.startDate,
      expiredDate: form.expiredDate,
      couponId: form.couponId,
      quantity: form.quantity,
      status: form.status,
    }
    // console.log("body: ",body);

    const errObj = validate(body, "update", originData);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);

    if (!isPassed) return mct.alertShow('유효하지 않은 항목이 있습니다.');

    try {
      setSubmitted(true);
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const apiURL = `/api/admin/promotions/${DATA.promotionId}/update`;
      const res = await putObjData(apiURL, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow('프로모션이 수정되었습니다.', onSuccessCallback);
      } else {
        mct.alertShow(`Error: ${res.error}`);
        setSubmitted(false);
      }
    } catch (err) {
      console.error(err);
      setSubmitted(false);
      mct.alertShow('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }

  };
  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 이동하시겠습니까?')) {
      router.back();
    }
  };

  const onSuccessCallback = () => {
    window.location.href = '/bf-admin/promotion';
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
      <>
        <MetaTitle title="프로모션 수정" admin={true}/>
        <AdminLayout>
          <AdminContentWrapper>
            <div className="title_main">
              <h1>프로모션 수정</h1>
            </div>
            <div className="cont">
              <div className="cont_body">
                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title">프로모션 타입</label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                            setValue={setForm}
                            name="type"
                            idList={filterObjectKeys(promotionType)}
                            labelList={filterObjectValues(promotionType.KOR)}
                        />
                        {formErrors.type && (
                            <ErrorMessage>{formErrors.type}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
                {/* cont_divider */}
                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="name">
                        프로모션 이름
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                            id={"name"}
                            type="text"
                            name="create-promotinon"
                            className="fullWidth"
                            value={form.name}
                            placeholder={"프로모션 이름을 입력하세요."}
                            onChange={onInputChangeHandler}
                        />
                        {formErrors.name && (
                            <ErrorMessage>{formErrors.name}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
                {/* cont_divider */}

                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="startDate">
                        시작일시
                      </label>
                    </div>
                    <div className="inp_section">
                      <DateTimeInput id={"startDate"} form={form} setForm={setForm} setErrors={setFormErrors}/>
                      {formErrors.startDate && (
                          <ErrorMessage>{formErrors.startDate}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </section>
                {/* cont_divider */}

                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="startDate">
                        종료일시
                      </label>
                    </div>
                    <div className="inp_section">
                      <DateTimeInput id={"expiredDate"} form={form} setForm={setForm} setErrors={setFormErrors}
                                     defaultStringValueOfSeconds={"59"}/>
                      {formErrors.expiredDate && (
                          <ErrorMessage>{formErrors.expiredDate}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </section>
                {/* cont_divider */}


                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="couponId">
                        적용된 쿠폰
                      </label>
                      {isLoading.fetchingCouponList && <Spinner/>}
                    </div>
                    <div className="inp_section">
                      <CustomSelect
                          id="couponId"
                          options={couponOptions}
                          style={{width: '100%', maxWidth: '600px'}}
                          dataType={"number"}
                          value={form.couponId}
                          setFormValues={setForm}
                          disabled={true}
                      />
                    </div>
                  </div>
                </section>
                {/* cont_divider */}
                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="quantity">
                        수량
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'quantity'}
                          className={'text-align-right'}
                          data-input-type={'number, currency'}
                          value={form.quantity || '0'}
                          type="text"
                          name="create-promotion"
                          disabled={false}
                          onChange={onInputChangeHandler}
                        />
                        <span>개</span>
                        <span>발행됨 <b className={'pointColor'}>{publishedCount}</b>개</span>
                        <span>잔여수량 <b className={'pointColor'}>{initFormValues.remaining}</b>개</span>
                        {formErrors.quantity && (
                          <ErrorMessage>{formErrors.quantity}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
                {/* cont_divider */}
                <section className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title">상태</label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                            value={form.status}
                            setValue={setForm}
                            name="status"
                            idList={filterObjectKeys(promotionStatusType)}
                            labelList={filterObjectValues(promotionStatusType.KOR)}
                        />
                        {formErrors.status && (
                            <ErrorMessage>{formErrors.status}</ErrorMessage>
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
                목록
              </button>
              <button
                  type="button"
                  id="btn-create"
                  className="admin_btn confirm_l solid"
                  onClick={onSubmit}
              >
                {isLoading.submit ? <Spinner style={{color: '#fff'}}/> : '수정'}
              </button>
            </div>
          </AdminContentWrapper>
        </AdminLayout>
        {hasAlert && <Modal_global_alert onClick={onClickModalButton} background/>}
      </>
  );
}


export async function getServerSideProps({req, query}) {

  const { id } = query;

  let DATA = null;

  const apiUrl = `/api/admin/promotions/${id}`;
  const res = await getDataSSR(req, apiUrl); // PROD
  // console.log(res.data);
  if (res && res.status === 200 && res.data) {
    const data = res.data;
    DATA = {
      promotionId: data.promotionId,
      promotionType: data.promotionType,
      name: data.name,
      startDate: filterDateTimeSeperator(data.startDate, "T",  " "),
      expiredDate: filterDateTimeSeperator(data.expiredDate, "T",  " "),
      quantity: data.quantity,
      remaining: data.remaining,
      status: data.status,
      coupon: {
        couponId: data.couponId,
        discountDegree: data.discountDegree,
        discountType: data.discountType,
        couponName: data.couponName
      },
    }

    if (data.deleted) {
      return {
        redirect: {
          permenant: false,
          destination: "/bf-admin/promotion"
        }
      }
    }
  }

  return {
    props: {id, DATA}
  };
}
