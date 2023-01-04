import React, {useEffect, useState} from "react";
import {URLPathOnLocalStorageClass} from "../../class/URLPathClass";


export const MoveToAdminPageButton = () => {
  const [adminPath, setAdminPath] = useState( "" );
  useEffect( () => {
    const ADMIN_INDEX_PATH = "/bf-admin/dashboard";
    const p = new URLPathOnLocalStorageClass();
    const path = p.lastVisitedAdminPath || ADMIN_INDEX_PATH;
    setAdminPath( path );
  }, [] );
  
  return <li><a href={adminPath} style={{fontSize: "14px"}}>관리자페이지</a></li>;
}
