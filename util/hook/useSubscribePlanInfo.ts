import {useEffect, useState} from "react";
import {getData} from "@src/pages/api/reqData";
import {subscribePlanType} from '@store/TYPE/subscribePlanType';


// 콕뱅크 할인율 할때 이부분 수정하면됨
// plan_discount 테이블 데이터 불러오는 곳
export const useSubscribePlanInfo = () => {
  
  
  const [planDiscountPercent, setPlanDiscountPercent] = useState({
    [subscribePlanType.FULL.NAME]: null,
    [subscribePlanType.HALF.NAME]: null,
    [subscribePlanType.TOPPING.NAME]: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  
  useEffect(()=>{
    (async ()=>{
      setIsLoading(true);
      try {
        const url = `/api/planDiscount`;
        const res = await getData(url);
        // // console.log('useSubscribePlanInfo: ',res);
        if(res.data && res.status === 200) {
          const data = res.data._embedded.planDiscountResponseDtoList[0];
  
          setPlanDiscountPercent({
            [subscribePlanType.FULL.NAME]: data.full,
            [subscribePlanType.HALF.NAME]: data.half,
            [subscribePlanType.TOPPING.NAME]: data.topping,
          });
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
    planDiscountPercent:planDiscountPercent
  }
  
}
