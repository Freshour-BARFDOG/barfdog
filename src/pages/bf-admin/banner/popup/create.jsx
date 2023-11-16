import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';

import CustomRadio from '/src/components/admin/form/CustomRadio';
import Fake_input from '/src/components/atoms/fake_input';
import PreviewImage from '/src/components/atoms/PreviewImage';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { useModalContext } from '/store/modal-context';
import { validate } from '/util/func/validation/validation_popup';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { postObjData } from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Tooltip from "../../../../components/atoms/Tooltip";
import s from "./popup.module.scss";

const initialFormValues = {
  name: '',
  status: 'LEAKED',
  position: 'MID',
  pcLinkUrl: '',
  mobileLinkUrl: '',
};

const initialImageFiles = {
  pcFile: {
    file: '',
    filename: '',
    url: '',
  },
  mobileFile: {
    file: '',
    filename: '',
    url: '',
  },
};

function CreatePopupPage() {
  const postFormValuesApiUrl = `/api/banners/popup`;
  const router = useRouter();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [fileValues, setFileValues] = useState(initialImageFiles);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // console.log(formValues);
  // console.log(fileValues);

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
    const filename = file ? file.name : '';
    setFileValues((prevState) => ({
      ...prevState,
      [id]: {
        file,
        filename,
      },
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log('formValues: ', formValues);
    // console.log('fileValues: ', fileValues);
    if (isSubmitted) return;
    const errObj = validate(formValues, fileValues);
    const isPassed = valid_hasFormErrors(errObj);
    setFormErrors(errObj);
    // ! 1. 수정이......... 어떤 값을 넘겨야 수정이 되는 것인지????? (아무 값도 없는 경우)
    // ! 2. 기존에 존재하는 배너를 그대로 업데이트 할 경우, 파일 첨부를 할 수 없음

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      if (isPassed) {
        const jsonData = JSON.stringify(formValues);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const formData = new FormData();
        formData.append('requestDto', blob);
        formData.append('pcFile', fileValues.pcFile.file);
        formData.append('mobileFile', fileValues.mobileFile.file);
        const res = await postObjData(postFormValuesApiUrl, formData, 'multipart/form-data');
        // console.log(res);
        if (res.isDone) {
          onShowModalHandler('팝업이 생성되었습니다.');
          setIsSubmitted(true);
        } else {
          alert(res.error, '\n내부 통신장애입니다. 시도해주세요.');
          console.error(res.error);
        }
      }
    } catch (err) {
      alert('ERROR');
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

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };
  const onGlobalModalCallback = () => {
    mct.alertHide();
    router.push('/bf-admin/banner/popup');
  };

  return (
    <>
      <MetaTitle title="팝업 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>팝업 생성</h1>
          </div>
          <form action="/" className="cont" encType="multipart/form-data" method="post">
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
                        id="name"
                        value={formValues.name || ''}
                        className="fullWidth"
                        onChange={onInputChangeHandler}
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
                    <p className="title">팝업위치</p>
                  </div>
                  <div className="inp_section">
                    <CustomRadio
                      setValue={setFormValues}
                      name="position"
                      idList={['MID', 'LEFT', 'RIGHT']}
                      labelList={['중간', '왼쪽', '오른쪽']}
                      value={formValues.position}
                    />
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <h5 className="cont_divider_title">
                  <b>PC</b>
                </h5>
                <div className="input_row upload1_image multipleLines">
                  <div className="title_section">
                    <p className="title">이미지</p>
                  </div>
                  <div className="inp_section">
                    <label className="inp_wrap file" htmlFor="pcFile">
                      {(fileValues.pcFile?.file || fileValues.pcFile?.url) && (
                        <PreviewImage
                          file={fileValues.pcFile?.file}
                          thumbLink={fileValues.pcFile?.url}
                          objectFit={'contain'}
                          ratio={1}
                          style={{ maxWidth: '600px' }}
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
                    {formErrors.pcFile && <ErrorMessage>{formErrors.pcFile}</ErrorMessage>}
                    <div className="desc">* PC 이미지 권장사이즈: 600 x 600</div>
                  </div>
                </div>
                <div className="input_row multipleLines">
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
                    {formErrors.pcLinkUrl && <ErrorMessage>{formErrors.pcLinkUrl}</ErrorMessage>}
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
                    <p className="title">이미지</p>
                  </div>
                  <div className="inp_section">
                    <label className="inp_wrap file" htmlFor="mobileFile">
                      {(fileValues.mobileFile?.file || fileValues.mobileFile?.url) && (
                        <PreviewImage
                          file={fileValues.mobileFile?.file}
                          thumbLink={fileValues.mobileFile?.url}
                          objectFit={'contain'}
                          ratio={1}
                          style={{ maxWidth: '560px' }}
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
                    {formErrors.mobileFile && <ErrorMessage>{formErrors.mobileFile}</ErrorMessage>}
                    <div className="desc">* 모바일 이미지 권장사이즈: 560 x 560</div>
                  </div>
                </div>
                <div className="input_row multipleLines">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="link-image-mobile">
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
                        placeholder="ex. https://barfdog.co.kr/path/mobile"
                        onChange={onInputChangeHandler}
                      />
                    </div>
                    {formErrors.mobileLinkUrl && (
                      <ErrorMessage>{formErrors.mobileLinkUrl}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section">
                    <p className="title">노출여부</p>
                  </div>
                  <div className="inp_section">
                    <CustomRadio
                      setValue={setFormValues}
                      name="status"
                      idList={['LEAKED', 'HIDDEN']}
                      labelList={['Y', 'N']}
                      value={formValues.status}
                    />
                  </div>
                </div>
              </div>
              {/* cont_divider */}
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
                {isLoading.submit ? <Spinner style={{ color: '#fff' }}/> :'등록'}
              </button>
            </div>
          </div>
          {/* cont */}
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default CreatePopupPage;
