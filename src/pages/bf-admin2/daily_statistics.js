import { Button, Space, Switch, Table, Alert, Spin, Statistic, Typography } from "antd";
// import CountUp from 'react-countup';
import React, { useState, useEffect } from "react";
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

import dayjs from "dayjs";

import { getData } from '/src/pages/api/reqData';


const { Title } = Typography;

const strokeColors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8fbc8f', '#6495ed',
  '#dc143c', '#00ced1', '#ff1493', '#ffd700', '#32cd32', '#9932cc',
  '#ff69b4', '#00ffff', 
  '#ff4500', '#4169e1', '#ff8c00', '#1e90ff', '#ff6347', '#98fb98'
];

const switchOptions = [
  "누적가입자",
  "누적구독자",
  "누적신규구독자",
  "누적구독취소자",
  "누적매출액",
  "누적원가액",
  "누적할인액",
  // "결제자수",
  // "결제금액",
  // "구독자수",
  // "구취수",
  // "주문수",
  // "매출액",
  // "할인액",
  // "방문자",
  // "가입자",
  // "문의(채널톡)",
  // "리뷰수",
];

// const formatter = (value) => <CountUp end={value} separator="," />;

export default function DailyStatistics() {

  const [dataBase, setDataBase] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  // useEffect(() => {
  //   // ID가 존재하는 경우에만 데이터를 로딩합니다.
  //   (async () => {
  //     try {
  //       const url = `/api/admin/new/orders/searchBetweenForStatistics/202302010000/202311020000`;
  //       const res = await getData(url);

  //       if (res?.status === 200) {
  //         const dataToAssign = res.data ?? {};
  //         setDataBase(dataToAssign);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false); // 데이터 로딩이 완료되면 로딩 상태를 false로 설정합니다.
  //     }
  //   })();
  //   console.log(dataBase)
  // },[]);
  
  // 데이터를 가져오는 함수
  const fetchData = () => {
    setIsLoading(true); // 데이터를 가져오기 전에 isLoading을 true로 설정

    (async () => {
      try {
        const currentDate = dayjs().format('YYYYMMDDHHmm');
        const url = `/api/admin/new/orders/searchBetweenForStatistics/202302010100/${currentDate}`;
        const res = await getData(url);

        if (res?.status === 200) {
          const dataToAssign = res.data ?? {};
          setDataBase(dataToAssign);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false); // 데이터 로딩이 완료되면 로딩 상태를 false로 설정
      }
    })();
  };





  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };


  
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
    const index = switchOptions.indexOf(dataKey);

    if (showPageViews[index]) {
      return <Line key={index} type="monotone" dataKey={dataKey} stroke={strokeColors[index % strokeColors.length]} 
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




  if (isLoading) {
    return (
      <div>
        <Alert message="로딩 중입니다." description="잠시만 기다려주세요." type="info" showIcon />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
          <Spin size="large" />
        </div>
      </div>
    )
  }
  
  let filteredData = [];
  let graphData = [];
  let accumNewMember = 0;
  let accumSubscriber = 0;
  let accumPaymentPrice = 0;
  let accumDiscountTotal = 0;
  let accumFirceSubscribe = 0;
  let accumCancelSubscribe = 0;
  let accumOrderPrice = 0;

  const length = dataBase?.dailyStatistics?.length;
  for (let i = 0; i < length; i++){

    const dataDaily = dataBase?.dailyStatistics[i];
    
    const dataDailyDescent = dataBase?.dailyStatistics[length-1-i];

    filteredData.push(
      {
        key: i.toString(),
        "일자": dataDailyDescent.date,
        "신규가입자": (dataDailyDescent.newMember).toLocaleString(),
        "신규구독자": (dataDailyDescent.firstSubscribe).toLocaleString(),
        "구독취소자": (dataDailyDescent.cancelSubscribe).toLocaleString(),
        "구독주문완료": (dataDailyDescent.subscribeConfirm + dataDailyDescent.subscribeDeliveryDone).toLocaleString(),
        "일반주문완료": (dataDailyDescent.generalConfirm + dataDailyDescent.generalDeliveryDone).toLocaleString(),
        "총매출가격": (dataDailyDescent.subscribePaymentPrice + dataDailyDescent.generalPaymentPrice).toLocaleString(),
        "총주문가격": (dataDailyDescent.subscribeOrderPrice + dataDailyDescent.generalOrderPrice).toLocaleString(),
        "총할인가격": (dataDailyDescent.subscribeDiscountTotal + dataDailyDescent.generalDiscountTotal).toLocaleString(),
        "구독매출가격": (dataDailyDescent.subscribePaymentPrice).toLocaleString(),
        "구독주문가격": (dataDailyDescent.subscribeOrderPrice).toLocaleString(),
        "구독할인가격": (dataDailyDescent.subscribeDiscountTotal).toLocaleString(),
        "일반매출가격": (dataDailyDescent.generalPaymentPrice).toLocaleString(),
        "일반주문가격": (dataDailyDescent.generalOrderPrice).toLocaleString(),
        "일반할인가격": (dataDailyDescent.generalDiscountTotal).toLocaleString(),
      });

      accumNewMember += dataDaily.newMember;
      accumSubscriber += (dataDaily.firstSubscribe - dataDaily.cancelSubscribe);
      accumFirceSubscribe += dataDaily.firstSubscribe;
      accumCancelSubscribe -= dataDaily.cancelSubscribe;
      accumPaymentPrice += (dataDaily.subscribePaymentPrice + dataDaily.generalPaymentPrice);
      accumOrderPrice += (dataDaily.subscribeOrderPrice + dataDaily.generalOrderPrice);
      accumDiscountTotal -= (dataDaily.subscribeDiscountTotal + dataDaily.generalDiscountTotal);
      
      graphData.push(
      {
        key: i.toString(),
        "일자": dataDaily.date,
        "누적가입자": accumNewMember,
        "누적구독자": accumSubscriber,
        "누적신규구독자": accumFirceSubscribe,
        "누적구독취소자": accumCancelSubscribe,
        "누적매출액": accumPaymentPrice,
        "누적원가액": accumOrderPrice,
        "누적할인액": accumDiscountTotal,
      });
      
  }



  return (
    <>
      <Button type="default" onClick={fetchData}>
        데이터 불러오기
      </Button>
      <div className="mb-4">
        <Space direction="vertical">
          <Title level={3} className="mt-8">구독주문상태</Title>
          <Space direction="horizontal">
            <Statistic title="결제완료" value={dataBase.totalStatistics?.subscribePaymentDone}/>
            <Statistic title="생산중" value={dataBase.totalStatistics?.subscribeProducing}/>
            <Statistic title="배송확인" value={dataBase.totalStatistics?.subscribeDeliveryBeforeCollection}/>
            <Statistic title="배송시작" value={dataBase.totalStatistics?.subscribeDeliveryStart}/>
            <Statistic title="배송완료" value={dataBase.totalStatistics?.subscribeDeliveryDone}/>
            <Statistic title="구매확정" value={dataBase.totalStatistics?.subscribeConfirm}/>
          </Space>
          <Title level={3} className="mt-8">일반주문상태</Title>
          <Space direction="horizontal">
            <Statistic title="결제완료" value={dataBase.totalStatistics?.generalPaymentDone}/>
            <Statistic title="배송확인" value={dataBase.totalStatistics?.generalDeliveryBeforeCollection}/>
            <Statistic title="배송준비" value={dataBase.totalStatistics?.generalDeliveryReady}/>
            <Statistic title="배송시작" value={dataBase.totalStatistics?.generalDeliveryStart}/>
            <Statistic title="배송완료" value={dataBase.totalStatistics?.generalDeliveryDone}/>
            <Statistic title="구매확정" value={dataBase.totalStatistics?.generalConfirm}/>
          </Space>
          <Title level={3} className="mt-8">배송완료 구독플랜</Title>
          <Space direction="horizontal">
            <Statistic title="풀" value={dataBase.totalStatistics?.plan[0].count}/>
            <Statistic title="하프" value={dataBase.totalStatistics?.plan[1].count}/>
            <Statistic title="토핑" value={dataBase.totalStatistics?.plan[2].count}/>
          </Space>
          <Title level={3} className="mt-8">배송완료 구독레시피</Title>
          <Space direction="horizontal">
            <Statistic title="스타터프리미엄" value={dataBase.totalStatistics?.recipe[0].count}/>
            <Statistic title="터키앤비프" value={dataBase.totalStatistics?.recipe[1].count}/>
            <Statistic title="덕앤램" value={dataBase.totalStatistics?.recipe[2].count}/>
            <Statistic title="램앤비프" value={dataBase.totalStatistics?.recipe[3].count}/>
          </Space>
          <Title level={3} className="mt-8">가입자 성별</Title>
          <Space direction="horizontal">
            <Statistic title="남성" value={dataBase.totalStatistics?.gender[0].count}/>
            <Statistic title="여성" value={dataBase.totalStatistics?.gender[1].count}/>
            <Statistic title="기타" value={dataBase.totalStatistics?.gender[2].count}/>
          </Space>
          <Title level={3} className="mt-8">가입자 나이</Title>
          <Space direction="horizontal">
            <Statistic title="10대" value={dataBase.totalStatistics?.ages[0].count}/>
            <Statistic title="20대" value={dataBase.totalStatistics?.ages[1].count}/>
            <Statistic title="30대" value={dataBase.totalStatistics?.ages[2].count}/>
            <Statistic title="40대" value={dataBase.totalStatistics?.ages[3].count}/>
            <Statistic title="50대" value={dataBase.totalStatistics?.ages[4].count}/>
            <Statistic title="60대" value={dataBase.totalStatistics?.ages[5].count}/>
            <Statistic title="70대" value={dataBase.totalStatistics?.ages[6].count}/>
            <Statistic title="80대" value={dataBase.totalStatistics?.ages[7].count}/>
            <Statistic title="90대" value={dataBase.totalStatistics?.ages[8].count}/>
            <Statistic title="기타" value={dataBase.totalStatistics?.ages[9].count}/>
          </Space>
          <Title level={3} className="mt-8">가입자 지역</Title>
          <Space direction="horizontal">
            <Statistic title="서울" value={dataBase.totalStatistics?.region[0].count}/>
            <Statistic title="부산" value={dataBase.totalStatistics?.region[1].count}/>
            <Statistic title="대구" value={dataBase.totalStatistics?.region[2].count}/>
            <Statistic title="인천" value={dataBase.totalStatistics?.region[3].count}/>
            <Statistic title="광주" value={dataBase.totalStatistics?.region[4].count}/>
            <Statistic title="대전" value={dataBase.totalStatistics?.region[5].count}/>
            <Statistic title="울산" value={dataBase.totalStatistics?.region[6].count}/>
            <Statistic title="제주" value={dataBase.totalStatistics?.region[7].count}/>
            <Statistic title="세종" value={dataBase.totalStatistics?.region[8].count}/>
            <Statistic title="경기" value={dataBase.totalStatistics?.region[9].count}/>
            <Statistic title="강원" value={dataBase.totalStatistics?.region[10].count}/>
            <Statistic title="충북" value={dataBase.totalStatistics?.region[11].count}/>
            <Statistic title="충남" value={dataBase.totalStatistics?.region[12].count}/>
            <Statistic title="경북" value={dataBase.totalStatistics?.region[13].count}/>
            <Statistic title="경남" value={dataBase.totalStatistics?.region[14].count}/>
            <Statistic title="전북" value={dataBase.totalStatistics?.region[15].count}/>
            <Statistic title="전남" value={dataBase.totalStatistics?.region[16].count}/>
            <Statistic title="기타" value={dataBase.totalStatistics?.region[17].count}/>
          </Space>
        </Space>
        
        

        {/* <LineChart
          key="unique_key_for_line_chart"
          data={graphData}
        >
          <XAxis dataKey="일자" />
          <YAxis />
        </LineChart> */}
        
      <Title level={3} className="mt-8">그래프</Title>
      <Space direction="vertical">
        <Space direction="horizontal">{switchItems.slice(0,5)}</Space>
        <Space direction="horizontal">{switchItems.slice(5,10)}</Space>
        <Space direction="horizontal">{switchItems.slice(10,14)}</Space>
      </Space>
        <ResponsiveContainer key="repon1" width="100%" height={400}>
          <LineChart
              key="unique_key_for_line_chart"
            width={800}
            height={600}
            data={graphData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="일자" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Line dataKey="신규 가입자" />
            <Line dataKey="신규 구독자" />
            <Line dataKey="구독취소자" /> */}
              {switchOptions.map((option) => showGraph(option))}
          </LineChart>
          
      </ResponsiveContainer>
      
      <Title level={3} className="mt-8">테이블</Title>
        <Table 
            bordered={true}
            columns={[
              { title: "일자", dataIndex: "일자", key: "일자", },
              { title: "신규가입자", dataIndex: "신규가입자", key: "신규가입자", },
              { title: "신규구독자", dataIndex: "신규구독자", key: "신규구독자", },
              { title: "구독취소자", dataIndex: "구독취소자", key: "구독취소자", },
              { title: "구독주문완료", dataIndex: "구독주문완료", key: "구독주문완료", },
              { title: "일반주문완료", dataIndex: "일반주문완료", key: "일반주문완료", },
              { title: "총매출가격", dataIndex: "총매출가격", key: "총매출가격", },
              { title: "총주문가격", dataIndex: "총주문가격", key: "총주문가격", },
              { title: "총할인가격", dataIndex: "총할인가격", key: "총할인가격", },
              { title: "구독매출가격", dataIndex: "구독매출가격", key: "구독매출가격", },
              { title: "구독주문가격", dataIndex: "구독주문가격", key: "구독주문가격", },
              { title: "구독할인가격", dataIndex: "구독할인가격", key: "구독할인가격", },
              { title: "일반매출가격", dataIndex: "일반매출가격", key: "일반매출가격", },
              { title: "일반주문가격", dataIndex: "일반주문가격", key: "일반주문가격", },
              { title: "일반할인가격", dataIndex: "일반할인가격", key: "일반할인가격", },
            ]}
            dataSource={filteredData}
            scroll={{
              x: 2200,
              y: 1500,
            }}
          />
      </div>
    </>
  )


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
          <ResponsiveContainer key="repon1" width="100%" height={400}>
            <LineChart
              key="unique_key_for_line_chart"
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

