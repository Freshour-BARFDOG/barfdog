import React from 'react';
import s from './adminWrapper.module.scss';

export const AdminContentWrapper = ({ className, ...props }) => {
  return (
    <div
      className={`${s.container_outer} ${s.contents_container_outer}`}
      {...props}
    >
      <div className={s.contents_container}>
        <div className={`${s.contents_row} ${className ? className : ''}`}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export const AdminBodyWrapper = ({ children, folded }) => {
  return (
    <div className={`${s.body_container} ${folded ? s.folded : ''}`}>
      {children}
    </div>
  );
};

export default function AdminWrapper({ children }) {
  return (
    <div className={s.container_outer}>
      <div className={s.container}>
        <div className={s.row}>{children}</div>
      </div>
    </div>
  );
}
