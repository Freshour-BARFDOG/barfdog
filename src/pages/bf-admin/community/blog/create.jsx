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
import {postFileUpload} from "/api/reqData";
import Spinner from "/src/components/atoms/Spinner";


/*
* - 유효성검사 (이제 form 업로드는 끝났다)
*/



const imageListFromServer = ['1', '10', '100']; // 서버로부터 받은 이미지리스트

const initialFormValues = {
  title: '',
  category: '',
  contents: '', // 블로그 컨텐츠 HTML string
  blogThumbnailId: null, // number
  blogImageIdList: imageListFromServer.length ? imageListFromServer : [] , // 서버에서 받은 기존 이미지 리스트
  status: 'LEAKED',
};


const CreateBlogPage = () => {

  const blogDetailImageUploadApiURL = '/api/admin/blogs/image/upload';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState({});
  const [QuillEditor, setQuillEditor] = useState(null);
  const originImageList = initialFormValues.blogImageIdList;
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [thumbFile, setThumbFile] = useState({});




  //  INIT QUILL EDITOR
  useEffect(() => {
    if (document) {
      const QuillEditor = dynamic(() => import('/src/components/admin/form/QuillEditor'));
      setQuillEditor(QuillEditor);
      console.log('Editor init is complete.');
    }
  }, []);




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

    if(!file){

      setFormValues(prevState => ({
        ...prevState,
        blogThumbnailId: ''
      }));
      setFormErrors(prevState => ({
        ...prevState,
        thumb: '필수항목입니다.'
      }));
      setThumbFile({
        ...thumbFile,
        file: '',
        filename: '',
      });

      return;
    }

    try {
      setIsLoading(prevState => ({
        ...prevState,
        thumb: '업로드 중'
      }));
      const formData = new FormData();
      formData.append('file', file);
      const thumbApiURL = '/api/admin/blogs/thumbnail/upload';
      const response = await postFileUpload(thumbApiURL, formData);
      console.log(response);
      const thumbId = response.data.id;
      const isFaild = response.status !== 200 && response.status !== 201;
      setFormValues(prevState => ({
        ...prevState,
        blogThumbnailId: thumbId
      }));
      setFormErrors(prevState => ({
        ...prevState,
        thumb: isFaild && '업로드에 실패했습니다. 파일형식을 확인하세요.'
      }));
      setThumbFile({
        ...thumbFile,
        file: !isFaild && file,
        filename: !isFaild && filename,
      });
    } catch (err) {
        alert(`에러가 발생했습니다.\n${err}`);
    }

    setIsLoading(prevState => ({
      ...prevState,
      thumb: false
    }))
  };



  const onSubmitHandler = (e) => {
    e.preventDefault();
    // const curImageIdList = filterImageId(formValues.contents);
    // // const imageDatas = compareImageList(tempImageIdList, curImageIdList);
    // const imageDatas = compareImageList(formValues.blogImageIdList, curImageIdList);


    // console.log(curImageIdList);
    // console.log(imageDatas);

    console.log(formValues);

    return;
    // -  VALIDATION 해야한다. (22.06.22 저녁)
    const REQUEST_URL = `/api/admin/blog`;
    setFormErrors(validate(formValues));
    if (Object.keys(formErrors).length) return console.error(formErrors);
  };





  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };


  return (
    <>
      <MetaTitle title="블로그 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>블로그 생성</h1>
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
                      />
                      {/* {formErrors.category && (
                        <ErrorMessage>{formErrors.category}</ErrorMessage>
                      )} */}
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
                    <p className="title">
                      <em style={{marginRight:'8px'}}>썸네일</em>
                      {isLoading.thumb &&
                      <Spinner
                        style={{ color: 'var(--color-main)', width: '15', height: '15' }}
                        speed={0.6}
                      />}</p>

                  </div>
                  <div className="inp_section">
                    <label
                      className="inp_wrap file"
                      htmlFor="upload-image"
                      style={{ display: 'inline-block' }}
                    >
                      {thumbFile.file && (
                        <PreviewImage
                          file={thumbFile.file}
                          ratio={1 / 1}
                          objectFit={'contain'}
                          style={{ width: `${rem(200)}` }}
                        />
                      )}

                      <span className="inp_box">
                        <input
                          type="file"
                          id="upload-image"
                          accept="image/*"
                          className="hide"
                          multiple={false}
                          onChange={imageFileChangeHandler}
                        />
                        <Fake_input filename={thumbFile.filename} />
                        {formErrors.thumb && (
                          <ErrorMessage>{formErrors.thumb}</ErrorMessage>
                        )}
                      </span>
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
                    {/* // * --------- QUILL EDITOR --------- * // */}
                    {QuillEditor && (
                      <QuillEditor
                        id={'contents'}
                        imageId={'blogImageIdList'}
                        originImageList={originImageList}
                        setFormValues={setFormValues}
                        imageUploadApiURL={blogDetailImageUploadApiURL}
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
                <button type="submit" id="btn-create" className="admin_btn confirm_l solid">
                  등록
                </button>
              </div>
            </div>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
};

export default CreateBlogPage;


//
//
// const validate =  ()=>{
//
// }
