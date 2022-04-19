import React from "react";
import s from "/styles/admin/adminWrapper.module.scss";


export const AdminContentWrapper = ({ children, className }) => {
  return (
    <div
      className={`${s.container_outer} ${s.contents_container_outer}`}
    >
      <div className={s.contents_container}>
        <div className={`${s.contents_row} ${className}`}>{children}</div>
      </div>
    </div>
  );
};


export const AdminBodyWrapper = ({ children }) => {
  return <div className={s.body_container}>{children}</div>;
};



export default function AdminWrapper({children}) {
  return (
    <div className={s.container_outer}>
      <div className={s.container}>
        <div className={s.row}>{children}</div>
      </div>
    </div>
  );
}
