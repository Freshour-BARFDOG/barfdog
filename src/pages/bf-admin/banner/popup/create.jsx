import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

import InputRadio_status, {
  CustomRadio,
} from "/src/components/admin/form/InputRadioPackage";
import Fake_input from "@src/components/atoms/fake_input";
import PreviewImage from "@src/components/atoms/PreviewImage";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import getAdminToken from "@api/getAdminToken";
import { postData } from "@api/reqData";



// IMAGE RATIO설정필요 (미리보기이미지)







function CreatePopupPage() {
  const router = useRouter();
  const { id } = router.query;

  const REQUEST_URL = `/api/banners/popup`;

  const [modalMessage, setModalMessage] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [formValues, setFormValues] = useState({
    position:'CENTER'
  });
  const [imageFile, setImageFile] = useState({});
  const [formErrors, setFormErrors] = useState({});



  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const value = input.value;
    const type = input.type && input.dataset.type;
    const name = input.name;
    if (type === "link") {
      const device = input.dataset.device === "pc" ? "pc" : "mobile";
      const query = `${device}LinkUrl`;
      setFormValues({
        ...formValues,
        [query]: value,
      });
    } else if (name === "name") {
      setFormValues({
        ...formValues,
        name: value,
      });
    }
  };

  const onRadioButtonHandler = (data) => {
    const { key, value } = data;
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const imageFileChangeHandler = (e) => {
    const thisInput = e.currentTarget;
    const file = thisInput.files[0];
    console.log(file);
    const filename = file ? file.name : "";
    const device = thisInput.dataset.device === "pc" ? "pc" : "mobile";
    setImageFile({
      ...imageFile,
      [device]: {
        file,
        filename: file ? filename : initialValues[device].filename,
        thumbLink: file ? "" : initialValues[device].thumbLink, //파일이 없을 경우 : 기존파일 링크 유지
      },
    });
  };

  const valid_isEmpty = (value) => {
    let errors;

    if (!value) {
      errors = "항목이 비어있습니다.";
    } else {
      errors = "";
    }

    return errors;
  };

  const valid_link = (value) => {
    let errorsMessage;

    const regexURL = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "gi"
    ); // fragment locator

    const RESULT = regexURL.test(value);

    if (value && !RESULT) {
      errorsMessage = "유효하지 않은 링크입니다.";
    } else {
      errorsMessage = "";
    }

    return errorsMessage;
  };

  const validate = (obj) => {
    let errors = {};
    const keys = Object.keys(obj);

    keys.forEach((key) => {
      const val = obj[key];

      switch (key) {
        case "name":
          valid_isEmpty(val) && (errors[key] = "필수항목입니다.");
          break;
        case "pcLinkUrl":
          valid_link(val) && (errors[key] = valid_link(val));
          break;
        case "mobileLinkUrl":
          valid_link(val) && (errors[key] = valid_link(val));
          break;

        default:
          break;
      }
    });

    // * 파일 유효성검사 불필요
    // * 파일 empty: 기존 파일 유지 (파일 전송 X)
    // * 파일 exist: 파일 전송
    console.log("Validation Result: ", errors);

    return errors;
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    if (Object.keys(formErrors).length) return console.error(formErrors);
    postDataToServer();
  };



  const returnToPrevPage = () => {
    if (confirm("이전 페이지로 돌아가시겠습니까?")) {
      router.back();
    }
  };


  return (
    <>
      <MetaTitle title="팝업 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>팝업 생성</h1>
          </div>
          <form
            action="/"
            className="cont"
            encType="multipart/form-data"
            method="post"
            onSubmit={onSubmitHandler}
          >
            <div className="cont_body">
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="banner-name">
                      팝업이름
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        name="name"
                        className="fullWidth"
                        onChange={onInputChangeHandler}
                        value={formValues.name || ""}
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
                <div className="input_row">
                  <div className="title_section">
                    <p className="title">팝업위치</p>
                  </div>
                  <div className="inp_section">
                    <CustomRadio
                      formValues={formValues}
                      setFormValues={setFormValues}
                      title="popup-position"
                      name="popup-poisiton"
                      idList={["CENTER", "LEFT", "RIGHT"]}
                      labelList={["중간", "왼쪽", "오른쪽"]}
                    />
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <h5 className="cont_divider_title">
                  <b>PC</b>
                </h5>
                <div className="input_row upload_image">
                  <div className="title_section">
                    <p className="title">이미지</p>
                  </div>
                  <div className="inp_section">
                    <label className="inp_wrap file" htmlFor="upload-image-pc">
                      <PreviewImage
                        file={imageFile.pc?.file}
                        thumbLink={imageFile.pc?.thumbLink}
                        ratio={1920 / 450}
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
                          onChange={imageFileChangeHandler}
                        />
                        <Fake_input filename={imageFile.pc?.filename} />
                        {/* {formErrors.file_pc && (
                          <ErrorMessage>{formErrors.file_pc}</ErrorMessage>
                        )} */}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="input_row upload_image">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="link-image-pc">
                      연결링크
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        name="pcLinkUrl"
                        data-type="link"
                        className="halfWidth"
                        data-device="pc"
                        value={formValues.pcLinkUrl || ""}
                        placeholder="ex. https://barfdog.co.kr/event/1"
                        onChange={onInputChangeHandler}
                      />
                    </div>
                    <div className="desc">
                      *링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.
                    </div>
                    {/* {formErrors.pcLinkUrl && (
                      <ErrorMessage>{formErrors.pcLinkUrl}</ErrorMessage>
                    )} */}
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <h5 className="cont_divider_title">
                  <b>Mobile</b>
                </h5>
                <div className="input_row upload_image">
                  <div className="title_section">
                    <p className="title" htmlFor="upload-image-mobile">
                      이미지
                    </p>
                  </div>
                  <div className="inp_section">
                    <label
                      className="inp_wrap file"
                      htmlFor="upload-image-mobile"
                    >
                      <PreviewImage
                        file={imageFile.mobile?.file}
                        thumbLink={imageFile.mobile?.thumbLink}
                        ratio={1920 / 450}
                      />
                      <div className="inp_box">
                        <input
                          type="file"
                          data-type="file"
                          id="upload-image-mobile"
                          name="imageFile"
                          accept="image/*"
                          className="hide"
                          data-device="mobile"
                          multiple={false}
                          onChange={imageFileChangeHandler}
                        />
                        <Fake_input filename={imageFile.mobile?.filename} />
                        {formErrors.file_mobile && (
                          <ErrorMessage>{formErrors.file_mobile}</ErrorMessage>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                <div className="input_row upload_image">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="link-image-mobile">
                      연결링크
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        data-type="link"
                        name="mobileLinkUrl"
                        className="halfWidth"
                        data-device="mobile"
                        onChange={onInputChangeHandler}
                        value={formValues.mobileLinkUrl || ""}
                        placeholder="ex. https://barfdog.co.kr/event/2"
                      />
                    </div>
                    <div className="desc">
                      *링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.
                    </div>
                    {formErrors.mobileLinkUrl && (
                      <ErrorMessage>{formErrors.mobileLinkUrl}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* cont_divider */}
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
                  id="btn-update"
                  className="admin_btn confirm_l solid"
                >
                  수정
                </button>
              </div>
            </div>
          </form>
          {/* cont */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreatePopupPage;
