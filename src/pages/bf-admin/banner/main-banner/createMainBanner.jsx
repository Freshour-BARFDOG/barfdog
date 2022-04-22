import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import MetaTitle from "@src/components/atoms/MetaTitle";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import InputRadio from "./InputRadio";
import Fake_input from "./fake_input";
import PreviewImage from './PreviewImage';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import axios from 'axios';
import { useRouter } from "next/router";


function CreateMainBannerPage() {

  const router = useRouter();
  const [formErrors, setFormErrors] = useState({});

  const [name, setName] = useState("");
  const [exposedTarget, setExposedTarget] = useState("all");
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
  const [isSubmitting, setIsSubmitting] = useState(false);





  const returnToPrevPage = () => {
    if (confirm("저장하지않고 돌아가시겠습니까?")) {
      router.back();
    }
  };





  const getNameHandler = (e) => {
    const inp = e.currentTarget;
    const val = inp.value;
    setName(val);
  };

  const getExposedTargetHandler = (data) => {
    setExposedTarget(data);
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



  const getLinkHandler = (e) => {
    
    const thisInput = e.currentTarget;
    const link = thisInput.value;

    if (thisInput.dataset.device === "pc") {
      setFile_pc({ ...file_pc, link });
    } else {
      setFile_mobile({ ...file_mobile, link });
    }
  };

  

  const valid_isEmpty = (value) => {
    let errors;

    console.log(value);
    if (!value) {
     errors = "항목이 비어있습니다.";
    }else{
      errors = '';
    }

    return errors;
  };



  const valid_link = (value) => {
    let errors;

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


    if (!value) {
      // 존재하지만, 유효하지 않을 경우
      errors = "";
    } else if (value && !RESULT) {
      errors = "유효하지 않은 링크입니다.";
    }else{
      errors = '';
    }
    return errors;
  };




  const submitTotalData = (e) => {
    e.preventDefault();
    setFormErrors({
      ...formErrors,
      name: valid_isEmpty(name),
      exposedTarget: valid_isEmpty(exposedTarget),
      file_pc: valid_isEmpty(file_pc.file),
      link_pc: valid_link(file_pc.link),
      file_mobile: valid_isEmpty(file_mobile.file),
      link_mobile: valid_link(file_mobile.link),
    });

    setIsSubmitting(true);

    console.log(formErrors);

    const body = {
      bannerName: name,
      exposedTarget: exposedTarget,
      img_pc: file_pc.file,
      link_pc: file_pc.link,
      filename_pc: file_pc.filename,
      img_mobile: file_mobile.file,
      link_mobile: file_mobile.link,
      filename_mobile: file_mobile.filename,
    };

    // console.log(body);

    // axios.post("http://211.219.225.118:9999/login", {
    //     headers: {
    //       Authorization: "Bearer",
    //     },
    //     body: {
    //       username: "admin@gmail.com",
    //       password: "admin",
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   });

    // !

    axios
      .post("http://localhost:4000/a", {
        username: "admin@gmail.com",
        password: "admin",
      })
      .then((res) => {
        console.log(res);
      });
  
  };






  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      console.log("데이터 전송");
    }else{
      console.error(formErrors);;
    }
  }, [formErrors, isSubmitting]);
  

  return (
    <>
      <MetaTitle title="메인배너 > Create" />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>배너등록</h1>
          </div>
          <form className="cont">
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
                      id="banner-name"
                      className="fullWidth"
                      onChange={getNameHandler}
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
                  <InputRadio
                    dataList={exposedTarget}
                    exposedTarget={exposedTarget}
                    onExposedTargetHandler={getExposedTargetHandler}
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
                        id="upload-image-pc"
                        accept="image/*"
                        className="hide"
                        data-device="pc"
                        multiple={true}
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
                      id="link-image-pc"
                      className="halfWidth"
                      data-device="pc"
                      placeholder="ex. https://barfdog.co.kr/event/1"
                      onChange={getLinkHandler}
                    />
                  </div>
                  <div className="desc">
                    *링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.
                  </div>
                  {formErrors.link_pc && (
                    <ErrorMessage>{formErrors.link_pc}</ErrorMessage>
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
                        id="upload-image-mobile"
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
                      id="link-image-mobile"
                      className="halfWidth"
                      data-device="mobile"
                      onChange={getLinkHandler}
                      placeholder="ex. https://barfdog.co.kr/event/2"
                      value={file_mobile.link}
                    />
                  </div>
                  <div className="desc">
                    *링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.
                  </div>
                  {formErrors.link_mobile && (
                    <ErrorMessage>{formErrors.link_mobile}</ErrorMessage>
                  )}
                </div>
              </div>
            </div>
            {/* cont_divider */}
          </form>
          {/* cont */}
          <div className="cont-bottom">
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
                type="button"
                id="btn-create"
                className="admin_btn confirm_l solid"
                onClick={submitTotalData}
              >
                등록
              </button>
              <button type="button" id="btn-update" className="hide">
                수정
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateMainBannerPage