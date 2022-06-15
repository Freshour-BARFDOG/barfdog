import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import CustomSelect from "/src/components/admin/form/CustomSelect";
import CustomSelectGroup from "/src/components/admin/messenger/friendTalk/CustomSelectGroup";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import calcedAgeList from "/util/func/calcedAgeList";


/* MEMO > 발행 타입 > 전체
{
  "expiredDate" : "2025-05-28",
  "couponType" : "GENERAL_PUBLISHED",
  "couponId" : 78,
  "alimTalk" : false
}
*/

/* MEMO > 발행 타입 > 개인
{
  "memberIdList" : [ 75 ],
  "expiredDate" : "2025-05-31",
  "couponType" : "GENERAL_PUBLISHED",
  "couponId" : 74,
  "alimTalk" : false
}
*/

/* MEMO > 발행 타입 > 그룹
{
  "subscribe" : false,
  "longUnconnected" : false,
  "gradeList" : [ "BRONZE", "SILVER" ],
  "area" : "ALL",
  "birthYearFrom" : "1990",
  "birthYearTo" : "1999",
  "expiredDate" : "2025-05-31",
  "couponType" : "GENERAL_PUBLISHED",
  "couponId" : 55,
  "alimTalk" : false
}
*/




const initialFormValues = {

};


const initialFormErrors = {};
function ReleaseCouponPage() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  console.log(formValues)

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
                        setValue={setFormValues}
                        name="couponTarget"
                        idList={['ALL', 'PERSONAL', 'GROUP']}
                        labelList={['전체', '개인', '그룹']}
                      />
                      {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* -------- 그룹 -------- */}
              {/* -------- 그룹 -------- */}
              {/* -------- 그룹 -------- */}
              {/* -------- 그룹 -------- */}
              <div className="optional-section">
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="name">
                        회원등급
                     </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomSelectGroup setFormValues={setFormValues} groupOptions={{
                          startName: 'grade-start',
                          endName: 'grade-end',
                          options: [
                            {label: "선택", value: ""},
                            {label: "브론즈", value: "BRONZE"},
                            {label: "실버", value: "SILVER"},
                            {label: "골드", value: "GOLD"},
                            {label: "플래티넘", value: "PLATINUM"},
                            {label: "다이아", value: "DIA"},
                            {label: "더바프", value: "THEBARF"},
                          ]
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>




                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="name">
                        연령
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomSelectGroup
                          setFormValues={setFormValues}
                          groupOptions={{
                            startName: 'age-start',
                            endName: 'age-end',
                            options: calcedAgeList(),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="name">
                        구독유무
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                          setValue={setFormValues}
                          name="subscribe"
                          idList={['TRUE', 'FALSE']}
                          labelList={['Y', 'N']}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="name">
                        지역
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                          setValue={setFormValues}
                          name="area"
                          idList={['ALL', 'METRO', 'NON-METRO']}
                          labelList={['전체', '수도권', '비수도권']}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="name">
                        장기미접속
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                          setValue={setFormValues}
                          name="longUnconnected"
                          idList={['TRUE', 'FALSE']}
                          labelList={['Y', 'N']}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              {/* -------- 그룹 -------- */}
              {/* -------- 그룹 -------- */}
              {/* -------- 그룹 -------- */}
              {/* -------- 그룹 -------- */}
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
                    <CustomSelect
                      name="coupon"
                      id="coupon"
                      options={[
                        {label: "선택", value: ""},
                        {label: "쿠폰-1", value: "template-1 정보"},
                        {label: "쿠폰-2", value: "template-2 정보"},
                        {label: "쿠폰-3", value: "template-3 정보"},
                      ]}
                      style={{width:'100%', maxWidth:'600px'}}
                      onChange={setFormValues}
                    />
                      {formErrors.coupon && (
                        <ErrorMessage>{formErrors.coupon}</ErrorMessage>
                      )}
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
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ReleaseCouponPage;
