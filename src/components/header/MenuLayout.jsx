import Link from 'next/link';
import React, { useState } from 'react';
import s from './submenu.module.scss';
import Image from 'next/image';







export const Title = ( {children, link, className} ) => {

  return link ? <Link href={link}><a className={`${s.submenu_title} flex-box ${className}`}>{children}</a></Link> : <p className={`${s.submenu_title} flex-box ${className}`}>{children}</p>;
}







export const SubmenuList = ( {link, title, className}) => {
  return <li>{link ? <Link href={link || '#'} passHref className={className}>{title}</Link> : <p  className={className}>{title}</p>}</li>;
}










function MenuLayout({title, titleClassName ,className, link, icon,  children}) {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const mouseEnterEvent = (e) => {
    // setSubmenuOpen(true);
  };

   const mouseLeaveEvent = (e) => {
    // setSubmenuOpen(false);
  };

 
  const Submenu = () => {
    return (
      <ul className={`${s.submenu} ${submenuOpen ? s.open : ''} ${className || ''}`}
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
      <Title link={link} className={titleClassName}>{title}</Title>
      {icon &&
        <Image
          src={icon.src}
          alt="아이콘"
          width={icon.width}
          height={icon.height}
        />}
      {children && <Submenu />}
    </li>
  );
}


export default MenuLayout;