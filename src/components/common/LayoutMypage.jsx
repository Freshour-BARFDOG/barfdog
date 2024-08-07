import React from 'react';
import Header from '../header/Header';
import Footer from './Footer';
import TopLineBanner from '/src/components/atoms/TopLineBanner';
import s from './layout.module.scss';

const LayoutMypage = ({ id, className, ...props }) => {
  return (
    <main
      id={id}
      className={`${className} ${s.main_wrapper}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'rgba(249, 249, 249, 1)',
      }}
    >
      <TopLineBanner />
      <Header footer={false} deadLine={true} mode={'mypage'} />
      {props.children}
    </main>
  );
};

export default LayoutMypage;
