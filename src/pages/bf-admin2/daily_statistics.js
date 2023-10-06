import { Space, Switch, Table } from "antd";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: 1, "페이지뷰": 3000, "방문자수": 2400, "결제건수": 2100, "매출액": 50000, "구독자수": 100, "구취수": 50, "주문수": 10, "할인액": 1000, "방문자": 2000, "가입자": 300, "문의(채널톡)": 20, "리뷰수": 15 },
  { month: 2, "페이지뷰": 4000, "방문자수": 2400, "결제건수": 2400, "매출액": 55000, "구독자수": 110, "구취수": 60, "주문수": 11, "할인액": 1200, "방문자": 2100, "가입자": 310, "문의(채널톡)": 21, "리뷰수": 16 },
  { month: 3, "페이지뷰": 5000, "방문자수": 2400, "결제건수": 2500, "매출액": 60000, "구독자수": 120, "구취수": 70, "주문수": 12, "할인액": 1400, "방문자": 2200, "가입자": 320, "문의(채널톡)": 22, "리뷰수": 17 },
  { month: 4, "페이지뷰": 4300, "방문자수": 2400, "결제건수": 2400, "매출액": 57000, "구독자수": 130, "구취수": 80, "주문수": 13, "할인액": 1600, "방문자": 2300, "가입자": 330, "문의(채널톡)": 23, "리뷰수": 18 },
  { month: 5, "페이지뷰": 4500, "방문자수": 2400, "결제건수": 7400, "매출액": 62000, "구독자수": 140, "구취수": 90, "주문수": 14, "할인액": 1800, "방문자": 2400, "가입자": 340, "문의(채널톡)": 24, "리뷰수": 19 },
];


const switchOptions = [
  "페이지뷰",
  "방문자수",
  "결제건수",
  "결제자수",
  "결제금액",
  "구독자수",
  "구취수",
  "주문수",
  "매출액",
  "할인액",
  "방문자",
  "가입자",
  "문의(채널톡)",
  "리뷰수",
];

export default function DailyStatistics() {
  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };


  let filteredData = [];

  for (let i = 0; i < 10; i++){
    filteredData.push(
      {
        key: i.toString(),
        "일자": "2023-05-16",
        "주문수": 6,
        "매출액": 6000,
        "방문자": 3,
        "가입": 5,
        "문의": 8,
        "후기": 12,
      });
  }



  
  const [showPageViews, setShowPageViews] = useState(
    switchOptions.map(() => true)
  );


  const handlePageViewsSwitchChange = (index) => (checked) => {
    setShowPageViews((prevShowPageViews) => {
      const newShowPageViews = [...prevShowPageViews];
      newShowPageViews[index] = checked;
      return newShowPageViews;
    });
  };
  
  const showGraph = (dataKey) => {
    const strokeColors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8fbc8f', '#6495ed',
      '#dc143c', '#00ced1', '#ff1493', '#ffd700', '#32cd32', '#9932cc',
      '#ff69b4', '#00ffff'
    ];
    const index = switchOptions.indexOf(dataKey);

    if (showPageViews[index]) {
      return <Line type="monotone" dataKey={dataKey} stroke={strokeColors[index % strokeColors.length]} 
      strokeWidth={2} />;
    }
    return null;
  };

  const switchItems = switchOptions.map((option, index) => (
    <Switch
      key={index}
      checkedChildren={option}
      unCheckedChildren={option}
      defaultChecked
      onChange={handlePageViewsSwitchChange(index)}
    />
  ));

  return (
    <>
      <Space direction="vertical">
        <Space direction="horizontal">{switchItems.slice(0,5)}</Space>
        <Space direction="horizontal">{switchItems.slice(5,10)}</Space>
        <Space direction="horizontal">{switchItems.slice(10,14)}</Space>
      </Space>

      <div className="flex flex-row gap-4">
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
          <p className="text-lg font-bold">그래프</p>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {switchOptions.map((option) => showGraph(option))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
          <p className="text-lg font-bold">일자별 요약</p>
          <Table 
            bordered={true}
            columns={[
              { title: "일자", dataIndex: "일자", key: "일자", },
              { title: "주문수", dataIndex: "주문수", key: "주문수", },
              { title: "매출액", dataIndex: "매출액", key: "매출액", },
              { title: "방문자", dataIndex: "방문자", key: "방문자", },
              { title: "가입", dataIndex: "가입", key: "가입", },
              { title: "문의", dataIndex: "문의", key: "문의", },
              { title: "후기", dataIndex: "후기", key: "후기", },
            ]}
            dataSource={filteredData}
            scroll={{
              x: 600,
              y: 300,
            }}
          />
        </div>
      </div>
    </>
  );
}

