import React from 'react';
import Header from '../header/Header';
import Footer from './Footer';
import TopLineBanner from '/src/components/atoms/TopLineBanner';
import s from './layout.module.scss';

const Layout = ({ id, className, ...props }) => {
  return (
    <main id={id} className={className}>
      <div className={s.top_line_header}>
        <TopLineBanner />
        <Header />
      </div>
      <div className={s.layout_children}>{props.children}</div>
      <Footer />
    </main>
  );
};

// const Layout = ({ children, ...props})=> {
//   return (
//     <main id={props.id} className={props.className}>
//       <TopLineBanner />
//       <Header />
//       {children}
//       <Footer />
//     </main>
//   );
// }

export default Layout;
