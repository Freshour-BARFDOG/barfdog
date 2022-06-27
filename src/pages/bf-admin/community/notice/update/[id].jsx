import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {getData, putObjData} from "/api/reqData";
import {validate} from "/util/func/validation_notice";
import {valid_hasFormErrors} from "/util/func/validationPackage";
import CustomRadio from "/src/components/admin/form/CustomRadio";
import Spinner from "/src/components/atoms/Spinner";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import {useModalContext} from "/store/modal-context";



const UpdateNoticePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const getDataApiUrl = `/api/admin/notices/${id}`;
  const postDataApiUrl = `/api/admin/notices/${id}`;
  const imageUploadApiURL = '/api/admin/blogs/image/upload';

  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [QuillEditor, setQuillEditor] = useState(null);
  const [originImageIdList, setOriginImageIdList] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);




  //  INIT QUILL EDITOR
  useEffect(() => {
    if(!id)return;
    (async ()=>{
      const res = await getData(getDataApiUrl);
      console.log(res);
      const DATA = res.data.noticeAdminDto;
      const initialFormValues = {
        title: DATA.title,
        contents: DATA.contents,
        status: DATA.status,
        addImageIdList:[],
        deleteImageIdList: []
      };
      setFormValues(initialFormValues);

      const editorImageDATA = res.data.adminBlogImageDtos; // ! 공지사항과 블로그 이미지 업로드 API 공유함
      const originInnerHTMLImageIdList = editorImageDATA.map((list)=>list.blogImageId)
      setOriginImageIdList(originInnerHTMLImageIdList);


      if (document) {
        const QuillEditor = dynamic(() => import('/src/components/admin/form/QuillEditor'));
        setQuillEditor(QuillEditor);
        console.log('Editor init is complete.');
      }
    })();

  }, [id]);




  const onInputChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };






  const onSubmit = async (e) => {
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
      const res = await putObjData(postDataApiUrl, objData);

      if(res.isDone){
        onShowModalHandler('공지사항이 수정되었습니다.');
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
      <MetaTitle title="공지사항 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>공지사항 수정</h1>
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
                    <label className="title">
                      제목
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'title'}
                        type="text"
                        className="fullWidth"
                        value={formValues.title || ''}
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
                        mode={'update'}
                        imageId={'noticeImageIdList'}
                        originImageIdList={originImageIdList}
                        setFormValues={setFormValues}
                        imageUploadApiURL={imageUploadApiURL}
                        initialValue={formValues.contents}
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
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background/>
    </>
  );
};;

export default UpdateNoticePage;


