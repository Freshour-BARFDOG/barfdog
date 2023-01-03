import {deleteCookie, getCookie, setCookie} from "@util/func/cookie";




export class SurveyDataClass {
  storedDataName:string = '';
  
  constructor () {}
  
  getStoredSurveyData (id:number) {
    if(!id) return;
    /*
     ! 주의: Cookie 사용 & browser 새로고침 => JSON객체의 "String 누실" 이슈 있음.
     ! ex. {"name":"safari_frd-dog","dogType":"  <---
    */
    const targetDataName= `bf-survey-${id}`;
    this.storedDataName = targetDataName;
    const storedData = localStorage.getItem(targetDataName) || null;
    return storedData;
  }
  
  setStoredSurveyData (id:number, formValues={}) {
    if(id && Object.keys(formValues).length){
      const formStrings = JSON.stringify(formValues).replace(/\n/g,'');
      localStorage.setItem(this.storedDataName, formStrings);
    }
  }
  
  deleteStoredSurveyData (id:number) {
    const targetCookieId = Number(this.storedDataName?.split('-')[2]);
    if(targetCookieId === id){
      localStorage.removeItem(this.storedDataName);
    }
  }
  
}
