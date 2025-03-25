import React, { useEffect, useMemo, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_limitedNumber from '/util/func/filter_limitedNumber';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Spinner from '/src/components/atoms/Spinner';
import { validate } from '/util/func/validation/validation_promotion';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { getDataSSR, postObjData } from '/src/pages/api/reqData';
import { useModalContext } from '/store/modal-context';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { promotionStatusType } from '/store/TYPE/promotionStatusType';
import { promotionType } from '/store/TYPE/promotionType';
import CustomSelect from '../../components/admin/form/CustomSelect';
import { emptyOption } from '/util/func/form/option/emtyOption';
import { DateTimeInput } from '../../components/admin/form/DateTimeInput';
import { filter_multipleSpaces } from '/util/func/filter_multipleSpaces';
import {
  filterObjectKeys,
  filterObjectValues,
} from '/util/func/filter/filterTypeFromObejct';

const initFormValues = {
  promotionType: promotionType.COUPON, // str
  name: '', // str
  startDate: '', // str
  expiredDate: '', // str
  couponId: null, // num
  quantity: '0', //
  status: promotionStatusType.ACTIVE,
};

export default function CreatePromotionPage({ DATA }) {
  const { availableCouponList } = DATA;
  const couponOptions = useMemo(() => {
    const options = availableCouponList?.map((data) => ({
      value: data.couponId,
      label: `[ 할인: ${data.discount} ] ${data.name}`,
    }));
    return [emptyOption, ...options];
  }, [DATA]);

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [form, setForm] = useState(initFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!availableCouponList.length)
      mct.alertShow(
        '프로모션을 생성하기 위한 쿠폰이 없습니다.\n쿠폰 생성 페이지에서 프로모션 쿠폰을 생성해주세요.',
      );
  }, [DATA]);

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

    if (id === 'quantity') {
      filteredValue = filter_limitedNumber(filteredValue);
    }

    setForm((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSubmit = async () => {
    if (submitted) return console.error('Already submitted!');

    const body = {
      promotionType: form.promotionType,
      name: filter_multipleSpaces(form.name),
      startDate: form.startDate,
      expiredDate: form.expiredDate,
      couponId: form.couponId,
      quantity: form.quantity,
      status: form.status,
    };

    const errObj = validate(body);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);

    if (!isPassed) return mct.alertShow('유효하지 않은 항목이 있습니다.');

    try {
      setSubmitted(true);
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const apiURL = '/api/admin/promotions';
      const res = await postObjData(apiURL, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow(
          '프로모션이 성공적으로 등록되었습니다.',
          onSuccessCallback,
        );
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
  const returnToListPage = () => {
    if (confirm('목록 페이지로 이동하시겠습니까?')) {
      window.location.href = '/promotion';
    }
  };

  const onSuccessCallback = () => {
    window.location.href = '/promotion';
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="프로모션 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>프로모션 생성</h1>
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
                        name="promotionType"
                        idList={filterObjectKeys(promotionType)}
                        labelList={filterObjectValues(promotionType.KOR)}
                      />
                      {formErrors.promotionType && (
                        <ErrorMessage>{formErrors.promotionType}</ErrorMessage>
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
                        id={'name'}
                        type="text"
                        name="create-promotinon"
                        className="fullWidth"
                        value={form.name}
                        placeholder={'프로모션 이름을 입력하세요.'}
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
                    <DateTimeInput
                      id={'startDate'}
                      form={form}
                      setForm={setForm}
                      setErrors={setFormErrors}
                    />
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
                    <DateTimeInput
                      id={'expiredDate'}
                      form={form}
                      setForm={setForm}
                      setErrors={setFormErrors}
                      defaultStringValueOfSeconds={'59'}
                    />
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
                      쿠폰선택
                    </label>
                    {isLoading.fetchingCouponList && <Spinner />}
                  </div>
                  <div className="inp_section">
                    <CustomSelect
                      id="couponId"
                      options={couponOptions}
                      style={{ width: '100%', maxWidth: '600px' }}
                      dataType={'number'}
                      value={form.couponId}
                      setFormValues={setForm}
                    />
                    {formErrors.couponId && (
                      <ErrorMessage>{formErrors.couponId}</ErrorMessage>
                    )}
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
              onClick={returnToListPage}
            >
              목록
            </button>
            <button
              type="button"
              id="btn-create"
              className="admin_btn confirm_l solid"
              onClick={onSubmit}
            >
              {isLoading.submit ? (
                <Spinner style={{ color: '#fff' }} />
              ) : (
                '생성'
              )}
            </button>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
}

export async function getServerSideProps({ req }) {
  let DATA = {
    availableCouponList: [],
  };

  const apiUrl = '/api/admin/coupons/publication/promotion';
  const res = await getDataSSR(req, apiUrl);
  console.log('getDataSSR>>>>>', res.data);
  if (res && res.status === 200 && res.data?._embedded) {
    const data = res.data._embedded.publicationCouponDtoList;
    DATA.availableCouponList = data.map((d) => ({
      couponId: d.couponId,
      discount: d.discount,
      name: d.name,
    }));
  }

  return {
    props: { DATA },
  };
}
