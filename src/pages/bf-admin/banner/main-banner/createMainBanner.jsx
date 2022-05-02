import React, {
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import MetaTitle from "@src/components/atoms/MetaTitle";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import { InputRadio_exposedTarget, InputRadio_status } from "./InputRadio";
import Fake_input from "./fake_input";
import PreviewImage from './PreviewImage';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import axios from "axios";
import getAdminToken from "@api/getAdminToken";





function CreateMainBannerPage() {
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
    if (confirm("저장하지 않고 돌아가시겠습니까?")) {
      router.back();
    }
  };

  // const getNameHandler = (e) => {
  //   const inp = e.currentTarget;
  //   const val = inp.value;
  //   setName(val);
  // };

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
      // console.log("실패");
      errorsMessage = "유효하지 않은 링크입니다.";
    } else {
      errorsMessage = "";
    }

    // console.log(value);
    // console.log(RESULT);
    // console.log(errorsMessage);

    return errorsMessage;
  };

  const validate = (obj) => {
    let errors = {};
    const keys = Object.keys(obj);

    keys.forEach((key) => {
      const val = obj[key];

      // console.log(val);
      // console.log(key);

      switch (key) {
        case "name":
          errors[key] = valid_isEmpty(val) ? "필수항목입니다." : "";
          break;
        case "pcLinkUrl":
          // console.log(errors[key], valid_link(val));
          errors[key] = valid_link(val);
          break;
        case "mobileLinkUrl":
          // console.log(errors[key], valid_link(val));
          errors[key] = valid_link(val);
          break;

        default:
          break;
      }
    });

    errors["file_pc"] = valid_isEmpty(file_pc.file) ? "필수항목입니다." : "";
    errors["file_mobile"] = valid_isEmpty(file_mobile.file)
      ? "필수항목입니다."
      : "";

    console.log("Validation Result: ", errors);

    return errors;
  };


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors(validate(formValues));

    let isError = false;
    Object.keys(formErrors).forEach((key) => {
      if (formErrors[key]) {
        isError = true;
        return;
      }
    });

    console.log(isError);
    if (isError) return;

    
    
    const token = await getAdminToken();
    // console.log(token);
    // 보낼값: 파일 1.JSON 2.파일(이미지) 3. 파일(이미지 모바일) 
    
    // * 파일 변환방법
    const formData = new FormData();
    formData.append("pcFile", file_pc.file);
    formData.append("mobileFile", file_mobile.file);
    const jsonData = JSON.stringify(formValues);
    const blob = new Blob([jsonData], { type: "application/json" });
    formData.append("requestDto", blob);

    const axiosConfig = {
      headers: {
        authorization: token,
        "Content-Type": "multipart/form-data",
      },
    };
  

    axios
      .post("/api/banners/main", formData, axiosConfig)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }; // * onSubmitHandler


  useEffect(() => {
    console.log('실행');
    if (Object.keys(formErrors).length === 0) {
      console.log("데이터 전송");
    } else {
      console.error(formErrors);
    }

  }, [formErrors]);


  return (
    <>
      <MetaTitle title="메인배너 > Create" />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>배너등록</h1>
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
                        // onChange={getNameHandler}
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
                      <PreviewImage file={file_pc.file} />
                      <span className="inp_box">
                        <input
                          type="file"
                          data-type="file"
                          id="upload-image-pc"
                          name="imageFilePc"
                          accept="image/*"
                          className="hide"
                          data-device="pc"
                          // multiple={false}
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
                      <PreviewImage file={file_mobile.file} />
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
                          // onChange={handleChange}
                        />
                        <Fake_input filename={file_mobile.filename} />
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
          {/* cont */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateMainBannerPage;