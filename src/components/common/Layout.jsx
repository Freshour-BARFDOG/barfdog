import React from 'react';
import Header from '../header/Header';
import Footer from './Footer';
import TopLineBanner from '/src/components/atoms/TopLineBanner';


const Layout = (props)=> {
  return (
    <main>
      <TopLineBanner />
      <Header />
      {props.children}
      <Footer />
    </main>
  );
}

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