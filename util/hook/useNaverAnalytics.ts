import { useEffect } from 'react';

declare global {
  interface Window {
    wcs: any;
    wcs_add: { wa: string };
    _nasa: { [key: string]: any };
    wcs_do: (nasa?: { [key: string]: any }) => void;
  }
}

const useNaverAnalytics = () => {
  useEffect(() => {
    // 스크립트 중복 로딩 방지
    if (window.wcs) {
      window.wcs.inflow();
      window.wcs_do();
      return;
    }

    // 네이버 로그분석 스크립트 설정
    window.wcs_add = { wa: 's_22b538074ef0' };
    window._nasa = {};

    // 네이버 로그분석 스크립트 로드
    const script = document.createElement('script');
    script.src = '//wcs.naver.net/wcslog.js';
    script.async = true;
    document.head.appendChild(script);

    // 스크립트 로드 후 로그 분석 실행
    script.onload = () => {
      if (window.wcs) {
        window.wcs.inflow();
        window.wcs_do();
      }
    };

    return () => {
      // 스크립트 제거
      document.head.removeChild(script);
      delete window.wcs;
      delete window.wcs_add;
      delete window._nasa;
      delete window.wcs_do;
    };
  }, []);

  // 전환 스크립트 트리거 함수
  const triggerConversion = (conversionType: 'purchase' | 'add_to_cart' | 'sign_up', conversionValue: number | string) => {
    if (!window._nasa) window._nasa = {};
    if (window.wcs && window.wcs.cnv) {
      // 전환 정보 설정
      window._nasa["cnv"] = window.wcs.cnv(conversionType, conversionValue);

      // 전환 전송
      window.wcs_do(window._nasa);  // _nasa 객체와 함께 전송
      console.log('Conversion triggered:', { conversionType, conversionValue });
    }
  };

  return { triggerConversion };
};

export default useNaverAnalytics;