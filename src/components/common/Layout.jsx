import React from 'react';
import Header from './Header';
import Footer from "./Footer";
import TopLineBanner from '../TopLineBanner';


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

export default Layout;