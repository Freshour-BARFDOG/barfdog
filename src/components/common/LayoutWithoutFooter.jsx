import React from 'react';
import Header from '../header/Header';
import TopLineBanner from '/src/components/atoms/TopLineBanner';
import s from './layout.module.scss';

const LayoutWithoutFooter = ({ id, className, ...props }) => {
  return (
    <main
      id={id}
      className={`${className} ${s.main_wrapper}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <TopLineBanner />
      <Header deadLine={false} footer={false} />
      {props.children}
    </main>
  );
};

export default LayoutWithoutFooter;
