import Link from 'next/link';
import React, { useState } from 'react';
import s from './submenu.module.scss';
import styles from './header.module.scss';
import Image from 'next/image';







export const Title = ( {children, link, className} ) => {

  return link ? <Link href={link}><a className={`${s.submenu_title} flex-box ${className}`}>{children}</a></Link> : <p className={`${s.submenu_title} flex-box ${className}`}>{children}</p>;
}







export const SubmenuList = ( {link, title, className, isActive}) => {
  return (
    <li>
      {link ? 
        <Link 
          href={link || '#'} 
          passHref 
          className={`${className || ''} ${isActive ? 'active' : ''}`}
        >
          {title}
        </Link> 
        : 
        <p className={`${className || ''} ${isActive ? 'active' : ''}`}>
          {title}
        </p>
      }
    </li>
  );
}










function MenuLayout({title, isActive ,className, link, icon,  children}) {

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
      className={`${s.menu_wrapper} ${styles.gnb_nav_item}`}
      onMouseEnter={mouseEnterEvent}
      // onMouseLeave={mouseLeaveEvent}
    >
      {/* <Title link={link} className={titleClassName}>{title}</Title> */}
      <Title link={link} className={`hover:text-bf-red ${isActive ? s.active : ''}`}>{title}</Title>
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