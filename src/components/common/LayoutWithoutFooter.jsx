import React from 'react';
import Header from '../header/Header';
import TopLineBanner from '/src/components/atoms/TopLineBanner';

const LayoutWithoutFooter = ({ id, className, ...props }) => {
  return (
    <main
      id={id}
      className={className}
      style={{ position: 'relative', width: '600px', overflow: 'hidden' }}
    >
      <TopLineBanner />
      <Header withoutDeadLine={true} />
      {props.children}
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

export default LayoutWithoutFooter;
