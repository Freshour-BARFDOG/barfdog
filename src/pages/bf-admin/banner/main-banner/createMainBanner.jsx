import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function createMainBannerPage() {
 return (
   <AdminLayout>
     <AdminContentWrapper>
       <div className="title_main">
         <h1>배너등록</h1>
       </div>
       <div className="inner">
         <div className="inp_wrap">
           <label htmlFor="bannerName">배너이름</label>
           <div className="inp_box" id="bannerName">
             <input type="text" placeholder="" />
           </div>
         </div>
         <div className="inp_wrap">
           <label htmlFor="">노출대상</label>
           <div className="inp_box">
             <input type="Radio" placeholder="" />
           </div>
         </div>
       </div>
     </AdminContentWrapper>
   </AdminLayout>
 );
}

export default createMainBannerPage