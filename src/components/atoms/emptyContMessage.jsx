import s from './emptyContMessage.module.scss';
import Link from 'next/link';
import React from 'react';

export const EmptyContMessage = ({
  message,
  options = {
    button: {
      url: '',
      label: '',
    },
  },
  children,
}) => {
  return (
    <>
      <div className={s['empty-cont-box']}>
        <div className={s.inner}>
          { message && <pre className={s.text}>{message}</pre>}
          {children}
          {options.button.url && (
            <Link href={options.button.url} passHref>
              <a className={s.btn}>{options.button.label}</a>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
