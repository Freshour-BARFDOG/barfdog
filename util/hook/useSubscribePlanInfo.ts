import {useEffect, useState} from "react";
import {getData} from "@src/pages/api/reqData";
import {subscribePlanType} from '@store/TYPE/subscribePlanType';

const initialDiscount = {
  [subscribePlanType.FULL.NAME]: 5,
  [subscribePlanType.HALF.NAME]: 2,
  [subscribePlanType.TOPPING.NAME]: 1
}

const initData = {
  discountPercent: initialDiscount
}

export const useSubscribePlanInfo = () => {

  
  const [allData, setAllData] = useState(initData);
  const [isLoading, setIsLoading] = useState(false);
  
  
  useEffect(()=>{
    (async ()=>{
      setIsLoading(true);
      try {
        const url = `/api/planDiscount`;
        const res = await getData(url);
        // console.log('useSubscribePlanInfo: ',res);
        let DATA;
        if(res.data && res.status === 200){
          const data = res.data._embedded.planDiscountResponseDtoList[0];
          DATA = {
            [subscribePlanType.FULL.NAME]: data.full,
            [subscribePlanType.HALF.NAME]: data.half,
            [subscribePlanType.TOPPING.NAME]: data.topping,
          }
          setAllData((prev)=>({
            ...prev,
            discountPercent: DATA
            
          }));
        }
        
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false);
      }
      
    })();
  },[]);
  
  
  return {
    isLoading,
    ...allData
  }
  
}