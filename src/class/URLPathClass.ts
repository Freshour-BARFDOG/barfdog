import {userType as USERTYPE } from "@store/TYPE/userAuthType";
import {focusFirstLocatedInputInDocument} from '@util/func/focusFirstLocatedInputInDocument'
type PathValidationTYPE = {
  MEMBER_PATH: boolean
  ADMIN_PATH: boolean
  ADMIN_PUBLIC_PATH: boolean
}

type LocalStorageName = {
  ADMIN: string,
  USER: string
}


const ADMIN_BASE_PATH_KEY = "bf-admin";
const LOCALSTORAGE_NAME: LocalStorageName = {
  ADMIN: 'Bardog.admin.lastVisitedURL',
  USER: 'Bardog.user.lastVisitedURL',
  
}

export class URLPathClass {
  curPath: string = null;
  lastVisitedAdminPath: string = '';
  VALIDATION: PathValidationTYPE = {
    MEMBER_PATH: null,
    ADMIN_PATH: null,
    ADMIN_PUBLIC_PATH: null,
  };
  
  constructor(ssr:boolean = false, path:string = null) {
    const p = path || location.pathname;
    this.curPath = p
    this.VALIDATION.ADMIN_PATH = this.validAdminPath(p);
    this.VALIDATION.ADMIN_PUBLIC_PATH = this.validAdminPublicPath(p);
    this.VALIDATION.MEMBER_PATH = this.validMemberPath(p);
    if(ssr === false){
      this.lastVisitedAdminPath = this.getLastVisitedPath();
      this.pathDispatcher(p);
    }
  }
  
  
  private pathDispatcher(path) {
    if (this.validAdminPath(path)) {
      this.saveAdminPath(path);
      focusFirstLocatedInputInDocument();
    } else {
      this.saveUserPath((path));
    }
  }
  
  
  private saveAdminPath(curPath: string) {
    if(this.isPopupPath(curPath)) return; // POPUP 경로 제외.
    
    const maxCount = 5;
    const storedAdminPathArr = this.getStoredAdminPathArr();
    const jsonArr = this.jsonStringifiedArray(curPath, maxCount, storedAdminPathArr);
    localStorage.setItem(LOCALSTORAGE_NAME.ADMIN, jsonArr);
  }
  
  private isPopupPath = (path) => {
     return path.indexOf('popup') >= 0;
  };
  
  private saveUserPath(curPath: string) {
    const maxCount = 5;
    const storedAdminPathArr = this.getStoredUserPathArr();
    const jsonArr = this.jsonStringifiedArray(curPath, maxCount, storedAdminPathArr);
    localStorage.setItem(LOCALSTORAGE_NAME.USER, jsonArr);
  }
  
  private jsonStringifiedArray(curPath: string, maxCount: number, storedAdminPathArr: []): string {
    let result;
    const allCount = storedAdminPathArr.length;
    if (allCount) {
      if (allCount >= maxCount) {
        result = [...storedAdminPathArr.slice(1), curPath];
      } else if (allCount < maxCount) {
        result = [...storedAdminPathArr, curPath];
      }
    } else {
      result = [curPath];
    }
    return JSON.stringify(result);
  }
  
  
  getLastVisitedPath(): string {
    const pathArr = this.getStoredAdminPathArr();
    const lastIndex = pathArr.length - 1;
    return pathArr[lastIndex];
  }
  
  
  getStoredAdminPathArr(): [] {
    const storedStringData = localStorage.getItem(LOCALSTORAGE_NAME.ADMIN);
    return (storedStringData && storedStringData !== 'undefined') ? JSON.parse(storedStringData) : [];
  }
  
  getStoredUserPathArr(): [] {
    const storedStringData = localStorage.getItem(LOCALSTORAGE_NAME.USER);
    return (storedStringData && storedStringData !== 'undefined') ? JSON.parse(storedStringData) : [];
  }
  
  
  private validAdminPath(path: string): boolean {
    return path.indexOf(ADMIN_BASE_PATH_KEY) >= 0;
  }
  
  
  private validAdminPublicPath(curPath: string): boolean {
    let result = false;
    const filteredPath = this.filteredAdminPath(curPath);
    const ADMIN_PUBLIC_PATH_LIST: string[] = ['/index', '/login', '/login/resetPassword'];
    for (const path of ADMIN_PUBLIC_PATH_LIST) {
      if (filteredPath === path) {
        result = true;
        break;
      }
    }
    
    return result;
  }
  
  private validMemberPath(curPath: string): boolean {
    const curFIRST_DEPTH = `/${curPath.split("/")[1]}`;
    const MEMBER_PATH_LIST_AT_FIRST_DEPTH: string[] = ['/cart', '/order', '/mypage', '/survey'];
    return MEMBER_PATH_LIST_AT_FIRST_DEPTH.indexOf(curFIRST_DEPTH) >= 0;
  }
  
  private filteredAdminPath(curPath): string {
    return curPath.replace(`/${ADMIN_BASE_PATH_KEY}`, '');
  }
  
  checkAuthAndRedirect(usertype: string) {
    
    if (this.VALIDATION.MEMBER_PATH && usertype === USERTYPE.NON_MEMBER) {
      document.documentElement.remove();
      alert('회원가입이 필요한 페이지입니다.');
      window.location.href = '/account/login';
    } else if (this.VALIDATION.ADMIN_PATH && !this.VALIDATION.ADMIN_PUBLIC_PATH && usertype !== USERTYPE.ADMIN) {
      document.documentElement.remove();
      alert('일반 사용자에게 접근 권한이 없는 페이지입니다.');
      window.location.href = '/bf-admin/login';
    }
  }
}
