import React, {useEffect, useState} from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import {AdminContentWrapper} from "/src/components/admin/AdminWrapper";

import CustomRadio from "/src/components/admin/form/CustomRadio";
import CustomSelect from "/src/components/admin/form/CustomSelect";
import CustomSelectGroup from "./CustomSelectGroup";
import ToolTip from "/src/components/atoms/Tooltip";
import calcedAgeList from "./calcedAgeList";
import Modal_alimTalk_Preview from "./Modal_alimTalk_Preview";




const FormOfGroupType = ({setFormValues}) => {

  const ageList = calcedAgeList();
  return (
    <>
      <div className="cont_divider">
        <div className="input_row">
          <div className="title_section fixedHeight">
            <label className="title" htmlFor="releaseTarget">
              회원등급
            </label>
          </div>
          <div className="inp_section">
            <div className="inp_box">
              <CustomSelectGroup setFormValues={setFormValues} groupOptions={{
                startName: 'grade-start',
                endName: 'grade-end',
                options: [
                  {label: "-선택-", value: ""},
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
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="releaseTarget">
                구독유무
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomRadio
                  setValue={setFormValues}
                  name="subscribe-yn"
                  idList={["subscribe-Y", "subscrib-N"]}
                  labelList={["Y", "N"]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="releaseTarget">
                연령
              </label>
              <span style={{marginLeft: '4px', position: 'relative', top: '-2px'}}>
                <ToolTip message={'출생연도 기준'}/>
              </span>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomSelectGroup setFormValues={setFormValues} groupOptions={{
                  startName: 'age-start',
                  endName: 'age-end',
                  options: ageList
                }}/>
              </div>
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="releaseTarget">
                지역
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomRadio
                  setValue={setFormValues}
                  name="location"
                  idList={["ALL", "METRO", 'NON-METRO']}
                  labelList={["전체", "수도권", '비수도권']}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="releaseTarget">
                장기 미접속
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomRadio
                  setValue={setFormValues}
                  name="unconnected-term"
                  idList={["term-YES", "term-NO"]}
                  labelList={["Y", "N"]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


function FriendTalkPage() {
  const [isModalActive, setIsModalActive] = useState(true);


  const initialValues = {
    template: '템플릿 정보를 전달합니다.',
    exposedTarget: 'ALL'
  }
  const [formValues, setFormValues] = useState(initialValues);
  console.log(formValues);

  const onShowModal = () => {
    setIsModalActive(true);
  }

  return (
    <>
      <MetaTitle title="친구톡" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">친구톡</h1>
          <form
            action="/a"
            className="cont"
            encType="multipart/form-data"
            method="post"
            // onSubmit={onSubmitHandler}
          >
            <div className="cont_body">
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="templateList">
                      템플릿 선택
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <CustomSelect
                        name="template"
                        id="template"
                        options={[
                          {label: "-선택-", value: ""},
                          {label: "template-1", value: "template-1 정보"},
                          {label: "template-2", value: "template-2 정보"},
                          {label: "template-3", value: "template-3 정보"},
                        ]}
                        onChange={setFormValues}
                      />
                      {/*{formErrors.name && (*/}
                      {/*    <ErrorMessage>{formErrors.name}</ErrorMessage>*/}
                      {/*)}*/}
                    </div>
                  </div>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="releaseTarget">
                      발행 대상
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <CustomRadio
                        setValue={setFormValues}
                        name="exposedTarget"
                        idList={["ALL", "GROUP"]}
                        labelList={["전체", "그룹"]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {formValues?.exposedTarget === 'GROUP' && <FormOfGroupType setFormValues={setFormValues}/>}

            </div>
            <div className="cont_bottom">
              <div className="btn_section">
                <button
                  type="button"
                  className="admin_btn confirm_l line"
                  onClick={onShowModal}
                >
                  미리보기
                </button>
                <button
                  type="submit"
                  id="btn-create"
                  className="admin_btn confirm_l solid"
                >
                  전송하기
                </button>
              </div>
            </div>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
      {isModalActive && <Modal_alimTalk_Preview onModalActive={setIsModalActive} data={formValues.template}/> }
    </>
  );
}

export default FriendTalkPage;
