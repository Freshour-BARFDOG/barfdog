import React from 'react';
import s from '/styles/css/Wrapper.module.scss';



function Wrapper({ children, bgColor , fullWidth}) {
  return (
    <div
      className={`${s.container_outer}`}
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`${s.container} ${fullWidth ? s["fullWidth"] : ""}`}
        // style={{ width: props.fullWidth ? "100%" : "" }}
        // style={{ width: "100%" }}
      >
        <div className={s.row}>{children}</div>
      </div>
    </div>
  );
}

export default Wrapper;