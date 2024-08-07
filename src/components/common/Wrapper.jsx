import React from 'react';
import s from './wrapper.module.scss';

// function Wrapper({ children, bgColor , fullWidth, rowStyle, ...props}) {
function Wrapper({
  children,
  className,
  bgColor,
  fullWidth,
  rowStyle,
  overflow,
}) {
  return (
    <div
      className={`${s.container_outer} ${className}`}
      style={{ backgroundColor: bgColor, overflow }}
    >
      <div
        className={`${s.container} ${fullWidth ? s['fullWidth'] : ''}`}
        // style={{ width: props.fullWidth ? "100%" : "" }}
        // style={{ width: "100%" }}
      >
        {/* <div id={props.id} className={`${s.row}`} style={rowStyle}>{children}</div> */}
        <div className={`${s.row}`} style={rowStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Wrapper;
