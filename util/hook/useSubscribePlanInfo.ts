import {useEffect, useState} from "react";
import {getData} from "@src/pages/api/reqData";
import {subscribePlanName} from "../../trash/SubscribePlanInfoClass";


const initialDiscount = {
  [subscribePlanName.FULL]: 5,
  [subscribePlanName.HALF]: 2,
  [subscribePlanName.TOPPING]: 1
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
            [subscribePlanName.FULL]: data.full,
            [subscribePlanName.HALF]: data.half,
            [subscribePlanName.TOPPING]: data.topping,
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