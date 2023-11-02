import DailyStatistics from "./daily_statistics";
import OrderDeliveryStatistics from "./order_delivery_statistics";
import ClainSalesStatistics from "./clain_sales_statistics";
import { useState } from "react";
import { Layout, Menu } from "antd";
const { Header } = Layout;

export default function MemberList() {

  // console.log(search);

  const [dataBase, setDataBase] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search) {

      if (dateStart !== tmp_strDate || dateEnd !== tmp_endDate) {

          try {
            (async () => {
              const url = `api/admin/new/dog/searchBetween/${tmp_strDate}/${tmp_endDate}`;
              const res = await getData(url);

              // console.log(res)
  
              if(res?.status === 200){
                const dataToAssign = res.data._embedded?.dogAdminDtoList ?? []; // 주어진 데이터

                console.log(dataToAssign)

                setDataBase(dataToAssign); // 데이터베이스에 할당
              }
            })();
          } catch (err) {
            console.error(err);
          }

          

      }
    }
  }, [search]);

  
  if (isLoading) {
    return (
      <div>
      </div>
    )
  }



}
