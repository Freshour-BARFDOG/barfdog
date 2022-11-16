import {deleteCookie, getCookie, setCookie} from "@util/func/cookie";




export class SurveyDataClass {
  cookieName:string = '';
  dogInfoCookie:string = '';
  
  constructor () {}
  
  getSurveyCookie (id:number) {
    if(!id) return;
    // 기존 쿠키에 저장된 설문조사 데이터를 가져온다.
    const thisUserCookieName= `${'bf-survey'}-${id}`;
    this.cookieName = thisUserCookieName;
    const storedCookie = getCookie(thisUserCookieName);
    if(storedCookie){
      return this.dogInfoCookie = storedCookie
    }
  }
  
  setSurveyCookie (id:number, formValues={}) {
    // update browerser cookie
    if(id && Object.keys(formValues).length){
      this.dogInfoCookie = JSON.stringify(formValues);
      setCookie(this.cookieName, this.dogInfoCookie, 'date', 365);
    }
  }
  
  deleteSurveyCookie (id:number) {
    const targetCookieId = Number(this.cookieName?.split('-')[2]);
    if(targetCookieId === id){
      deleteCookie(this.cookieName);
    }
    
  }
  
}

