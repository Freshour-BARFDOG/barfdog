import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import Image from "next/image";


function createMainBannerPage() {
 return (
   <AdminLayout>
     <AdminContentWrapper>
       <div className="title_main">
         <h1>배너등록</h1>
       </div>
       <div className="cont">
         <div className="cont_divider">
           <div className="input_row">
             <div className="title_section">
               <label className="title" htmlFor="banner-name">
                 배너이름
               </label>
             </div>
             <div className="inp_section">
               <div className="inp_box">
                 <input type="text" id="banner-name" className="fullWidth" />
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
               <div className="inp_wrap radio">
                 <span className="inp_box radio">
                   <input type="Radio" id="non-member" name="exposedTarget" />
                   <label htmlFor="non-member">비회원</label>
                 </span>
                 <span className="inp_box radio">
                   <input type="Radio" id="member" name="exposedTarget" />
                   <label htmlFor="member">일반회원</label>
                 </span>
                 <span className="inp_box radio">
                   <input type="Radio" id="subscriber" name="exposedTarget" />
                   <label htmlFor="subscriber">구독회원</label>
                 </span>
               </div>
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
               <label className="title" htmlFor="upload-image-pc">
                 이미지
               </label>
             </div>
             <div className="inp_section">
               <div className="preivew_pc"></div>
               <span className="inp_box">
                 <input type="file" id="upload-image-pc" />
               </span>
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
                 <input type="text" id="link-image-pc" className="halfWidth" />
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
               <label className="title" htmlFor="upload-image-mobile">
                 이미지
               </label>
             </div>
             <div className="inp_section">
               <div className="preivew_pc"></div>
               <span className="inp_box">
                 <input type="file" id="upload-image-mobile" />
               </span>
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
                 />
               </span>
             </div>
           </div>
         </div>
         {/* cont_divider */}
       </div>
       {/* cont */}
       <div className="cont-bottom">
         <div className="btn_section">
           <button
             type="button"
             id="btn-cancle"
             className="admin_btn confirm_l solid solid-plain"
           >
             취소
           </button>
           <button
             type="button"
             id="btn-create"
             className="admin_btn confirm_l solid"
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
 );
}

export default createMainBannerPage