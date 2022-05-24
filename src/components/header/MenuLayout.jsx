import Link from 'next/link';
import React, { useState } from 'react';
import s from './submenu.module.scss';
import Image from 'next/image';







export const Title = ( {children, link} ) => {

  return link ? <Link href={link}><a className={`${s.submenu_title} flex-box`}>{children}</a></Link> : <p className={`${s.submenu_title} flex-box`}>{children}</p>;
}







export const SubmenuList = ( {link, title}) => {
  const URL = link ? link : '#';
  return <li><Link href={URL} passHref>{title}</Link></li>;
}










function MenuLayout({title, className, link, addedIcon,  children}) { 
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const mouseEnterEvent = (e) => {
    setSubmenuOpen(true);
  };

   const mouseLeaveEvent = (e) => {
    setSubmenuOpen(false);
  };

 
  const Submenu = () => {
    return (
      <ul className={`${s.submenu} ${submenuOpen ? s.open : ""} ${className}`}
      onMouseLeave={mouseLeaveEvent}>
        {children}
      </ul>
    )
  }


  return (
    <li
      className={s.menu_wrapper}
      onMouseEnter={mouseEnterEvent}
      // onMouseLeave={mouseLeaveEvent}
    >
      <Title link={link}>{title}</Title>
      {addedIcon ? (
        <Image
          src={addedIcon.src}
          alt="아이콘"
          width={addedIcon.width}
          height={addedIcon.height}
        />
      ) : null}
      {children ? <Submenu /> : ""}
    </li>
  );
}


export default MenuLayout;