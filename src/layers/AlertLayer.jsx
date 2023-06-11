import React, {useEffect} from "react";
import {deleteCookie, getCookie, setCookie} from "@util/func/cookie";

export const AlertLayer = ({props, children}) => {
  
  const {data} = props;
  
  useEffect(() => {
    if(!data.member) return;
    
    const curSubscribedDogs = data?.member?.subscribe?.subscribedDogs;
    if(!curSubscribedDogs) return;
    
    const info = subscribeItemOutOfStockInfo(curSubscribedDogs);
    if(!info) return;
    
    const cookieName ='bf-subscribeItem-outOfStock';
    
    
    // STEP 1. 품절된 상품이 없을 시, 기존에 존재할 수 있는 쿠키 삭제
    if (info.outOfStock === false) {
      return deleteCookie(cookieName);
    }
    
    // STEP 2. 쿠키 확인
    const cookie = getCookie(cookieName);
    // console.log('cookie: ',cookie)
    if(cookie) return;

    
    // STEP 3. 쿠키 없을 경우, 쿠키 생성 & 알림
    const cookieCooltimeObj = {
      outOfStock: true,
      dateUnit: 'min',
      expNumber: 10,
      createdTime: new Date().toLocaleString()
    };
    
    setCookie(cookieName, JSON.stringify(cookieCooltimeObj), cookieCooltimeObj.dateUnit, cookieCooltimeObj.expNumber);
    
    // ! PROD
    alert(`[ CAUTION ]\n- 구독 중인 상품 중, 품절된 레시피가 존재합니다.\n- 품절된 반려견: ${info.outOfStockDogNames}\n- 품절된 레시피: ${info.outOfStockItemNames}\n- 마이페이지에서 품절상태를 확인 후 문의하세요.`);
  
  
    // // ! FOR TEST
    // const dateKoreanUnit ={
    //   date:'일',
    //   hour:'시간',
    //   min: '분',
    //   sec: '초'
    // }
    // // // ! TEST
    // alert(`----------- [TEST] 현재 알림 주기 : ${cookieCooltimeObj.expNumber}${dateKoreanUnit[cookieCooltimeObj.dateUnit]} ------------\n[ CAUTION ]\n- 구독 중인 상품 중, 품절된 레시피가 존재합니다.\n- 품절된 반려견: ${info.outOfStockDogNames}\n- 품절된 레시피: ${info.outOfStockItemNames}\n- 마이페이지에서 품절상태를 확인 후 문의하세요.`);
    
  }, [data]);
  
  return <>{children}</>;
}



const subscribeItemOutOfStockInfo = (subscribedDogs)=>{
  const curItems = subscribedDogs;
  if(!curItems || curItems?.length === 0) return;
  const outOfStockItemList = curItems.filter(item=> item.inStock === false); // # inStock = false => 재고가 없는 레시피 filtering
  const outOfStock = !!outOfStockItemList.length;
  let outOfStockItemNames = '';
  let outOfStockDogNames = '';
  
  if(outOfStock){
    const outOfStockItemNamesObj = new Set(outOfStockItemList.map(item=> item.recipeName));
    outOfStockItemNames = Array.from(outOfStockItemNamesObj).join(',') || ''; // 중복된 레시피명 제거
    outOfStockDogNames = outOfStockItemList.map(item=> item.dogName).join(', ');
  }
  
  
  return {
    outOfStock,
    outOfStockItemNames,
    outOfStockDogNames,
  };
}
