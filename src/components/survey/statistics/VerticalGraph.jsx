import React from 'react';
import s from './surveyStatistics.module.scss';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Label,
  XAxis,
  LabelList,
  Cell,
  YAxis,
} from 'recharts';

const data = [
  {
    name: '생식',
    count: 10,
  },
  {
    name: '동결건조사료',
    count: 12,
  },
  {
    name: '수제사료',
    count: 12,
  },
  {
    name: '화식',
    count: 10,
  },
  {
    name: '습식캔',
    count: 13,
  },
  {
    name: '건사료',
    count: 13,
  },
];

export default function VerticalGraph({ surveyInfo }) {
  return (
    <div
      style={{
        width: '400px',
        height: '300px',
        margin: '0 100px 0 auto',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={100}
          height={40}
          data={data}
          barSize={20}
          barGap={20}
          layout="vertical"
          margin={{ top: 0, right: 0, bottom: 0, left: 50 }}
        >
          <YAxis
            type="category"
            dataKey="name"
            tick={{
              fontSize: '16px',
              fill: '#424242',
              fontWeight: 'normal',
              textAnchor: 'end', // 라벨을 오른쪽으로 정렬
              dx: -10, // 라벨을 오른쪽으로 이동
            }}
            tickLine={false}
            interval={0} // 모든 라벨 표시
          />
          <XAxis
            type="number"
            tick={{ display: 'none' }} // X축 라벨 숨기기
            axisLine={false} // X축 선 숨기기
            tickLine={false} // X축 틱 라인 숨기기
          />
          {/* x축 */}
          {/* <YAxis
              dataKey="name"
              tick={({ x, y, payload, index }) => {
                const isLastTick = index === data.length - 1; // 마지막 레이블 확인
                return (
                  <text
                    x={x}
                    y={y + 20} // 라벨의 y축 위치 조정
                    fill={isLastTick ? '#BE1A21' : '#424242'} // 마지막 레이블의 색상 변경
                    fontSize="16px"
                    fontWeight={isLastTick ? 'bold' : 'normal'} // 마지막 레이블의 굵기 변경
                    textAnchor="middle"
                  >
                    {payload.value}
                  </text>
                );
              }} */}
          {/* /> */}
          <Bar dataKey="count" fill="#D9D9D9">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === data.length - 1 ? '#FFC5C5' : '#D9D9D9'} // 마지막 바 색상 변경
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
