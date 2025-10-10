import React from 'react';
import Header from '../header/Header';
import Footer from './Footer';
import TopLineBanner from '/src/components/atoms/TopLineBanner';


const Layout = ({ id, className, showFooter = true, showDeadlineTimer = true, ...props }) => {
  return (
    <main id={id} className={className}>
      <TopLineBanner />
      <Header showDeadlineTimer={showDeadlineTimer} />
      {props.children}
      {showFooter && <Footer />}
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