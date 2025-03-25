import React, { useEffect, useMemo, useState } from 'react';

import Spinner from '/src/components/atoms/Spinner';
import AdminErrorMessage from '/src/components/atoms/AdminErrorMessage';
import useDeviceState from '/util/hook/useDeviceState';

import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  Brush,
} from 'recharts';
import ChartLegend from './CustomLegend';
import CustomTooltip from './CustomTooltip';

export default function RevenueChart({ chartData, from, to, isGraphLoading }) {
  const [data, setData] = useState(null);
  const [disable, setDisable] = useState({
    generalOrderSalesCount: false,
    subscribeSalesCount: false,
    totalSalesCount: false,
  });

  // const { isMobile, deviceWidth } = useDeviceState();

  useEffect(() => {
    const data = chartData?.map((chart, idx) => {
      const date = new Date(chart.date);
      const formattedDate = `${date.getFullYear().toString().slice(2)}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
      return {
        date: formattedDate,
        generalOrderSalesCount: chart.generalOrderSalesCount,
        subscribeSalesCount: chart.subscribeSalesCount,
        totalSalesCount: chart.totalSalesCount,
      };
    });

    setData(data);
  }, [chartData]);

  // 금액 포맷터 (만원 단위)
  const formatYAxis = (tickItem) => {
    if (tickItem >= 100000000) {
      return `${(tickItem / 100000000).toFixed(1).toLocaleString()}억`;
    }
    if (tickItem >= 10000) {
      return `${(tickItem / 10000).toLocaleString()}만`;
    }
    return tickItem.toLocaleString();
  };
  // console.log('chartData>>>', chartData);
  // console.log('GRAPH DATA>>>', data);

  // 그래프 색상 지정
  const graphColorList = ['#ca1011', '#8D8DAA', '#F48484'];

  return (
    <>
      {isGraphLoading ? (
        <AdminErrorMessage loading={<Spinner />} />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={data}
            margin={{
              top: 50,
              left: 20,
              right: 20,
            }}
            height={400}
          >
            <CartesianGrid
              strokeDasharray={0}
              vertical={false}
              orientation={0}
            />

            <XAxis
              dataKey="date"
              interval={data?.length <= 10 ? 0 : Math.ceil(data?.length / 10)}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              interval={0}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              interval={0}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              content={<CustomTooltip unit="원" colorList={graphColorList} />}
            />
            <Legend
              content={
                <ChartLegend
                  disable={disable}
                  setDisable={setDisable}
                  labelList={['전체', '일반', '구독']}
                  valueList={[
                    'totalSalesCount',
                    'generalOrderSalesCount',
                    'subscribeSalesCount',
                  ]}
                  colorList={graphColorList}
                />
              }
            />
            <CartesianGrid stroke="#f5f5f5" />

            <Brush dataKey="date" height={30} stroke="#bbb" />
            {!disable.totalSalesCount && (
              <Line
                yAxisId="right"
                dataKey="totalSalesCount"
                stroke={graphColorList[0]}
                // dot={false}
                strokeWidth={2}
              />
            )}
            {!disable.generalOrderSalesCount && (
              <Bar
                yAxisId="left"
                dataKey="generalOrderSalesCount"
                barSize={20}
                fill={graphColorList[1]}
              />
            )}
            {!disable.subscribeSalesCount && (
              <Bar
                yAxisId="left"
                dataKey="subscribeSalesCount"
                barSize={20}
                fill={graphColorList[2]}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
