import DailyStatistics from "./daily_statistics";
import OrderDeliveryStatistics from "./order_delivery_statistics";
import ClainSalesStatistics from "./clain_sales_statistics";
import { useState } from "react";
import { Layout, Menu } from "antd";
const { Header } = Layout;

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
  return (
    <>
      <Layout>
        <Header
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
        </Header>
        <Layout
          style={{
            backgroundColor: "#fff",
          }}
        >
          {returnContetns2()}
        </Layout>
      </Layout>
    </>
  );
}
