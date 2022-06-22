import React, { useEffect, useRef, useState } from 'react';
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

// * Submib : JSON 객체만 전달
// * 유효성검사시, Image파일의 존재유무 검사

const initialFormValues = {
  title: '',
  category: '',
  contents: '', // 블로그 컨텐츠 HTML string
  blogThumbnailId: null, // number
  blogImageIdList: [],
  status: 'LEAKED',
};


const CreateBlogPage = () => {

  const blogDetailImageUploadApiURL = '/api/admin/blogs/image/upload';
  const originImageList = ['1', '10', '100']; // 서버로부터 받은 이미지리스트


  const router = useRouter();
  const [QuillEditor, setQuillEditor] = useState(null);

  const [tempImageIdList, setTempImageIdList] = useState(originImageList || []);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [thumbFile, setThumbFile] = useState({});

  //  INIT QUILL EDITOR
  useEffect(() => {
    if (document) {
      const QuillEditor = dynamic(() => import('/src/components/admin/form/QuillEditor'));
      setQuillEditor(QuillEditor);
      console.log('설치됨');
    }
  }, []);

  console.log(formValues);
  // console.log(tempImageIdList);

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



  const imageFileChangeHandler = (e) => {
    const thisInput = e.currentTarget;
    const file = thisInput.files[0];
    console.log(file);
    const filename = file ? file.name : '';
    setThumbFile({
      ...thumbFile,
      file,
      filename: filename,
      // link:'' , //파일이 없을 경우 : 기존파일 링크 유지
    });
    // Image 업로드 API
    // admin/blogs/thumbnail/upload
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const REQUEST_URL = `/api/admin/blog`;
    const curImageIdList = filterImageId(formValues.contents);
    const imageDatas = compareImageList(tempImageIdList, curImageIdList);
    console.log(curImageIdList);
    console.log(imageDatas);
    return;
    // VALIDATION 해야한다.

    setFormErrors(validate(formValues));
    if (Object.keys(formErrors).length) return console.error(formErrors);
  };





  const filterImageId = (html) => {
    let curimageIdList = [];

    const queryImageTag = html.split('<img');
    queryImageTag.filter((str) => {
      if (str.indexOf('src') < 0) return;
      const imgTag = str.split('>')[0];
      const queryFileData = imgTag.split('?')[1];
      const queryImageData = queryFileData.split('#')[1];
      const id = queryImageData.split('=')[1];
      // console.log('ID: ',id);
      if(id)curimageIdList.push(id);
    });
    return curimageIdList;
  };

  const compareImageList = (tempArr, curArr) => {
    if (!tempArr || !tempArr.length) return console.error('There is no Image File.');


    let result = {
      origin: originImageList,
      temp: [...tempArr],
      cur: [...curArr],
      del: [],
      added: [],
    };

    // console.log(result);

    tempArr.map((id) => {
      const isCurArr = curArr.indexOf(id) >= 0;
      const isOriginArr = originImageList.indexOf(id) >= 0;
      // console.log(id, 'curArr: ', isCurArr);
      // console.log(id, 'isOriginArr: ', isOriginArr);

      const isNew = isCurArr && !isOriginArr
      isNew && result.added.push(id);

      const isToBeDeleted = curArr.indexOf(id) < 0;
      // * 추가 : origin에 존재하지 않는 경우
      isToBeDeleted && result.del.push(id);
    });
    return result;
  };






  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

  // if(QuillEditor === null) return;

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
                    <p className="title">썸네일</p>
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
                          objectFit={'cover'}
                          style={{ width: `${rem(200)}` }}
                        />
                      )}

                      <span className="inp_box">
                        <input
                          type="file"
                          data-type="file"
                          id="upload-image"
                          name="imageFile"
                          accept="image/*"
                          className="hide"
                          multiple={false}
                          onChange={imageFileChangeHandler}
                        />
                        <Fake_input filename={thumbFile.filename} />
                        {/* {formErrors.file_pc && (
                          <ErrorMessage>{formErrors.file_pc}</ErrorMessage>
                        )} */}
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
                        setFormValues={setFormValues}
                        setImageList={setTempImageIdList}
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
