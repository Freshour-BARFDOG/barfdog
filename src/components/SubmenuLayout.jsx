import Link from 'next/link';
import React, { useState } from 'react';
import s from '/styles/css/Submenu.module.scss';




export const Title = ( {children } ) => {
  return <p className={`${s.submenu_title} flex-box`}>{children}</p>;
}



export const SubmenuList = ( {link, title}) => {
  const URL = link ? link : '#';
    //  : <a>{title}</a>;
  return <li><Link href={URL} passHref>{title}</Link></li>;
}






function SubmenuLayout(props) { 
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const mouseEnterEvent = (e) => {
    setSubmenuOpen(true);
  };

   const mouseLeaveEvent = (e) => {
    setSubmenuOpen(false);
  };


  const Submenu = () => {
    return (
      <ul className={`${s.submenu} ${submenuOpen ? s.open : ""}`}
      onMouseLeave={mouseLeaveEvent}>
        {props.children}
      </ul>
    )
  }

  return (
      <li
      className={s.submenu_wrapper}
      onMouseEnter={mouseEnterEvent}
      // onMouseLeave={mouseLeaveEvent}
      >
        <Title>{props.title}</Title>
        {props.children? <Submenu/> : ''}
    </li> 
  );
}


export default SubmenuLayout;