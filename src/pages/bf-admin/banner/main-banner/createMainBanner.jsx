import React, { useState, useRef, useEffect, useCallback } from "react";
import MetaTitle from "@src/components/atoms/MetaTitle";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import InputRadio from "./InputRadio";
import Fake_input from "./fake_input";
import PreviewImage from './PreviewImage';
import axios from 'axios';



///할것 04.22
// 1. 유효성검사 --> 빈항목있으면 에러
// 2. 연결링크 regex 정규표현식 



function CreateMainBannerPage() {
  const [name, setName] = useState('');
  const [exposedTarget, setExposedTarget] = useState('all');
  const [file_PC, setFile_PC] = useState({
    file:'',
    filename: '',
    link: '',
  });
  const [file_Mobile, setFile_Mobile] = useState({
    file: "",
    filename: "",
    link: "",
  });




  const getNameHandler = (e) => {
    const inp = e.currentTarget;
    const val = inp.value;
    setName(val);
  }

  const getExposedTargetHandler = (data) => {
    setExposedTarget(data);
  };


  const imageFileChangeHandler = (e) => {
    const thisInput = e.currentTarget;
    const file = thisInput.files[0];
    const filename = file ? file.name : "";
    if (thisInput.dataset.device === "pc") {
      setFile_PC({ ...file_PC, file: file, filename });
    } else {
      setFile_Mobile({ ...file_Mobile, file: file, filename });
    }
  };


  const getLinkHandler = (e) => {
    const thisInput = e.currentTarget;
    const link = thisInput.value;

    if (thisInput.dataset.device === "pc") {
      setFile_PC({ ...file_PC, link });
    } else {
      setFile_Mobile({ ...file_Mobile, link });
    }
  }
  

  const submitTotalData = () => {
    console.log(name);
    console.log(exposedTarget);
    console.log(file_PC);
    console.log(file_Mobile);
  };



 return (
   <>
     <MetaTitle title="메인배너 > Create" />
     <AdminLayout>
       <AdminContentWrapper>
         <div className="title_main">
           <h1>배너등록</h1>
         </div>
         <form className="cont">
           <div className="cont_divider">
             <div className="input_row">
               <div className="title_section">
                 <label className="title" htmlFor="banner-name">
                   배너이름
                 </label>
               </div>
               <div className="inp_section">
                 <div className="inp_box">
                   <input
                     type="text"
                     id="banner-name"
                     className="fullWidth"
                     onChange={getNameHandler}
                   />
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
                 <InputRadio
                   dataList={exposedTarget}
                   exposedTarget={exposedTarget}
                   onExposedTargetHandler={getExposedTargetHandler}
                 />
               </div>
             </div>
           </div>
           {/* cont_divider */}
           <div className="cont_divider">
             <h5 className="cont_divider_title">
               <b>PC</b>
             </h5>
             <div className="input_row upload_image">
               <div className="title_section">
                 <p className="title">이미지</p>
               </div>
               <div className="inp_section">
                 <label className="inp_wrap file" htmlFor="upload-image-pc">
                   <PreviewImage file={file_PC.file} />
                   <span className="inp_box">
                     <input
                       type="file"
                       id="upload-image-pc"
                       accept="image/*"
                       className="hide"
                       data-device="pc"
                       multiple={true}
                       onChange={imageFileChangeHandler}
                     />
                     <Fake_input filename={file_PC.filename} />
                   </span>
                 </label>
               </div>
             </div>
             <div className="input_row upload_image">
               <div className="title_section">
                 <label className="title" htmlFor="link-image-pc">
                   연결링크
                 </label>
               </div>
               <div className="inp_section">
                 <span className="inp_box">
                   <input
                     type="text"
                     id="link-image-pc"
                     className="halfWidth"
                     data-device="pc"
                     onChange={getLinkHandler}
                   />
                 </span>
               </div>
             </div>
           </div>
           {/* cont_divider */}
           <div className="cont_divider">
             <h5 className="cont_divider_title">
               <b>Mobile</b>
             </h5>
             <div className="input_row upload_image">
               <div className="title_section">
                 <p className="title" htmlFor="upload-image-mobile">
                   이미지
                 </p>
               </div>
               <div className="inp_section">
                 <label className="inp_wrap file" htmlFor="upload-image-mobile">
                   <PreviewImage file={file_Mobile.file} />
                   <span className="inp_box">
                     <input
                       type="file"
                       id="upload-image-mobile"
                       accept="image/*"
                       className="hide"
                       data-device="mobile"
                       multiple={false}
                       onChange={imageFileChangeHandler}
                     />
                     <Fake_input filename={file_Mobile.filename} />
                   </span>
                 </label>
               </div>
             </div>
             <div className="input_row upload_image">
               <div className="title_section">
                 <label className="title" htmlFor="link-image-mobile">
                   연결링크
                 </label>
               </div>
               <div className="inp_section">
                 <span className="inp_box">
                   <input
                     type="text"
                     id="link-image-mobile"
                     className="halfWidth"
                     data-device="mobile"
                     onChange={getLinkHandler}
                     value={file_Mobile.link}
                   />
                 </span>
               </div>
             </div>
           </div>
           {/* cont_divider */}
         </form>
         {/* cont */}
         <div className="cont-bottom">
           <div className="btn_section">
             <button
               type="button"
               id="btn-cancle"
               className="admin_btn confirm_l line"
             >
               취소
             </button>
             <button
               type="button"
               id="btn-create"
               className="admin_btn confirm_l solid"
               onClick={submitTotalData}
             >
               등록
             </button>
             <button type="button" id="btn-update" className="hide">
               수정
             </button>
           </div>
         </div>
       </AdminContentWrapper>
     </AdminLayout>
   </>
 );
}

export default CreateMainBannerPage