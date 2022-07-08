import React, {useEffect, useState} from 'react';


import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import CustomSelectForTwoSelects from '/src/components/admin/form/CustomSelectForTwoSelects';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import SearchGroupForm from "/src/components/admin/form/SearchGroupForm";
import SearchPersonalForm from "/src/components/admin/form/SearchPersonalForm";


const initValOfAll = {
  expiredDate : "",
  couponId : undefined,
  alimTalk : false,
  couponType : "GENERAL_PUBLISHED",
}
const initValOfPersonal = {
  memberIdList : [],
  expiredDate : "",
  couponId : undefined,
  alimTalk : false,
  couponType : "GENERAL_PUBLISHED",

}

const initValOfGroup = {
  subscribe : false,
  longUnconnected : false,
  gradeList : [],
  area : "ALL",
  birthYearFrom : "",
  birthYearTo : "",
  expiredDate : "",
  couponId : undefined,
  alimTalk : false,
  couponType : "GENERAL_PUBLISHED",
}


const initialFormValues = {
  ALL: initValOfAll,
  PERSONAL: initValOfPersonal,
  GROUP: initValOfGroup
}

const initialFormErrors = {};



function ReleaseCouponPage() {



  const [issuedTarget, setIssuedTarget] = useState({type:'ALL'});

  const [formValues, setFormValues] = useState(initialFormValues['ALL']);
  const [formErrors, setFormErrors] = useState(initialFormErrors);


  console.log(formValues)
  useEffect(() => {
    // 발행대상이 바뀌었을 경우 , formValue초기화
    const selectedFormValues = initialFormValues[issuedTarget.type]
    setFormValues(selectedFormValues);
  }, [issuedTarget]);





  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('onSubmit!');
    // MEMO : 서버에 전송할 때, 가격은........ transformClearLocalCurrency() 적용해야함
    // transformClearLocalCurrency();
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
                        setValue={setIssuedTarget}
                        name="type"
                        idList={['ALL', 'GROUP', 'PERSONAL']}
                        labelList={['전체', '그룹', '개인']}
                      />

                      {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              </div>
              {issuedTarget.type === 'GROUP' && (<SearchGroupForm setFormValues={setFormValues} />)}
              {issuedTarget.type === 'PERSONAL' && (<SearchPersonalForm setFormValues={setFormValues} />)}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      유효기간
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'expiredDate'}
                        type="text"
                        name="release-coupon"
                        // onChange={handleChange}
                      />
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
                    <label className="title" htmlFor="name">
                      쿠폰 선택
                    </label>
                  </div>
                  <div className="inp_section">
                    <CustomSelectForTwoSelects
                      name="coupon"
                      id="coupon"
                      options={[
                        { label: '선택', value: '' },
                        { label: '쿠폰-1', value: 'template-1 정보' },
                        { label: '쿠폰-2', value: 'template-2 정보' },
                        { label: '쿠폰-3', value: 'template-3 정보' },
                      ]}
                      style={{ width: '100%', maxWidth: '600px' }}
                      onChange={setFormValues}
                    />
                    {formErrors.coupon && <ErrorMessage>{formErrors.coupon}</ErrorMessage>}
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
              쿠폰발행
            </button>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ReleaseCouponPage;
