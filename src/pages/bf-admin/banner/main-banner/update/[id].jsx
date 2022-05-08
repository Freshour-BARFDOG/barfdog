import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MetaTitle from "@src/components/atoms/MetaTitle";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import InputRadio_status, {
  InputRadio_exposedTarget,
} from "@src/components/atoms/InputRadio";
import Fake_input from "@src/components/atoms/fake_input";
import PreviewImage from "@src/components/atoms/PreviewImage";
import { getData, putData, deleteData } from "/api/reqData"; 
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import getAdminToken from "@api/getAdminToken";



// const getDataFromAPI = (callback) => {
//   const callbackWrapper = (res) => {
//     const data = res.data._embedded.mainBannerListResponseDtoList;
//     callback(data);
//   };
//   ;
// };


// export async function getStaticPaths({ id }) {

//   const callback = (res) => {
//     const list = res.data._embedded.mainBannerListResponseDtoList;
//   };
//   getData("/api/banners/main", callback);

//   const paths = list.map(({ id }) => {
//     console.log({ id });
//     return { params: { id: `${id}` } };
//   });
//   // params: {id : '1'},{id : '2'}...
//   return {
//     paths,
//     fallback: false,
//   };
// }

// ! DATA를 ...... state로 넣기 전에,,,,, 미리 받아서 ...................UpdateMainBannerPage의 props로 넣어보자
// ! DATA를 ...... state로 넣기 전에,,,,, 미리 받아서 ...................UpdateMainBannerPage의 props로 넣어보자
// ! DATA를 ...... state로 넣기 전에,,,,, 미리 받아서 ...................UpdateMainBannerPage의 props로 넣어보자
// ! DATA를 ...... state로 넣기 전에,,,,, 미리 받아서 ...................UpdateMainBannerPage의 props로 넣어보자
// ! DATA를 ...... state로 넣기 전에,,,,, 미리 받아서 ...................UpdateMainBannerPage의 props로 넣어보자
// ! DATA를 ...... state로 넣기 전에,,,,, 미리 받아서 ...................UpdateMainBannerPage의 props로 넣어보자
// ! DATA를 ...... state로 넣기 전에,,,,, 미리 받아서 ...................UpdateMainBannerPage의 props로 넣어보자
// ! DATA를 ...... state로 넣기 전에,,,,, 미리 받아서 ...................UpdateMainBannerPage의 props로 넣어보자   22.05.06 금 오후 11:55 
// export async function getStaticProps() {
//   const res = await axios.get(`https://localholst:3065/user`);
//   const data = res.data;

//   return { props: { data } };
// }




function UpdateMainBannerPage() {

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const callback = (res) => {
        const data = res.data;
        setInitialValues(data);
      };
      getData(`/api/banners/main/${id}`, callback);
    }
  }, [id]);

  const [initialValues, setInitialValues] = useState({});
  // console.log(initialValues);
  // console.log(initialValues._links.thumbnail_pc.href);


  const [exposedTarget, setExposedTarget] = useState(initialValues.targets);
  const [exposedStatus, setExposedStatus] = useState(initialValues.status);
  
  const [file_pc, setFile_pc] = useState({
    // file: initialValues._links.thumbnail_pc.href,
    filename: initialValues.name,
    link: initialValues.pcLinkUrl,
  });
  const [file_mobile, setFile_mobile] = useState({
    // file: initialValues._links.thumbnail_mobile.href,
    filename: initialValues.name,
    link: initialValues.mobileLinkUrl,
  });
  console.log(file_pc);



  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (isSubmitting && !Object.keys(formErrors).length) {
      postDataToServer();
    } else {
      console.error(formErrors);
    }
  }, [formErrors, isSubmitting]);


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
          valid_isEmpty(val) ? (errors[key] = "필수항목입니다.") : "";
          break;
        case "pcLinkUrl":
          // console.log(val);
          valid_link(val) ? (errors[key] = valid_link(val)) : "";
          break;
        case "mobileLinkUrl":
          // console.log(errors[key], valid_link(val));
          valid_link(val) ? (errors[key] = valid_link(val)) : '';
          break;

        default:
          break;
      }
    });

    valid_isEmpty(file_pc.file)
      ? (errors["file_pc"] = valid_isEmpty(file_pc.file))
      : "";
    valid_isEmpty(file_mobile.file) ? (errors["file_mobile"] = valid_isEmpty(file_mobile.file))
      : "";

    console.log("Validation Result: ", errors);

    return errors;
  };




  const onSubmitHandler = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    let isError = false;
    Object.keys(formErrors).forEach((key) => {
      if (formErrors[key]) {
        isError = true;
        return;
      }
    });
    if (isError) return;
    setIsSubmitting(true);
  
  }; // * onSubmitHandler


  const postDataToServer = async () => {
    // 보낼값: 파일 1.JSON 2.파일(이미지) 3. 파일(이미지 모바일)
    // * 파일 변환방법
    const formData = new FormData();
    formData.append("pcFile", file_pc.file);
    formData.append("mobileFile", file_mobile.file);
    const jsonData = JSON.stringify(formValues);
    const blob = new Blob([jsonData], { type: "application/json" });
    formData.append("requestDto", blob);

    const token = await getAdminToken();
    const axiosConfig = {
      headers: {
        authorization: token,
        "Content-Type": "multipart/form-data",
      },
    };

    const postCallback = () => {
      alert("배너등록이 완료되었습니다.");
      if (window) {
        location.reload();
      }
    };

    postData("/api/banners/main", formData, axiosConfig, postCallback);
  };


  return (
    <>
      <MetaTitle title="메인배너 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>메인배너 수정</h1>
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

export default UpdateMainBannerPage;
