import React, {useEffect, useState} from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import {AdminContentWrapper} from "/src/components/admin/AdminWrapper";

import CustomRadio from "/src/components/admin/form/CustomRadio";
import CustomSelect from "/src/components/admin/form/CustomSelect";
import Modal_alimTalk_Preview from "./Modal_alimTalk_Preview";
import FormOfGroupType from './FormOfGroupType';





function FriendTalkPage() {
  const [isModalActive, setIsModalActive] = useState(false);



  const initialValues = {
    template: '템플릿 정보를 전달합니다.',
    exposedTarget: 'ALL'
  }
  const [formValues, setFormValues] = useState(initialValues);
  // console.log(formValues);

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
