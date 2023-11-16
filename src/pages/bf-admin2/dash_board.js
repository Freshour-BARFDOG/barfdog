import DailyStatistics from "./daily_statistics";
import OrderDeliveryStatistics from "./order_delivery_statistics";
import ClainSalesStatistics from "./clain_sales_statistics";
import { useState } from "react";
import { Layout, Menu } from "antd";

import { postObjData } from '/src/pages/api/reqData';
import { getGoodsFlowOtp } from '/src/pages/api/goodsFlow/service';
import popupWindow from '/util/func/popupWindow';

const { Header } = Layout;





// const openNewWindow = (link,key) => {
//   // 새 창을 열기 위한 로직을 구현합니다.
//   const url = `/bf-admin2/${link}/${key}`; // 예시 URL
//   const subWindow = window.open(url, '_blank', 'width=1000,height=1000');
//   if (subWindow) {
//     subWindow.focus();
//   } else {
//     alert('Subwindow blocked. Please allow pop-ups and try again.');
//   }
// };


export default function DashBoard() {
  const [selectedKey, setSelectedKey] = useState("1");
  const onClick2 = (info) => {
    // console.log(info.key);
    setSelectedKey(info.key);
  };
  const returnContetns2 = (item) => {
    if (selectedKey === "1") {
      return <DailyStatistics />;
    } else if (selectedKey === "2") {
      return <OrderDeliveryStatistics />;
    } else if (selectedKey === "3") {
      return <ClainSalesStatistics />;
    } else {
      return null;
    }
  };







  // const onStart = async () => {
  //   try {
  //     // goodsflow otp 발급(운송장 출력창 호출할때마다 발급 받아야함)
  //     const otp = await getGoodsFlowOtp();

  //     // 운송장 출력창 호출
  //     const goodsflowPrintUrl = window.location.origin + '/api/goodsFlow/contractList';
  //     const printRes = await postObjData(goodsflowPrintUrl, {
  //       otp: otp,
  //     });
  //     console.log('=================');

  //     if (printRes.isDone) {
  //       console.log(printRes);
  //       console.log(printRes.data.data);
  //       // popupWindow(`/bf-admin/sell/delivery/print?data=${printRes.data.data}`);
  //       const url = `https://ds.goodsflow.com/p1/printcc/contract/list.aspx`; // 예시 URL
  //       // const url = `https://ds.goodsflow.com/p1/printcc/contract/detail.aspx`; // 예시 URL
  //       const subWindow = window.open(url, '_blank', 'width=1000,height=1000');
  //       if (subWindow) {
  //         subWindow.focus();
  //       } else {
  //         alert('Subwindow blocked. Please allow pop-ups and try again.');
  //       }
  //     }
  //   } catch (err) {
  //     console.log('API통신 오류 : ', err);
  //   } finally {
  //     console.log('API통신 종료');
  //   }

  // };








  return (
    <>
      <Layout>
        {/* <Header
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="demo-logo" />
          <Menu
            onClick={onClick2}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={[
              { key: "1", label: "일자별 통계" },
              { key: "2", label: "주문/배송" },
              { key: "3", label: "클레임/매출" },
            ]}
          />
        </Header> */}
        <Layout
          style={{
            backgroundColor: "#fff",
          }}
        >
          {/* <button className="admin_btn line basic_m" onClick={onStart}>
            주문발송
          </button> */}
          <DailyStatistics />
          {/* {returnContetns2()} */}
        </Layout>
      </Layout>
    </>
  );
}
