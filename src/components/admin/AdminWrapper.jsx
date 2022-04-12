import React from "react";
import s from "/styles/css/AdminWrapper.module.scss";

function AdminWrapper(props) {
  return (
    <div className={s.container__outer}>
      <div className={s.container}>
        <div className={s.row}>{props.children}</div>
      </div>
    </div>
  );
}

export default AdminWrapper;
