import React, { useState, useEffect } from "react";
import s from "./mypageBanner.module.scss";
import { useRouter } from "next/router";
import { useModalContext } from "@store/modal-context";
import Modal_global_alert from "@src/components/modal/Modal_global_alert";
import Modal from "@src/components/modal/Modal";

import axios from "axios";
import axiosConfig from "/api/axios.config";

import MetaTitle from "@src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import PreviewImage from "@src/components/atoms/PreviewImage";
import ErrorMessage from "@src/components/atoms/ErrorMessage";
import Fake_input from "@src/components/atoms/fake_input";
import InputRadio_status, {
  InputRadio_exposedTarget,
} from "@src/components/admin/form/InputRadioPackage";



function MypageBanner() {
  const router = useRouter();
  const mct = useModalContext();
  const REQUEST_URL = `/api/banners/myPage`;
  const [initialValues, setInitialValues] = useState({});
  const [formValues, setFormValues] = useState({});
  const [imageFile, setImageFile] = useState({});
  const [formErrors, setFormErrors] = useState({});



  useEffect(() => {
    (async () => {
      const token = axiosConfig();
      // console.log(token.headers.authorization);
      const response = await axios
        .get(
          REQUEST_URL,
          {
            headers: {
              authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLthqDtgbAg7J2066aEIiwiaWQiOjUsImV4cCI6MTY1MTg5MjU3NiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifQ.Wycm9ZmiiK-GwtsUkvMCHHeExDBtkveDbhKRealjmd8C4OZMp3SFqGFcFWudXMiL5Mxdj6FcTAV9OVsOYsn_Mw",
              "Content-Type": "application/json",
            },
          },
          axiosConfig()
        )
        .then((res) => {
          console.log(res.data);
          return res.data;
        })
        .catch((err) => {
          console.error(err.request.response); //////*******중요
          const errorObj = JSON.parse(err.request.response);
          const status = errorObj.status;
          console.log(status);
          if(status === 401){
            const EXPIRED_TOKEN = errorObj.reason === "EXPIRED_TOKEN";
            const UNAUTHORIZED = errorObj.reason === "UNAUTHORIZED";
            console.error("errorType > EXPIRED_TOKEN : ", EXPIRED_TOKEN);
            console.error("errorType > UNAUTHORIZED : ", UNAUTHORIZED);
            
          }else if (status === 403) {
            const FORBIDDEN = errorObj.reason === "FORBIDDEN";
            console.error("errorType > FORBIDDEN : ", FORBIDDEN);
          }
          
          
        });
      // const formData = {
      //   name: response.name,
      //   targets: response.targets,
      //   status: response.status,
      //   pcLinkUrl: response.pcLinkUrl,
      //   mobileLinkUrl: response.mobileLinkUrl,
      // };
      // const fileData = {
      //   pc: {
      //     file: "",
      //     filename: response.filenamePc,
      //     thumbLink: response._links?.thumbnail_pc.href,
      //   },
      //   mobile: {
      //     file: "",
      //     filename: response.filenameMobile,
      //     thumbLink: response._links?.thumbnail_mobile.href,
      //   },
      // };
      // setInitialValues({ ...formData, ...fileData });
      // setFormValues(formData);
      // setImageFile(fileData);
    })();
  }, [REQUEST_URL]);

  const [exposedTarget, setExposedTarget] = useState("all");
  const [exposedStatus, setExposedStatus] = useState("leaked");
  const [file_pc, setFile_pc] = useState({
    file: "",
    filename: "",
    link: "",
  });
  const [file_mobile, setFile_mobile] = useState({
    file: "",
    filename: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    const input = e.currentTarget;
    const type = input.type && input.dataset.type;

    if (type === "link") {
      const device = input.dataset.device === "pc" ? "pc" : "mobile";
      setFormValues({
        ...formValues,
        [`${device}LinkUrl`]: value,
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const returnToPrevPage = () => {
    if (confirm("이전 페이지로 돌아가시겠습니까?")) {
      router.back();
    }
  };

  const onRadioButtonHandler = (data) => {
    if (data.target) {
      setExposedTarget(data);
      setFormValues({
        ...formValues,
        targets: data,
      });
    } else {
      setExposedStatus(data);
      setFormValues({
        ...formValues,
        status: data,
      });
    }
  };

  const imageFileChangeHandler = (e) => {
    const thisInput = e.currentTarget;
    const file = thisInput.files[0];
    const filename = file ? file.name : "";
    if (thisInput.dataset.device === "pc") {
      setFile_pc({ ...file_pc, file: file, filename });
    } else {
      setFile_mobile({ ...file_mobile, file: file, filename });
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    if (Object.keys(formErrors).length) return console.error(formErrors);
    postDataToServer();
  };

  return (
    <>
      <MetaTitle title="마이페이지 배너 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1 onClick={()=>{
              mct.onShow();
            }}>마이페이지 배너 ---- 모달 테스트중 --클릭시 모달나타남</h1>
          </div>
          <form
            action="/a"
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
                      배너이름
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        name="name"
                        className="fullWidth"
                        onChange={handleChange}
                      />
                      {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section">
                    <p className="title">노출대상</p>
                  </div>
                  <div className="inp_section">
                    <InputRadio_exposedTarget
                      name="exposedTarget"
                      exposedTarget={exposedTarget}
                      onRadioButtonHandler={onRadioButtonHandler}
                    />
                  </div>처
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
                      exposedStatus={exposedStatus}
                      onRadioButtonHandler={onRadioButtonHandler}
                    />
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <h5 className="cont_divider_title">
                  <b>PC</b>
                </h5>
                <div className="input_row upload_image multipleLines">
                  <div className="title_section">
                    <p className="title">이미지</p>
                  </div>
                  <div className="inp_section">
                    <label className="inp_wrap file" htmlFor="upload-image-pc">
                      <PreviewImage
                        file={file_pc.file}
                        className={s["upload-image"]}
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
                        <Fake_input filename={file_pc.filename} />
                        {formErrors.file_pc && (
                          <ErrorMessage>{formErrors.file_pc}</ErrorMessage>
                        )}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="input_row multipleLines">
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
                        placeholder="ex. https://barfdog.co.kr/event/1"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="desc">
                      *링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.
                    </div>
                    {formErrors.pcLinkUrl && (
                      <ErrorMessage>{formErrors.pcLinkUrl}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <h5 className="cont_divider_title">
                  <b>Mobile</b>
                </h5>
                <div className="input_row upload_image multipleLines">
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
                        file={file_mobile.file}
                        className={`${s["upload-image"]} ${s["mobile"]} `}
                      />
                      <div className="inp_box">
                        <input
                          type="file"
                          data-type="file"
                          id="upload-image-mobile"
                          name="mobileImage"
                          accept="image/*"
                          className="hide"
                          data-device="mobile"
                          multiple={false}
                          onChange={imageFileChangeHandler}
                        />
                        <Fake_input filename={file_mobile.filename} />
                        {formErrors.file_mobile && (
                          <ErrorMessage>{formErrors.file_mobile}</ErrorMessage>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                <div className="input_row multipleLines">
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
                        onChange={handleChange}
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
                <button type="button" id="btn-update" className="hide">
                  수정
                </button>
              </div>
            </div>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={mct.message} />
      <Modal background title="비밀번호 재설정">
        내용전달내용전달내용전달내용전달내용전달
      </Modal>
    </>
  );
}

export default MypageBanner;
