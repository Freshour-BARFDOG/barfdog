import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import CustomSelectForTwoSelects from '/src/components/admin/form/CustomSelectForTwoSelects';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import SearchGroupForm from '/src/components/admin/form/SearchGroupForm';
import SearchPersonalForm from '/src/components/admin/form/SearchPersonalForm';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Spinner from '/src/components/atoms/Spinner';
import CustomRadioTrueOrFalse from '/src/components/admin/form/CustomRadioTrueOrFalse';
import { useRouter } from 'next/router';
import { useModalContext } from '/store/modal-context';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { validate } from '/util/func/validation/validation_releaseCoupon';
import { valid_expireDate, valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { getData, postObjData } from '/api/reqData';
import { global_couponType } from '/store/TYPE/couponType';
import CustomSelect from '/src/components/admin/form/CustomSelect';

const initialFormValues = {
  ALL: {
    expiredDate: '', // 발행할 쿠폰의 만료 기간 설정 'yyyy-MM-dd' String 타입
    couponId: undefined, // number
    alimTalk: false,
    couponType: global_couponType.CODE_PUBLISHED, // string // 어드민에서 생성가능한 쿠폰타입은 AUTO
  },
  PERSONAL: {
    expiredDate: '',
    couponId: undefined,
    alimTalk: false,
    couponType: global_couponType.CODE_PUBLISHED,
    memberIdList: [],
  },
  GROUP: {
    expiredDate: '',
    couponId: undefined,
    alimTalk: false,
    couponType: global_couponType.CODE_PUBLISHED,
    subscribe: false,
    longUnconnected: false,
    gradeList: [],
    area: 'ALL',
    birthYearFrom: '',
    birthYearTo: '',
  },
};

function ReleaseCouponPage() {
  const getCouponList = '/api/admin/coupons/publication/code';
  const postFormValuesApiUrlToAll = `/api/admin/coupons/all`;
  const postFormValuesApiUrlToGroup = `/api/admin/coupons/group`;
  const postFormValuesApiUrlToPersonal = `/api/admin/coupons/personal`;

  const router = useRouter();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [target, setTarget] = useState('ALL');
  const [formValues, setFormValues] = useState(initialFormValues['ALL']);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [couponOptions, setCouponOptions] = useState([]);

  useEffect(() => {
    const selectedFormValues = initialFormValues[target];
    setFormValues(selectedFormValues);
  }, [target]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetchingCouponList: true,
        }));
        const res = await getData(getCouponList);
        console.log(res);
        const DATA = res.data._embedded.publicationCouponDtoList;
        const newCouponOptions = DATA.map((data) => ({
          value: data.couponId,
          label: `[ 할인: ${data.discount} ] ${data.name}`,
        }));

        const emptyOptions = [
          {
            value: '',
            label: '선택',
          },
        ];
        emptyOptions.concat(newCouponOptions);

        setCouponOptions(emptyOptions.concat(newCouponOptions));
      } catch (err) {
        console.error(err);
        alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetchingCouponList: false,
      }));
    })();
  }, []);

  const onInputChangeHandler = (event) => {
    const input = event.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
      if (filteredType && filteredType.indexOf('currency') >= 0) {
        filteredValue = transformLocalCurrency(filteredValue);
      }
    }
    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(formValues);
    const filteredFormValues = {
      ...formValues,
      couponId: Number(formValues.couponId),
    };
    console.log(filteredFormValues);
    const errObj = validate(filteredFormValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) {
      return alert('유효하지 않은 항목이 있습니다.');
    } else if (isSubmitted) {
      // ! IMPORTANT : submit 이후 enterKey event로 trigger되는 중복submit 방지
      alert('이미 제출된 양식입니다.');
      router.back();
      return;
    }
    const expiredDate = valid_expireDate(filteredFormValues.expiredDate).expiredDate;
    const confirmMessage = `* 쿠폰을 정말 발행하시겠습니까?\n- 유효기간: ~${filteredFormValues.expiredDate}까지\n- 남은일수: ${expiredDate}일\n- 발급대상:${target}`;
    if (!confirm(confirmMessage)) return;

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      let postFormValuesApiUrl;
      if (target === 'ALL') {
        postFormValuesApiUrl = postFormValuesApiUrlToAll;
      } else if (target === 'GROUP') {
        postFormValuesApiUrl = postFormValuesApiUrlToGroup;
      } else if (target === 'PERSONAL') {
        postFormValuesApiUrl = postFormValuesApiUrlToPersonal;
      }

      const res = await postObjData(postFormValuesApiUrl, filteredFormValues);
      console.log(res);
      if (res.isDone) {
        onShowModalHandler('쿠폰이 성공적으로 발행되었습니다.');
        setIsSubmitted(true);
      } else {
        alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
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

  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onGlobalModalCallback = () => {
    mct.alertHide();
    router.push('/bf-admin/coupon/search');
  };

  return (
    <>
      <MetaTitle title="쿠폰 발행" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>쿠폰 발행</h1>
          </div>
          <div className="cont withMultipleBackgound">
            <div className="cont_body">
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      발행대상
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <CustomRadio
                        setValue={setTarget}
                        name="target"
                        idList={['ALL', 'GROUP', 'PERSONAL']}
                        labelList={['전체', '그룹', '개인']}
                        getDirValue={true}
                      />

                      {formErrors.target && <ErrorMessage>{formErrors.target}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              </div>
              {target === 'GROUP' && (
                <SearchGroupForm
                  id={'gradeList'}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formErrors={formErrors}
                />
              )}
              {target === 'PERSONAL' && (
                <SearchPersonalForm
                  id={'memberIdList'}
                  setFormValues={setFormValues}
                  formErrors={formErrors}
                />
              )}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="expiredDate">
                      유효기간
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input id={'expiredDate'} type="date" onChange={onInputChangeHandler} />
                      <span>일</span>
                      {formErrors.expiredDate && (
                        <ErrorMessage>{formErrors.expiredDate}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="cont_divider">
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
                      value={formValues.couponId}
                      setFormValues={setFormValues}
                    />
                    {formErrors.couponId && <ErrorMessage>{formErrors.couponId}</ErrorMessage>}
                  </div>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      알림톡 발송
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <CustomRadioTrueOrFalse
                        name="alimTalk"
                        value={formValues.alimTalk}
                        setValue={setFormValues}
                        labelList={['Y', 'N']}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btn_section outer">
            <button
              type="button"
              id="btn-cancle"
              className="admin_btn confirm_l line"
              onClick={returnToPrevPage}
            >
              취소
            </button>
            <button
              type="button"
              id="release-coupon"
              className="admin_btn confirm_l solid"
              onClick={onSubmit}
            >
              {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '쿠폰 발행'}
            </button>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default ReleaseCouponPage;
