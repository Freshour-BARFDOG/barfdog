import React from 'react';
import Header from '../header/Header';
import Footer from './Footer';
import TopLineBanner from '/src/components/atoms/TopLineBanner';

const LayoutMypage = ({ id, className, ...props }) => {
  return (
    <main
      id={id}
      className={className}
      style={{
        position: 'relative',
        width: '600px',
        minHeight: '100dvh',
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
