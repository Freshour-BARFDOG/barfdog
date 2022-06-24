import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import InputRadio_status from '/src/components/admin/form/InputRadioPackage';
import Fake_input from '/src/components/atoms/fake_input';
import PreviewImage from '/src/components/atoms/PreviewImage';
import SelectTag from '/src/components/atoms/SelectTag';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import rem from '/util/func/rem';
import {getData, postFileUpload, putObjData} from '/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import { validate } from '/util/func/validation_blog';
import { valid_hasFormErrors } from '/util/func/validationPackage';
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import { useModalContext } from "/store/modal-context";





export default function UpdateBlogPage () {
  const router = useRouter();
  const {id} = router.query;
  const apiUrl = `/api/admin/blogs/${id}`;
  const imageUploadApiURL = '/api/admin/blogs/image/upload';

  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [QuillEditor, setQuillEditor] = useState(null);
  const [originImageIdList, setOriginImageIdList] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [thumbFile, setThumbFile] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);


  // console.log(formValues)

  //  INIT QUILL EDITOR
  useEffect(() => {
    if(!id)return;
    (async ()=>{
      const res = await getData(apiUrl);
      const DATA = res.data.blogAdminDto;
      const initialFormValues = {
        title: DATA.title,
        category: DATA.category,
        contents: DATA.contents,
        thumbnailId: DATA.thumbnailId,
        status: DATA.status,
        addImageIdList:[],
        deleteImageIdList: []
      };
      setFormValues(initialFormValues);


      const editorImageDATA = res.data.adminBlogImageDtos;
      const originInnerHTMLImageIdList = editorImageDATA.map((list)=>list.blogImageId)
      console.log(res)
      setOriginImageIdList(originInnerHTMLImageIdList);

      setThumbFile({
        file: '',
        filename: DATA.filename,
        thumbnailUrl: DATA.thumbnailUrl,
        id: DATA.thumbnailId,
      })


      if (document) {
        const QuillEditor = dynamic(() => import('/src/components/admin/form/QuillEditor'));
        setQuillEditor(QuillEditor);
        console.log('Editor init is complete.');
      }

    })();

  }, [id]);



  const onInputChangeHandler = (e) => {
    const isCategory = typeof e !== 'object';
    if (isCategory) {
      const value = e;
      setFormValues({
        ...formValues,
        category: value,
      });
    } else {
      const { id, value } = e.currentTarget;
      setFormValues({
        ...formValues,
        [id]: value,
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



  const imageFileChangeHandler = async (e) => {
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
      const thumbApiURL = '/api/admin/blogs/thumbnail/upload';
      const response = await postFileUpload(thumbApiURL, formData);
      const thumbId = response.data.id;
      const isFaild = response.status !== 200 && response.status !== 201;
      setFormValues((prevState) => ({
        ...prevState,
        thumbnailId: thumbId,
      }));
      setFormErrors((prevState) => ({
        ...prevState,
        thumbnailId: isFaild && '업로드에 실패했습니다. 파일형식을 확인하세요.',
      }));
      setThumbFile({
        ...thumbFile,
        file: !isFaild && file,
        filename: !isFaild && filename,
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

    // ! IMPORTANT : create Event후, 사용자가 enter를 쳤을 경우, 똑같은 요청이 전송되지 않게 하기 위해서 필요함.
    if(isSubmitted)return;
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
        const res = await putObjData(apiUrl, objData);
        if(res.isDone){
          onShowModalHandler('블로그가 수정되었습니다.');
          setIsSubmitted(true);
        }else {
          alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        }
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

  const moveToPage = (url)=>{
    router.push(url);
  }

  const onShowModalHandler = (message)=>{
    mct.alertShow();
    setModalMessage(message);

  }
  const onGlobalModalCallback = ()=>{
    mct.alertHide();
    moveToPage('/bf-admin/community/blog');
  }


  return (
    <>
      <MetaTitle title="블로그 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>블로그 수정</h1>
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
                    <label className="title" htmlFor="banner-name">
                      카테고리
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <SelectTag
                        name={'category'}
                        id={'category'}
                        onChange={onInputChangeHandler}
                        options={[
                          { label: '카테고리 선택', value: '' },
                          { label: '영양', value: 'NUTRITION' },
                          { label: '건강', value: 'HEALTH' },
                          { label: '생애', value: 'LIFE' },
                        ]}
                        initialValue={formValues.category}
                      />
                      {formErrors.category && <ErrorMessage>{formErrors.category}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor={`title`}>
                      제목
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className={`inp_box`}>
                      <input
                        id={`title`}
                        type="text"
                        className={'fullWidth'}
                        value={formValues.title || ''}
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
                      htmlFor="blogThumbnailId"
                      style={{ display: 'inline-block' }}
                    >
                      {(thumbFile.file || thumbFile.thumbnailUrl) && (
                        <PreviewImage
                          file={thumbFile.file}
                          thumbLink={thumbFile.thumbnailUrl}
                          ratio={1}
                          objectFit={'contain'}
                          style={{ width: `${rem(200)}` }}
                        />
                      )}
                      <span className="inp_box">
                        <input
                          type="file"
                          id="blogThumbnailId"
                          accept="image/*"
                          className="hide"
                          multiple={false}
                          onChange={imageFileChangeHandler}
                        />
                        <Fake_input
                          loadingIcon={
                            isLoading.thumb && (
                              <Spinner
                                style={{ color: 'var(--color-main)', width: '15', height: '15' }}
                                speed={0.6}
                              />
                            )
                          }
                          filename={thumbFile.filename}
                        />
                      </span>
                      {formErrors.blogThumbnailId && (
                        <ErrorMessage>{formErrors.blogThumbnailId}</ErrorMessage>
                      )}
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
                  <div className="inp_section">
                    {formErrors.contents && <ErrorMessage>{formErrors.contents}</ErrorMessage>}
                    {/* // * --------- QUILL EDITOR --------- * // */}
                    {QuillEditor && (
                      <QuillEditor
                        id={'contents'}
                        mode={'update'}
                        imageId={'blogImageIdList'}
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
                    <InputRadio_status
                      name="status"
                      exposedStatus={formValues.status}
                      onRadioButtonHandler={onRadioButtonHandler}
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
                <button type="button" id="btn-create" className="admin_btn confirm_l solid"            onClick={onSubmit}>
                  {isLoading.submit ? (
                    <Spinner
                      style={{ color: '#fff', width: '15', height: '15' }}
                      speed={0.6}
                    />
                  ) : '등록'}
                </button>
              </div>
            </div>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background/>
    </>
  );
};

