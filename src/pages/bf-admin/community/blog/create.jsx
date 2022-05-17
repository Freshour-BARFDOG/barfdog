import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";

import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
// import QuillEditor, { formats, modules } from "@src/components/admin/form/QuillEditor";
import QuillEditor from "@src/components/admin/form/QuillEditor";
import InputRadio_status from "@src/components/admin/form/InputRadioPackage";
import Fake_input from "@src/components/atoms/fake_input";
import PreviewImage from "@src/components/atoms/PreviewImage";
import SelectTag from "@src/components/atoms/SelectTag";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import rem from '@src/components/atoms/rem';





const CreateBlogPage = (props) => {
  const [body, setBody] = useState(""); // Quill 에디터의 innerHTML을 담는 state


  const returnToPrevPage = () => {
    if (confirm("이전 페이지로 돌아가시겠습니까?")) {
      router.back();
    }
  };


  return (
    <>
      <MetaTitle title="블로그 작성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>블로그 작성</h1>
          </div>
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
                    <label className="title" htmlFor="banner-name">
                      카테고리
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <SelectTag
                        name={"category"}
                        id={"category"}
                        onChange={"onCategoryHandler"}
                        options={[
                          { label: "- 선택 -", value: null },
                          { label: "영양", value: "영양" },
                          { label: "건강", value: "건강" },
                          { label: "생애", value: "생애" },
                        ]}
                      />
                      {/* {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row upload_image">
                  <div className="title_section">
                    <p className="title">썸네일</p>
                  </div>
                  <div className="inp_section">
                    <label
                      className="inp_wrap file"
                      htmlFor="upload-image-pc"
                      style={{ display: "inline-block" }}
                    >
                      <PreviewImage
                        file={""}
                        ratio={1 / 1}
                        style={{ width: `${rem(200)}` }}
                      />
                      <span className="inp_box">
                        <input
                          type="file"
                          data-type="file"
                          id="upload-image-pc"
                          name="imageFilePc"
                          accept="image/*"
                          className="hide"
                          data-device="pc"
                          multiple={true}
                          // onChange={imageFileChangeHandler}
                        />
                        <Fake_input filename={"파일이름을 입력하세요"} />
                        {/* {formErrors.file_pc && (
                          <ErrorMessage>{formErrors.file_pc}</ErrorMessage>
                        )} */}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section">
                    <p className="title">상세설명</p>
                  </div>
                  <div className="inp_section">
                    {/* // * --- QUILL EDITOR --- * // */}
                    <QuillEditor
                      handleQuillChange={setBody}
                    />
                    {/* // * --- QUILL EDITOR --- * // */}
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section">
                    <p className="title">노출여부</p>
                  </div>
                  <div className="inp_section">
                    <InputRadio_status
                      name="exposedStatus"
                      exposedStatus={"exposedStatus"}
                      onRadioButtonHandler={"onRadioButtonHandler"}
                    />
                  </div>
                </div>
              </div>
              {/* cont_divider */}
            </div>
            <div className="cont_bottom">
              <div className="btn_section">
                <button
                  type="button"
                  id="btn-cancle"
                  className="admin_btn confirm_l line"
                  onClick={returnToPrevPage}
                >
                  취소
                </button>
                <button
                  type="submit"
                  id="btn-create"
                  className="admin_btn confirm_l solid"
                >
                  등록
                </button>
              </div>
            </div>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
};;

export default CreateBlogPage;


