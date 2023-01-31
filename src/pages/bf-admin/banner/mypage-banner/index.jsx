import React, { useState, useEffect } from "react";
import s from "./mypageBanner.module.scss";
import { useRouter } from "next/router";
import { useModalContext } from "/store/modal-context";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import PreviewImage from "/src/components/atoms/PreviewImage";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import Fake_input from "/src/components/atoms/fake_input";
import CustomRadio from "/src/components/admin/form/CustomRadio";
import {validate} from "/util/func/validation/validation_mypageBanner";
import {getData, postObjData} from "/src/pages/api/reqData";
import Spinner from "/src/components/atoms/Spinner";
import {valid_hasFormErrors} from "/util/func/validation/validationPackage";
import Tooltip from "/src/components/atoms/Tooltip";
import { exposeType } from "/store/TYPE/exposeType";






const initialFormValues = {
  name : "",
  status: exposeType.LEAKED,
  pcLinkUrl : "",
  mobileLinkUrl : "",
};




const initialImageFiles = {
  pcFile: {
    file: null,
    filename:'',
    url:''
  },
  mobileFile: {
    file: null,
    filename:'',
    url: ''
  },
}




export default function UpdateMypageBanner() {
  
  const router = useRouter();
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [fileValues, setFileValues] = useState(initialImageFiles);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  
  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const apiUrl = `/api/banners/myPage`;
        const res = await getData(apiUrl);
        const data = res.data;
        console.log('mypageBanner RESPONSE : ',res);
        const initVal = {
          id: data.id, // post Api 요청 시, 사용
          name : data.name,
          status: data.status,
          pcLinkUrl : data.pcLinkUrl,
          mobileLinkUrl : data.mobileLinkUrl,
        };
        const initialFileValues = {
          pcFile: {
            file: '',
            filename:data.filenamePc,
            url:data._links.thumbnail_pc?.href
          },
          mobileFile: {
            file: '',
            filename: data.filenameMobile,
            url:data._links.thumbnail_mobile?.href
          },
        }
        
        setFormValues(initVal);
        setFileValues(initialFileValues)
      } catch (err) {
        console.error(err);
        alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);
  
  
  
  const onInputChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };
  
  const onFileChangeHandler = (e) => {
    const thisInput = e.currentTarget;
    const id = thisInput.id;
    const file = thisInput.files[0];
    const filename = file ? file.name : "";
    setFileValues(prevState => ({
      ...prevState,
      [id]:{
        file,
        filename
      }
    }))
  };
  
  
  
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');
    const form = {
      name : formValues.name,
      status: formValues.status,
      pcLinkUrl : formValues.pcLinkUrl,
      mobileLinkUrl : formValues.mobileLinkUrl,
    }
    console.log('formValues: ',form);
    console.log('fileValues: ',fileValues);
    const errObj = validate(form, fileValues);
    const isPassed = valid_hasFormErrors(errObj);
    setFormErrors(errObj);
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      if (isPassed) {
        const jsonData = JSON.stringify(form);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const formData = new FormData();
        formData.append('requestDto', blob);
        formData.append('pcFile', fileValues.pcFile.file);
        formData.append('mobileFile', fileValues.mobileFile.file);
        
        const id = formValues.id;
        const apiUrl = `/api/banners/myPage/${id}`;
        const res = await postObjData(apiUrl, formData, 'multipart/form-data');
        console.log(res);
        if (res.isDone) {
          mct.alertShow('마이페이지 배너 수정되었습니다.');
          // onShowModalHandler('마이페이지 배너 수정되었습니다.');
          setIsSubmitted(true);
        } else {
          mct.alertShow(`내부 통신장애입니다. 다시 시도해주세요.\n${res.error}`);
          console.error(res.error)
        }
      }
    } catch (err) {
      alert('ERROR\n', err);
      console.error(err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };
  
  
  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };
  
  // const onShowModalHandler = (message) => {
  //   mct.alertShow();
  //   setModalMessage(message);
  // };
  
  const onGlobalModalCallback = async () => {
    mct.alertHide();
    window.location.reload();
  };
  
  return (
    <>
      <MetaTitle title="마이페이지 배너 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>마이페이지 배너 {isLoading.fetching && <Spinner />}</h1>
          </div>
          <form
            action="/"
            className="cont"
            encType="multipart/form-data"
            method="post"
          >
            <div className="cont_body">
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      배너이름
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        id="name"
                        value={formValues.name || ''}
                        className="fullWidth"
                        onChange={onInputChangeHandler}
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
                    <p className="title">노출여부</p>
                  </div>
                  <div className="inp_section">
                    <CustomRadio
                      setValue={setFormValues}
                      name="status"
                      idList={[exposeType.LEAKED, exposeType.HIDDEN]}
                      labelList={['Y', 'N']}
                      value={formValues.status}
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
                    <p className="title">
                      이미지
                    </p>
                  </div>
                  <div className="inp_section">
                    <label className="inp_wrap file" htmlFor="pcFile">
                      {(fileValues.pcFile?.file || fileValues.pcFile?.url) && (
                        <PreviewImage
                          file={fileValues.pcFile?.file}
                          thumbLink={fileValues.pcFile?.url}
                          objectFit={'cover'}
                          className={`${s["admin-preview-image"]} ${s['pc']}`}
                        />
                      )}
                      <span className="inp_box">
                        <input
                          type="file"
                          id="pcFile"
                          accept="image/*"
                          className="hide"
                          onChange={onFileChangeHandler}
                        />
                        <Fake_input filename={fileValues.pcFile?.filename} />
                      </span>
                    </label>
                    {formErrors.pcFile && (
                      <ErrorMessage>{formErrors.pcFile}</ErrorMessage>
                    )}
                    <div className="desc">* PC 이미지 권장사이즈: 1200 x 60</div>
                  </div>
                </div>
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="pcLinkUrl">
                      연결링크
                      <Tooltip message={'*링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.'} messagePosition={'left'} />
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        id="pcLinkUrl"
                        className="halfWidth"
                        value={formValues.pcLinkUrl || ''}
                        placeholder="ex. https://barfdog.co.kr/path/1"
                        onChange={onInputChangeHandler}
                      />
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
                    <p className="title">
                      이미지
                    </p>
                  </div>
                  <div className="inp_section">
                    <label className="inp_wrap file" htmlFor="mobileFile">
                      {(fileValues.mobileFile?.file || fileValues.mobileFile?.url) && (
                        <PreviewImage
                          file={fileValues.mobileFile?.file}
                          thumbLink={fileValues.mobileFile?.url}
                          objectFit={'cover'}
                          className={`${s["admin-preview-image"]} ${s['mobile']}`}
                        />
                      )}
                      <span className="inp_box">
                        <input
                          type="file"
                          id="mobileFile"
                          accept="image/*"
                          className="hide"
                          onChange={onFileChangeHandler}
                        />
                        <Fake_input filename={fileValues.mobileFile?.filename} />
                      </span>
                    </label>
                    {formErrors.mobileFile && (
                      <ErrorMessage>{formErrors.mobileFile}</ErrorMessage>
                    )}
                    <div className="desc">* 모바일 이미지 권장사이즈: 600 x 50</div>
                  </div>
                </div>
                <div className="input_row multipleLines">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="mobileLinkUrl">
                      연결링크
                      <Tooltip message={'*링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.'} messagePosition={'left'} />
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        id="mobileLinkUrl"
                        className="halfWidth"
                        value={formValues.mobileLinkUrl || ''}
                        placeholder="ex. https://barfdog.co.kr/path/1"
                        onChange={onInputChangeHandler}
                      />
                    </div>
                    {formErrors.mobileLinkUrl && (
                      <ErrorMessage>{formErrors.mobileLinkUrl}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
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
                type="button"
                id="btn-create"
                className="admin_btn confirm_l solid"
                onClick={onSubmit}
              >
                {isLoading.submit ? (
                  <Spinner style={{ color: '#fff', width: '15', height: '15' }} speed={0.6} />
                ) : (
                  '등록'
                )}
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert onClick={isSubmitted && onGlobalModalCallback} background />}
    </>
  );
}