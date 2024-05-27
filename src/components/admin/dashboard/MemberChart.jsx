import React, { useEffect, useMemo, useState } from 'react';

import Spinner from '/src/components/atoms/Spinner';
import AdminErrorMessage from '/src/components/atoms/AmdinErrorMessage';
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
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

export default function MemberChart({ chartData, from, to, isGraphLoading }) {
  const [data, setData] = useState(null);
  const [disable, setDisable] = useState({
    date: false,
    count: false,
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
      return { date: formattedDate, count: chart.newMemberCount };
    });

    setData(data);
  }, [chartData]);

  // console.log('chartData>>>', chartData);
  // console.log('GRAPH DATA>>>', data);

  // 그래프 색상 지정
  const graphColorList = ['#ca1011'];

  return (
    <>
      {/* <div data-title={'chart-container'}> */}
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
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              interval={0}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip unit="명" colorList={graphColorList} />}
            />
            <Legend
              content={
                <CustomLegend
                  disable={disable}
                  setDisable={setDisable}
                  labelList={['신규회원']}
                  valueList={['count']}
                  colorList={graphColorList}
                />
              }
            />
            <CartesianGrid stroke="#f5f5f5" />

            <Brush dataKey="date" height={30} stroke="#bbb" />

            {!disable.count && (
              <Bar
                yAxisId="left"
                dataKey="count"
                barSize={20}
                fill={graphColorList[0]}
              />
            )}
            {/* 라인 차트 */}
            {/* {!disable.count && (
              <Line
                yAxisId="right"
                dataKey="count"
                stroke={firstColor}
                // dot={false}
              />
            )}  */}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
