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
    buttonLink: null,
  },
}) => {
  return (
    <>
      <div className={s['empty-cont-box']}>
        <div className={s.inner}>
          <pre className={s.text}>{message}</pre>
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
