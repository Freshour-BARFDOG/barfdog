import React, {useEffect} from "react";
import {getCookie, setCookie} from "@util/func/cookie";

export const AlertLayer = ({props, children}) => {
  
  const {data} = props;
  
  useEffect(() => {
    if(!data.member) return;
  
    const curSubscribedDogs = data?.member?.subscribe?.subscribedDogs;
    const info = subscribeItemOutOfStockInfo(curSubscribedDogs);
    // console.log(info);
    if (info?.outOfStock) {
      const cookieName ='bf-subscribeItem-outOfStock';
      const cookie = JSON.parse(getCookie(cookieName));
      
      if(!cookie){
        // 쿠키확인 => 쿠키 없을 시 알림 & 쿠키 생성
        const cookieCooltimeObj = {
          outOfStock: true,
          dateUnit: 'min',
          expNumber: 1,
          createdTime: new Date().toLocaleString(),
        };
        alert(`***----------- 현재 TEST 알림 주기는 ${cookieCooltimeObj.expNumber}분입니다------------***\n- 구독 중인 상품 중, 품절된 레시피가 존재합니다.\n- 품절된 반려견: ${info.outOfStockDogNames}\n- 품절된 레시피: ${info.outOfStockItemNames}\n- 마이페이지에서 품절상태를 확인 후 문의하세요.`);
        setCookie(cookieName, JSON.stringify(cookieCooltimeObj), cookieCooltimeObj.dateUnit, cookieCooltimeObj.expNumber);
      }
    }
    
  }, [data]);
  
  return <>{children}</>;
}



const subscribeItemOutOfStockInfo = (subscribedDogs)=>{
  const curItems = subscribedDogs;
  if(!curItems || curItems?.length === 0) return;
  const outOfStockItemList = curItems.filter(item=> item.inStock === false); // # inStock = false => 재고가 없는 레시피 filtering
  const outOfStock = !!outOfStockItemList.length;
  const outOfStockItemNames = outOfStock && outOfStockItemList.map(item=> item.recipeName).join(',');
  const outOfStockDogNames = outOfStock && outOfStockItemList.map(item=> item.dogName).join(',');
  return {
    outOfStock,
    outOfStockItemNames,
    outOfStockDogNames,
  };
}
