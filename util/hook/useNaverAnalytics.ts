import {useEffect} from "react";

declare global {
  interface Window {
    wcs: any;
    wcs_add: any;
    _nasa: any;
  }
}

const useNaverAnalytics = () => {

  useEffect(() => {
    // 공통 스크립트 설정
    if (!window.wcs_add) window.wcs_add = { wa: 's_22b538074ef0' };
    if (!window._nasa) window._nasa = {};

    // 네이버 로그분석 스크립트 로드
    const script = document.createElement('script');
    script.src = "//wcs.naver.net/wcslog.js";
    script.async = true;
    document.head.appendChild(script);

    // 로그분석 실행
    script.onload = () => {
      if (window.wcs) {
        window.wcs.inflow();
        window.wcs_do();
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 전환 스크립트 트리거 함수
  const triggerConversion = (conversionType: string, conversionValue: number | string) => {
    if (!window._nasa) window._nasa = {};
    window._nasa["cnv"] = window.wcs.cnv(conversionType, conversionValue);
    // console.log("Conversion triggered:", { conversionType, conversionValue });
  };

  return { triggerConversion };
}

export default useNaverAnalytics;