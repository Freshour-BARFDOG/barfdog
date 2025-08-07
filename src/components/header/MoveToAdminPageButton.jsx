import React, {useEffect, useState} from "react";
import {URLPathClass} from "../../class/URLPathClass";
import Link from "next/link";


export const MoveToAdminPageButton = () => {
  // const [adminPath, setAdminPath] = useState( "" );
  // const [adminPath2, setAdminPath2] = useState( "" );

  // useEffect( () => {
  //   const ADMIN_INDEX_PATH = "/bf-admin/dashboard";
  //   const p = new URLPathClass();
  //   const path = p.lastVisitedAdminPath || ADMIN_INDEX_PATH;
  //   setAdminPath( path );
    
  //   const ADMIN_INDEX_PATH2 = "/bf-admin2";
  //   const path2 = p.lastVisitedAdminPath || ADMIN_INDEX_PATH2;
  //   setAdminPath2( path2 );
  // }, [] );
  const ADMIN_URL =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_ADMIN_URL_PRODUCT
      : process.env.NEXT_PUBLIC_ADMIN_URL_DEV;
  
  return (
    <>
      <li>
        <a
          target='_blank'
          rel="noreferrer"
          href={ADMIN_URL}
        >
          관리자 페이지
        </a>
      </li>
      {/*<li> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; </li>*/}
      {/*<li><Link href="/bf-admin2">관리자 페이지2</Link></li>*/}
    </>
  );
}
