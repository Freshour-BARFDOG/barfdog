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
import {postObjData} from "/src/pages/api/reqData";
import {useModalContext} from "/store/modal-context";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {promotionStatusType} from "/store/TYPE/promotionStatusType";
import {promotionType} from "/store/TYPE/promotionType";
import CustomSelect from "../../../../components/admin/form/CustomSelect";
import {DateTimeInput} from "../../../../components/admin/form/DateTimeInput";
import {filter_multipleSpaces} from "/util/func/filter_multipleSpaces";



export default function UpdatePromotionPage({DATA}) {

  const publishedCount = DATA.type === promotionType.COUPON ? DATA.publishedCount : null;
  const initFormValues = useMemo(() => ({
    type: DATA.type, // str
    name: DATA.name,
    startDate: DATA.startDate,
    expiredDate: DATA.expiredDate,
    couponId: DATA.coupon.couponId,
    remaining: DATA.remaining,
    status: DATA.status,
  }), [DATA]);

  const couponOptions = useMemo(() => {
    const coupon = DATA.coupon;
    return [{
      value: coupon.couponId,
      label:`[ 할인: ${coupon.discount} ] ${coupon.name}`,
    }];
  }, [DATA]);

  const mct = useModalContext();
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

    if (id === 'remaining') {
      filteredValue = filter_limitedNumber(filteredValue);
    }

    setForm((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSubmit = async () => {
    if (submitted) return console.error("Already submitted!");

    const body = {
      type: form.type,
      name: filter_multipleSpaces(form.name),
      startDate: form.startDate,
      expiredDate: form.expiredDate,
      couponId: form.couponId,
      remaining: form.remaining,
      status: form.status,
    }
    console.log("body: ",body);

    const errObj = validate(body, "update", {limitedAmount: publishedCount});
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);

    if (!isPassed) return mct.alertShow('유효하지 않은 항목이 있습니다.');

    try {
      setSubmitted(true);
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const apiURL = '/api/admin/promotion';
      const res = await postObjData(apiURL, body);
      console.log(res);
      if (res.isDone) {
        mct.alertShow('프로모션이 성공적으로 등록되었습니다.', onSuccessCallback);
      } else {
        mct.alertShow(`Error: ${res.error}`);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setSubmitted(false);
      mct.alertShow('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };
  const returnToPrevPage = () => {
    if (confirm('생성을 중단하고 이전 페이지로 이동하시겠습니까?')) {
      router.back();
    }
  };

  const onSuccessCallback = () => {
    window.location.herf = '/bf-admin/promotion/search';
  };


  return (
      <>
        <MetaTitle title="프로모션 생성" admin={true}/>
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
                            idList={Object.keys(promotionType).filter(type => type !== "KOR")}
                            labelList={Object.values(promotionType.KOR)}
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
                      <label className="title" htmlFor="remaining">
                        한정수량
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'remaining'}
                          className={'text-align-right'}
                          data-input-type={'number, currency'}
                          value={form.remaining || '0'}
                          type="text"
                          name="create-promotion"
                          disabled={false}
                          onChange={onInputChangeHandler}
                        />
                        <span>개</span>
                        <span>발행됨 <b className={'pointColor'}>{publishedCount}</b>개</span>
                        {formErrors.remaining && (
                          <ErrorMessage>{formErrors.remaining}</ErrorMessage>
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
                            idList={Object.keys(promotionStatusType).filter(type => type !== "KOR")}
                            labelList={Object.values(promotionStatusType.KOR)}
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
                {isLoading.submit ? <Spinner style={{color: '#fff'}}/> : '생성'}
              </button>
            </div>
          </AdminContentWrapper>
        </AdminLayout>
        <Modal_global_alert background/>
      </>
  );
}


export async function getServerSideProps({req, query}) {

  const { id } = query;

  let DATA = null;


  const apiUrl = `/api/admin/promotion/${id}`;
  // const res = await getDataSSR(req, apiUrl); // PROD



  const res = DUMMY_RES // TEST


  console.log(res);

  if (res && res.status === 200 && res.data) {
    DATA = res.data;

    // 작업 필요.

  } else {
    return {
      redirect: {
        destination: "/bf-admin/promotion",
        permanent: false
      }
    }
  }

  return {
    props: {id, DATA}
  };
}


const DUMMY_RES = {
  data: {
    type: promotionType.COUPON, // str
    name: 'test프로모션', // str
    startDate: "2023-05-01 00:00", // str
    expiredDate: "2023-05-31 00:00", // str
    remaining: 500, //
    publishedCount: 3,
    status: promotionStatusType.ACTIVE,
    coupon: {
      couponId: 1,
      discount: "10%",
      name: "DUMMY COUPON"
    },
  },
  status: 200
}
