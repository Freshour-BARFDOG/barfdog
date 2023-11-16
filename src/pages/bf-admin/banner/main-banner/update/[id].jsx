import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import axiosConfig from '/src/pages/api/axios/axios.config';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import Fake_input from '/src/components/atoms/fake_input';
import PreviewImage from '/src/components/atoms/PreviewImage';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { validate } from '/util/func/validation/validation_mainBanner';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';
import { postObjData } from '/src/pages/api/reqData';
import CustomRadio from "/src/components/admin/form/CustomRadio";
import {exposeTargetTYPE} from "/store/TYPE/exposeTargetTYPE";
import s from "../mainBanner.module.scss";

export default function UpdateMainBannerPage() {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const { id } = router.query;

  const [initialValues, setInitialValues] = useState({});
  const [formValues, setFormValues] = useState({});
  const [imageFile, setImageFile] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState({});
  const targetIdList = Object.keys(exposeTargetTYPE).filter(key=>key !== 'KOR');
  const targetLabelList = Object.values(exposeTargetTYPE.KOR).map(label=>label);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));

      try {
        const apiUrl = `/api/banners/main/${id}`;
        const data = await axios
          .get(apiUrl, axiosConfig())
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            console.error(err);
            alert('데이터를 불러올 수 없습니다.');
            router.back();
          });
        // console.log(data)
        const formData = {
          name: data.name,
          targets: data.targets,
          status: data.status,
          pcLinkUrl: data.pcLinkUrl,
          mobileLinkUrl: data.mobileLinkUrl,
        };
        const fileData = {
          pc: {
            file: '',
            filename: data.filenamePc,
            thumbLink: data._links?.thumbnail_pc.href,
          },
          mobile: {
            file: '',
            filename: data.filenameMobile,
            thumbLink: data._links?.thumbnail_mobile.href,
          },
        };
        setInitialValues({ ...formData, ...fileData });
        setFormValues(formData);
        setImageFile(fileData);
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [id, router]);

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const value = input.value;
    const type = input.type && input.dataset.type;
    const name = input.name;
    if (type === 'link') {
      const device = input.dataset.device === 'pc' ? 'pc' : 'mobile';
      const query = `${device}LinkUrl`;
      setFormValues({
        ...formValues,
        [query]: value,
      });
    } else if (name === 'name') {
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
    const filename = file ? file.name : '';
    const device = thisInput.dataset.device === 'pc' ? 'pc' : 'mobile';
    setImageFile({
      ...imageFile,
      [device]: {
        file,
        filename: file ? filename : initialValues[device].filename,
        thumbLink: file ? '' : initialValues[device].thumbLink, //파일이 없을 경우 : 기존파일 링크 유지
      },
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (submitted) {
      alert('이미 제출된 양식입니다.');
      window.location.reload();
    }
    const errObj = validate(formValues);
    const isPassed = valid_hasFormErrors(errObj);
    setFormErrors(errObj);
    if (!isPassed) return mct.alertShow('유효하지 않은 항목이 있습니다.');
    // * POST LIST:  1.JSON  2.파일(이미지) 3. 파일(이미지 모바일)
    // * 파일이 없을경우 , 기존 파일 그대로 유지 처리 요청
    const jsonData = JSON.stringify(formValues);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const formData = new FormData();
    formData.append('requestDto', blob);
    formData.append('pcFile', imageFile.pc?.file);
    formData.append('mobileFile', imageFile.mobile?.file);

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const apiUrl = `/api/banners/main/${id}`;
      const res = await postObjData(apiUrl, formData, 'multipart/form-data');
      if (res.isDone) {
        setSubmitted(true);
        mct.alertShow('배너등록이 완료되었습니다.');
        setTimeout(() =>{
          onSuccessCallback();
        },1000)
      } else {
        mct.alertShow('데이터 전송에 실패하였습니다.');
      }
    } catch (err) {
      alert('데이터 전송실패\nERROR STATUS:',err.response.status);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onModalHide = () => {
    mct.alertHide(null);
  };

  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };
  
  const onSuccessCallback = ()=>{
    window.location.href = '/bf-admin/banner/main-banner';
  }
  
  // console.log(formValues)
  

  return (
    <>
      <MetaTitle title="메인배너 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              메인배너 수정
              {isLoading.fetching && <Spinner />}
            </h1>
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
                      배너이름
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        name="name"
                        className="fullWidth"
                        onChange={onInputChangeHandler}
                        value={formValues.name || ''}
                      />
                      {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
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
                    <div className="inp_box">
                      <CustomRadio
                        name="targets"
                        idList={targetIdList}
                        labelList={targetLabelList}
                        value={formValues.targets}
                        setValue={setFormValues}
                      />
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
                    <div className="inp_box">
                      <CustomRadio
                        name="status"
                        idList={['LEAKED', 'HIDDEN']}
                        labelList={['노출','숨김']}
                        value={formValues.status}
                        setValue={setFormValues}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <h5 className="cont_divider_title">
                  <b>PC</b>
                </h5>
                <div className="input_row multipleLines">
                  <div className="title_section">
                    <p className="title">이미지</p>
                  </div>
                  <div className="inp_section">
                    <label className="inp_wrap file" htmlFor="upload-image-pc">
                      <PreviewImage
                        file={imageFile.pc?.file}
                        thumbLink={imageFile.pc?.thumbLink}
                        ratio={1920 / 400}
                        className={`${s["admin-preview-image"]} ${s['pc']}`}
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
                        {formErrors.file_pc && <ErrorMessage>{formErrors.file_pc}</ErrorMessage>}
                      </span>
                    </label>
                    <div className="desc">* PC 이미지 권장사이즈: 1920 x 400</div>
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
                        value={formValues.pcLinkUrl || ''}
                        placeholder="ex. https://barfdog.co.kr/event/1"
                        onChange={onInputChangeHandler}
                      />
                    </div>
                    <div className="desc">
                      *링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.
                    </div>
                    {formErrors.pcLinkUrl && <ErrorMessage>{formErrors.pcLinkUrl}</ErrorMessage>}
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <h5 className="cont_divider_title">
                  <b>Mobile</b>
                </h5>
                <div className="input_row multipleLines">
                  <div className="title_section">
                    <p className="title" htmlFor="upload-image-mobile">
                      이미지
                    </p>
                  </div>
                  <div className="inp_section">
                    <label className="inp_wrap file" htmlFor="upload-image-mobile">
                      <PreviewImage
                        file={imageFile.mobile?.file}
                        thumbLink={imageFile.mobile?.thumbLink}
                        ratio={600 / 600}
                        className={`${s["admin-preview-image"]} ${s['mobile']}`}
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
                    <div className="desc">* 모바일 이미지 권장사이즈: 600 x 600</div>
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
                        onChange={onInputChangeHandler}
                        value={formValues.mobileLinkUrl || ''}
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
                <button type="submit" id="btn-update" className="admin_btn confirm_l solid">
                  {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '수정'}
                </button>
              </div>
            </div>
          </form>
          {/* cont */}
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert onClick={submitted ? onSuccessCallback : onModalHide} background />}
    </>
  );
}
