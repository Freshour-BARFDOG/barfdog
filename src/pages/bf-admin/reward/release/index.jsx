import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import SearchGroupForm from '/src/components/admin/form/SearchGroupForm';
import SearchPersonalForm from '/src/components/admin/form/SearchPersonalForm';
import { useRouter } from 'next/router';
import { useModalContext } from '/store/modal-context';
import { validate } from '/util/func/validation/validation_reward';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { postObjData } from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import CustomRadioTrueOrFalse from '/src/components/admin/form/CustomRadioTrueOrFalse';
import transformClearLocalCurrency from "/util/func/transformClearLocalCurrency";


const initialFormValues = {
  PERSONAL: {
    name: '', // str
    amount: 0, // num
    memberIdList: [], // arr
    alimTalk: false, //bool
  },
  GROUP: {
    name: '', // string
    amount: 0, // number
    subscribe: false,
    longUnconnected: false,
    gradeList: [], //  array: [BRONZE, SILVER, GOLD, PLATINUM, DIAMOND, BARF]
    area: 'ALL', // array: [ALL, METRO, NON_METRO]
    birthYearFrom: '', // string:  yyyy
    birthYearTo: '', // string: yyyy
    alimTalk: false,
  },
};

function ReleaseRewardPage() {

  const postFormValuesApiUrlToGroup = `/api/admin/rewards/group`;
  const postFormValuesApiUrlToPersonal = `/api/admin/rewards/personal`;

  const router = useRouter();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [target, setTarget] = useState('GROUP');
  const [formValues, setFormValues] = useState(initialFormValues['GROUP']);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormValues(initialFormValues[target]);
    setFormErrors({}); // 초기화
  }, [target]);

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
    const errObj = validate(formValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) {
      return alert('유효하지 않은 항목이 있습니다.');
    } else if(isSubmitted){      // ! IMPORTANT : submit 이후 enterKey event로 trigger되는 중복submit 방지
      alert('이미 제출된 양식입니다.');
      router.back();
      return
    }
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const postFormValuesApiUrl = target === 'GROUP' ? postFormValuesApiUrlToGroup : postFormValuesApiUrlToPersonal;
      const filteredFormValues = {
        ...formValues,
        amount: transformClearLocalCurrency(formValues.amount),
      };
  

      // console.log(postFormValuesApiUrl)
      // console.log(filteredFormValues)
      
      const res = await postObjData(postFormValuesApiUrl, filteredFormValues);
      // console.log(res);
      if (res.isDone) {
        onShowModalHandler('적립금이 성공적으로 발행되었습니다.');
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

  const returnToListPage = () => {
    if (confirm('목록 페이지로 이동하시겠습니까?')) {
      window.location.href = '/bf-admin/reward/search';
    }
  };

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onGlobalModalCallback = () => {
    window.location.href = '/bf-admin/reward/search';
  };

  return (
    <>
      <MetaTitle title="적립금 발행" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>적립금 발행</h1>
          </div>
          <div className="cont withMultipleBackgound">
            <div className="cont_body">
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      적립금 이름
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'name'}
                        type="text"
                        className={'fullWidth'}
                        onChange={onInputChangeHandler}
                        value={formValues.name}
                      />
                      {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              </div>

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
                        idList={['GROUP', 'PERSONAL']}
                        labelList={['그룹', '개인']}
                        getDirValue={true}
                      />
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
                    <label className="title" htmlFor="amount">
                      발행 적립금
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'amount'}
                        type="text"
                        data-input-type={'number currency'}
                        className={'text-align-right'}
                        value={formValues.amount || 0}
                        onChange={onInputChangeHandler}
                      />
                      <em className={'unit'}>원</em>
                      {formErrors.amount && <ErrorMessage>{formErrors.amount}</ErrorMessage>}
                    </div>
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
              onClick={returnToListPage}
            >
              목록
            </button>
            <button
              type="submit"
              id="btn-create"
              className="admin_btn confirm_l solid"
              onClick={onSubmit}
            >
              {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '적립금 발행'}
            </button>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default ReleaseRewardPage;

//
//
//
// export async function getServerSideProps (context) {
//   const {params, req, res} = context;
//   // console.log(params);
//   // console.log(req);
//   // console.log(res);
//   return {
//     props: {
//       data: 'zz'
//     }
//   }
// }
