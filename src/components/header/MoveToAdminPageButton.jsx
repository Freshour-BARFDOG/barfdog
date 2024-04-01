import React, { useEffect, useState } from 'react';
import s from './header.module.scss';

import { URLPathClass } from '../../class/URLPathClass';
import Link from 'next/link';

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

  return (
    <>
      <div className={s.admin_btn_container}>
        <li>
          <Link href="/bf-admin/dashboard">
            <a className={s.admin_btn}>관리자 1</a>
          </Link>
        </li>
        <li> |</li>
        <li>
          <Link href="/bf-admin2">
            <a className={s.admin_btn}>관리자 2</a>
          </Link>
        </li>
      </div>
    </>
  );
};
