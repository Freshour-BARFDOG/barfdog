import React, {useEffect, useState} from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import CustomRadio from "/src/components/admin/form/CustomRadio";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import SearchGroupForm from "../../../../components/admin/form/SearchGroupForm";
import SearchPersonalForm from "../../../../components/admin/form/SearchPersonalForm";




const initValOfAll = {
  name:'',
  description:'',
  expiredDate : "",
  alimTalk : false,
}
const initValOfPersonal = {
  name:'',
  description: '',
  memberIdList : [],
  expiredDate : "",
  alimTalk : false,

}

const initValOfGroup = {
  name:'',
  description: '',
  subscribe : false,
  longUnconnected : false,
  gradeList : [],
  area : "ALL",
  birthYearFrom : "",
  birthYearTo : "",
  expiredDate : "",
  alimTalk : false,
}

const initialFormValues = {
  ALL: initValOfAll,
  PERSONAL: initValOfPersonal,
  GROUP: initValOfGroup
}

const initialFormErrors = {};



function ReleaseRewardPage() {

  const [issuedTarget, setIssuedTarget] = useState({issuedTarget:'ALL'});

  const [formValues, setFormValues] = useState(initialFormValues['ALL']);
  const [formErrors, setFormErrors] = useState(initialFormErrors);


  // 발행대상이 바뀌었을 경우 초기화됨
  useEffect(() => {
    setFormValues(initialFormValues[issuedTarget.issuedTarget]);
    // console.log(issuedTarget.issuedTarget)
    // console.log(initialFormValues)
    console.log(initialFormValues[issuedTarget.issuedTarget])
  }, [issuedTarget]);

  console.log(formValues)

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('onSubmit!');
    // MEMO : 서버에 전송할 때, 가격은........ transformClearLocalCurrency() 적용해야함
    // transformClearLocalCurrency();
  };

  const onChangeHandler = (e) => {
    const { id, value } = e.currentTarget;

    setFormValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };



  return (
    <>
      <MetaTitle title="적립금 발행" admin={true}/>
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
                        name="release-reward"
                        className={'fullWidth'}
                        value={formValues.name}
                        onChange={onChangeHandler}
                      />
                      {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      적립금 설명
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'description'}
                        type="text"
                        name="release-reward"
                        className={'fullWidth'}
                        value={formValues.description}
                        onChange={onChangeHandler}
                      />
                      {formErrors.description && (
                        <ErrorMessage>{formErrors.description}</ErrorMessage>
                      )}
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
                        setValue={setIssuedTarget}
                        name="issuedTarget"
                        idList={['ALL', 'GROUP', 'PERSONAL']}
                        labelList={['전체', '그룹', '개인']}
                      />
                      {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              </div>
              {issuedTarget.issuedTarget === 'GROUP' && (<SearchGroupForm setFormValues={setFormValues} />)}
              {issuedTarget.issuedTarget === 'PERSONAL' && (<SearchPersonalForm setFormValues={setFormValues} />)}


              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      알림톡 발송
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <CustomRadio
                        setValue={setFormValues}
                        name="alimTalk"
                        idList={['TRUE', 'FALSE']}
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
              id="release-coupon"
              className="admin_btn confirm_l solid"
              onClick={onSubmitHandler}
            >
              적립금 발행
            </button>
          </div>

        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ReleaseRewardPage;
