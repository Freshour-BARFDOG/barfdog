
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import InputRadio_status from "@src/components/admin/form/InputRadioPackage";
import Fake_input from "@src/components/atoms/fake_input";
import PreviewImage from "@src/components/atoms/PreviewImage";
import SelectTag from "@src/components/atoms/SelectTag";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import rem from '@src/components/atoms/rem';

// import QuillEditor from "@src/components/admin/form/QuillEditor";



// * 이미지: 업로드하는 순간 , Server 저장
// * Submin : JSON 객체만 전달
// * 유효성검사시, Image파일의 존재유무 검사

const UpdateBlogPage = (props) => {


  const router = useRouter();
  const { id } = router.query;
  const REQUEST_URL = `/api/blog/${id}`;

  const originImageList = ['1','197','200']; // 서버로부터 받은 이미지리스트
  const [tempImageIdList, setTempImageIdList] = useState(originImageList || []);

  const [body, setBody] = useState(""); // Quill 에디터의 innerHTML을 담는 state
  const [isLoadedEditor, setIsLoadedEditor] = useState(false);
  const [QuillEditor, setQuillEditor] = useState('');





  useEffect(() => {
    // if (!id) return;
    // (async () => {
    //   const response = await axios
    //     .get(REQUEST_URL, axiosConfig())
    //     .then((res) => {
    //       console.log(res.data);
    //       return res.data;
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //       alert("데이터를 불러올 수 없습니다.");
    //       router.back();
    //       // setModalMessage("데이터를 불러올 수 없습니다.");
    //     });
    //   const formData = {
    //     name: response.name,
    //     targets: response.targets,
    //     status: response.status,
    //     pcLinkUrl: response.pcLinkUrl,
    //     mobileLinkUrl: response.mobileLinkUrl,
    //   };
    //   const fileData = {
    //     pc: {
    //       file: "",
    //       filename: response.filenamePc,
    //       thumbLink: response._links?.thumbnail_pc.href,
    //     },
    //     mobile: {
    //       file: "",
    //       filename: response.filenameMobile,
    //       thumbLink: response._links?.thumbnail_mobile.href,
    //     },
    //   };
    //   setInitialValues({ ...formData, ...fileData });
    //   setFormValues(formData);
    //   setImageFile(fileData);
    // })();
  }, [id, router, REQUEST_URL]);



  useEffect(() => {
    if (document) {
      const QuillEditor = dynamic(() =>
        import("@src/components/admin/form/QuillEditor")
      );
      setIsLoadedEditor(true);
      setQuillEditor(QuillEditor);
    }
  }, []);
  
  // console.log(body);


  
  const [formValues, setFormValues] = useState({
    category: "ALL",
    hasThumb: false,
    innerHTML: "",
    status: 'LEAKED',
  });
  const [imageFile, setImageFile] = useState({});
  const [formErrors, setFormErrors] = useState({});


  const onCategoryHandler = (value) => {
    setFormValues({
      ...formValues,
      category: value,
    });

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
    const filename = file ? file.name : "";
    setImageFile({
      ...imageFile,
      file,
      filename: filename,
      // link:'' , //파일이 없을 경우 : 기존파일 링크 유지
    });
  };



  const onSubmitHandler = (e) => {
    e.preventDefault();


    const curImageIdList = filterImageId(body);
    const imageDatas = compareImageList(tempImageIdList, curImageIdList);

    console.log(imageDatas);
    // ************** 유효성검사 -> JSON데이터 보내기 
    // 현재 body 속에 저장된 이미 지리스트를 비교한다..
    return 
    setFormErrors(validate(formValues));
    if (Object.keys(formErrors).length) return console.error(formErrors);
    postDataToServer();
  };
  // 삭제될 이미지 리스트를 만들어보자





  const filterImageId = (html) => {
    let curimageIdList = [];
    console.log(html);
    const imageQuery = /`#__id=12938__`/;
    // 시작문자열 // 끝나는 문자열
    
    const queryImageTag = html.split("<img");
    const curImageList = 
    queryImageTag.filter((str) => {
      if (str.indexOf("src") < 0) return;
      const imgTag = str.split(">")[0];
      const queryId = "#__id=";
      const imageId = imgTag.split(queryId)[1].split('"')[0]
      curimageIdList.push(imageId);
    });
    return curimageIdList;
  }



  const compareImageList = (tempArr, curArr) => {
    let result = {
      // origin: originImageList,
      temp: [...tempArr],
      cur: [...curArr],
      del: [],
      added: [],
    };

    // console.log(tempArr);
    // console.log(curArr);

    tempArr.map((id) => {
      const isCurArr = curArr.indexOf(id) > 0;
      const isOriginArr = originImageList.indexOf(id) >= 0;
      ( isCurArr && !isOriginArr ) && result.added.push(id);

      const toBeDeleted = curArr.indexOf(id) < 0;
      // * 추가 : origin에 존재하지 않는 경우
      toBeDeleted && result.del.push(id);
    });
    return result;

  };


  const returnToPrevPage = () => {
    if (confirm("이전 페이지로 돌아가시겠습니까?")) {
      router.back();
    }
  };




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
                        name={"category"}
                        id={"category"}
                        onChange={onCategoryHandler}
                        options={[
                          { label: "전체", value: "전체" },
                          { label: "영양", value: "영양" },
                          { label: "건강", value: "건강" },
                          { label: "생애", value: "생애" },
                        ]}
                      />
                      {/* {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row upload_image">
                  <div className="title_section">
                    <p className="title">썸네일</p>
                  </div>
                  <div className="inp_section">
                    <label
                      className="inp_wrap file"
                      htmlFor="upload-image"
                      style={{ display: "inline-block" }}
                    >
                      <PreviewImage
                        file={imageFile.file}
                        ratio={1 / 1}
                        objectFit={"cover"}
                        style={{ width: `${rem(200)}` }}
                      />
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
                        <Fake_input filename={imageFile.filename} />
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
                <div className="input_row">
                  <div className="title_section">
                    <p className="title">상세설명</p>
                  </div>
                  <div className="inp_section">
                    {/* // * --------- QUILL EDITOR --------- * // */}
                    {isLoadedEditor && (
                      <QuillEditor
                        body={body}
                        handleQuillChange={setBody}
                        setTempImageIdList={setTempImageIdList}
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
                <button
                  type="submit"
                  id="btn-create"
                  className="admin_btn confirm_l solid"
                >
                  등록
                </button>
              </div>
            </div>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
};;

export default UpdateBlogPage;


