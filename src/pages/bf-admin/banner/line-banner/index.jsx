import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import ErrorMessage from "@src/components/atoms/ErrorMessage";
import InputRadio_status, {
  InputRadio_exposedTarget,
} from "@src/components/atoms/InputRadio";
import s from "@styles/admin/banner/adminLineBanner.module.scss";



function LineBanner() {
  const router = useRouter();

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
  const initialValues = {
    name: "",
    targets: exposedTarget,
    status: exposedStatus,
    pcLinkUrl: file_pc.link,
    mobileLinkUrl: file_mobile.link,
  };


  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);



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



  return (
    <>
      <MetaTitle title="상단 띠배너 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>상단 띠 배너</h1>
          </div>
          <form
            action="/"
            className="cont"
            id={`${s.cont}`}
            encType="multipart/form-data"
            method="post"
            // onSubmit={onSubmitHandler}
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
                      exposedStatus={exposedStatus}
                      onRadioButtonHandler={onRadioButtonHandler}
                    />
                  </div>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="banner-name">
                      글자색
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className={`${s.inp_box} inp_box`}>
                      <input
                        type="text"
                        name="text-color"
                        onChange={handleChange}
                      />
                      {/* {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )} */}
                      <div className={`${s.desc} desc`}>
                        Hex코드로 입력. 예)#000000
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="banner-name">
                      배경색
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className={`${s.inp_box} inp_box`}>
                      <input
                        type="text"
                        name="text-color"
                        onChange={handleChange}
                      />
                      {/* {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )} */}
                      <div className={`${s.desc} desc`}>
                        Hex코드로 입력. 예)#000000
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cont_divider">
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
                        onChange={handleChange}
                        placeholder="ex. https://barfdog.co.kr/event/link"
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
    </>
  );
}

export default LineBanner;
