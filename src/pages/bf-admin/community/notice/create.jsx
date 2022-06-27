import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {useModalContext} from "/store/modal-context";
import {validate} from "/util/func/validation_notice";
import {valid_hasFormErrors} from "/util/func/validationPackage";
import {postObjData} from "/api/reqData";
import CustomRadio from "/src/components/admin/form/CustomRadio";
import Spinner from "/src/components/atoms/Spinner";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";



const initialFormValues = {
  title: '',
  contents: '',
  noticeImageIdList: [],
  status: 'LEAKED',
};


function CreateNoticePage() {
  const noticeImageUploadApiURL = '/api/admin/blogs/image/upload'; // ! 공지사항과 블로그 Editor내부의 이미지 업로드 API 동일
  const router = useRouter();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [QuillEditor, setQuillEditor] = useState(null);
  const [originImageIdList, setOriginImageIdList] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (document) {
      const QuillEditor = dynamic(() => import('/src/components/admin/form/QuillEditor'));
      setQuillEditor(QuillEditor);
      console.log('Editor init is complete.');
    }
  }, []);




  const onInputChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };




  const onSubmit = async (e) => {
  const postURL = `/api/admin/notices`;
  console.log(formValues)
    e.preventDefault();
    if(isSubmitted)return; // ! IMPORTANT : create Event후, 사용자가 enter를 쳤을 경우, 똑같은 요청이 전송되지 않게 하기 위해서 필요함.

    const errObj = validate(formValues);

    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if(!isPassed) return;
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const objData = formValues;
      const res = await postObjData(postURL, objData);

      if(res.isDone){
        onShowModalHandler('공지사항이 생성되었습니다.');
        setIsSubmitted(true);
      }else {
        alert(`${res.error}`);
      }
    } catch (err) {
      console.log('API통신 오류 : ', err);
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


  const onShowModalHandler = (message)=>{
    mct.alertShow();
    setModalMessage(message);
  }


  const onGlobalModalCallback = ()=>{
    mct.alertHide();
    router.push('/bf-admin/community/notice');
  }



  return (
    <>
      <MetaTitle title="공지사항 작성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>공지사항 생성</h1>
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
                    <label className="title">제목</label>
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
                      {formErrors.title && (
                      <ErrorMessage>{formErrors.title}</ErrorMessage>)}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row multipleLines">
                  <div className="title_section">
                    <p className="title">내용</p>
                  </div>
                  <div className="inp_section">
                    {formErrors.contents && <ErrorMessage>{formErrors.contents}</ErrorMessage>}
                    {/* // * --------- QUILL EDITOR --------- * // */}
                    {QuillEditor && (
                      <QuillEditor
                        id={'contents'}
                        mode={'create'}
                        imageId={'noticeImageIdList'}
                        originImageIdList={originImageIdList}
                        setFormValues={setFormValues}
                        imageUploadApiURL={noticeImageUploadApiURL}
                      />
                    )}
                    {/* // * --------- QUILL EDITOR --------- * // */}
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
                      idList={['LEAKED', 'HIDDEN']}
                      labelList={['노출', '숨김']}
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
                  type="submit"
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
          </form>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default CreateNoticePage;
