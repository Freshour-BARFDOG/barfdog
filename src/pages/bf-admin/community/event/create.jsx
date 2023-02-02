import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useModalContext } from '/store/modal-context';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import Fake_input from '/src/components/atoms/fake_input';
import PreviewImage from '/src/components/atoms/PreviewImage';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import rem from '/util/func/rem';
import { validate } from '/util/func/validation/validation_event';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import Spinner from '/src/components/atoms/Spinner';
import EventDetailImage from '../../../../components/admin/community/EventDetailImage';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { postFileUpload, postObjData } from '/src/pages/api/reqData';
import s from "./event.module.scss";

const initialFormValues = {
  status: 'LEAKED',
  title: '',
  thumbnailId: null,
  eventImageRequestDtoList: [],
};

const CreateEventPage = () => {
  const postFormValuesApiUrl = `/api/admin/events`;
  const postThumbFileApiUrl = 'api/admin/events/thumbnail';
  const postDetailImageFileApiUrl = 'api/admin/events/image';
  const router = useRouter();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [thumbFile, setThumbFile] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onInputChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const thumbFileChangeHandler = async (e) => {
    // - 파일이 존재하지 않는 경우 -> 삭제 API는 따로 없음
    // - server에서 일정시간마다 찌꺼기 file을 삭제하는 처리하는 방식으로 구현됨
    const thisInput = e.currentTarget;
    const file = thisInput.files[0];
    const filename = file ? file.name : '';

    if (!file) {
      setFormValues((prevState) => ({
        ...prevState,
        thumbnailId: '',
      }));
      setFormErrors((prevState) => ({
        ...prevState,
        thumbnailId: '필수항목입니다.',
      }));
      setThumbFile({
        ...thumbFile,
        file: '',
        filename: '',
      });
      return;
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        thumb: '업로드 중',
      }));
      const formData = new FormData();
      formData.append('file', file);
      const response = await postFileUpload(postThumbFileApiUrl, formData);
      // const response = { //TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
      //   data: { id: Math.floor(Math.random() * 100)},
      //   status: 200,
      // };

      const imageId = response.data.id;
      const isFailed = response.status !== 200 && response.status !== 201;
      setFormValues((prevState) => ({
        ...prevState,
        thumbnailId: imageId,
      }));
      setFormErrors((prevState) => ({
        ...prevState,
        thumbnailId: isFailed && '업로드에 실패했습니다. 파일형식을 확인하세요.',
      }));
      setThumbFile({
        ...thumbFile,
        file: !isFailed && file,
        filename: !isFailed && filename,
      });
    } catch (err) {
      alert(`에러가 발생했습니다.\n${err}`);
    }

    setIsLoading((prevState) => ({
      ...prevState,
      thumb: false,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues);
    // ! IMPORTANT : create Event후, 사용자가 enter를 쳤을 경우, 똑같은 요청이 전송되지 않게 하기 위해서 필요함.
    if (isSubmitted) return;

    const errObj = validate(formValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      if (isPassed) {
        const objData = formValues;
        const res = await postObjData(postFormValuesApiUrl, objData);
        console.log(res);
        // const res = { // TESTTESTTESTTESTTESTTESTTESTTESTTEST
        //   isDone : true,
        //   error: ''
        // }
        if (res.isDone) {
          onShowModalHandler('이벤트가 생성되었습니다.');
          setIsSubmitted(true);
        } else {
          alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        }
      }
    } catch (err) {
      alert('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
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
    router.push('/bf-admin/community/event');
  };
  return (
    <>
      <MetaTitle title="이벤트 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>이벤트 생성</h1>
          </div>
          <main className="cont">
            <div className="cont_body">
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor={'title'}>
                      제목
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'title'}
                        type="text"
                        name="title"
                        className="fullWidth"
                        onChange={onInputChangeHandler}
                      />
                      {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row upload_image multipleLines">
                  <div className="title_section">
                    <p className="title">썸네일</p>
                  </div>

                  <div className="inp_section">
                    <label
                      className="inp_wrap file"
                      htmlFor="thumbnailId"
                      style={{ display: 'inline-block' }}
                    >
                      {(thumbFile.file || thumbFile.thumbnailUrl) && (
                        <div className="desc">* PC 화면</div>
                      )}
                      {(thumbFile.file || thumbFile.thumbnailUrl) && (
                        <PreviewImage
                          file={thumbFile.file}
                          objectFit={'cover'}
                          style={{ width: `${rem(1200)}`, height: `${rem(220)}` }}
                          thumbLink={thumbFile.thumbnailUrl}
                        />
                      )}
                      {(thumbFile.file || thumbFile.thumbnailUrl) && (
                      <div className="desc">* 모바일 화면</div>
                      )}
                      {(thumbFile.file || thumbFile.thumbnailUrl) && (
                        <PreviewImage
                          file={thumbFile.file}
                          objectFit={'cover'}
                          ratio={800 / 220}
                          style={{ width: `${rem(800)}`, height: `${rem(220)}` }}
                          thumbLink={thumbFile.thumbnailUrl}
                          className={`${s["admin-preview-image"]} ${s['mobile']}`}
                           />
                      )}
                      <span className="inp_box">
                        <input
                          type="file"
                          id="thumbnailId"
                          accept="image/*"
                          className="hide"
                          multiple={false}
                          onChange={thumbFileChangeHandler}
                        />
                        <Fake_input
                          filename={thumbFile.filename}
                          loadingIcon={
                            isLoading.thumb && (
                              <Spinner
                                style={{ color: 'var(--color-main)', width: '15', height: '15' }}
                                speed={0.6}
                              />
                            )
                          }
                        />
                      </span>
                      {formErrors.thumbnailId && (
                        <ErrorMessage>{formErrors.thumbnailId}</ErrorMessage>
                      )}
                    <div className="desc">* 이미지 권장사이즈: 1200 x 220</div>
                    <div className="desc">* 이미지 내 텍스트 삽입 안전범위: 800px 이내(1200 x 220 기준, 좌우 여백 각 200)</div>
                    </label>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row multipleLines">
                  <div className="title_section">
                    <p className="title">상세설명</p>
                  </div>
                  <EventDetailImage
                    id={'eventImageRequestDtoList'}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    apiUrl={postDetailImageFileApiUrl}
                  />
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
                      idList={['LEAKED', 'HIDDEN']}
                      labelList={['노출', '숨김']}
                      initIndex={0}
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
          </main>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
};

export default CreateEventPage;
