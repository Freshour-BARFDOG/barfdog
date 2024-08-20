import React, { useEffect } from 'react';
import s from './surveyStatistics.module.scss';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getData } from '../../../pages/api/reqData';

export default function HealthScoreAnalysis({ surveyInfo }) {
  useEffect(() => {
    try {
      (async () => {
        const url = `/api/dogs/${surveyInfo.dogId}/score/history`;
        const res = await getData(url);
        console.log(res);
        if (res.status === 200) {
          const data = res.data._embedded.queryDogScoreHistoryDtoList;
          console.log('건강점수내역____', data);
        }
      })();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const data = [
    {
      date: 'Page A',
      score: 89,
    },
    {
      date: 'Page B',
      score: 30,
    },
    {
      date: 'Page C',
      score: 20,
    },
    {
      date: 'Page D',
      score: 80,
    },
    {
      date: 'Page E',
      score: 90,
    },
    {
      date: 'Page F',
      score: 90,
    },
    {
      date: 'Page G',
      score: 60,
    },
  ];

  // 빈 데이터 추가
  const formattedData = [
    { date: '', score: null }, // 시작 빈 데이터
    ...data,
    { date: '', score: null }, // 끝 빈 데이터
  ];

  const CustomizedDot = (props) => {
    const { cx, cy, stroke, index, value } = props;

    // 데이터가 제대로 전달되는지 확인하기 위해 console.log
    // console.log('CustomizedDot props:', props);

    // 첫 번째와 마지막 데이터 포인트에 원을 표시하지 않도록 조건 설정
    if (index === 0 || index === data.length + 1) {
      return null; // 원을 표시하지 않음
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={6} // 점의 크기
        stroke={stroke}
        strokeWidth={2}
        fill={stroke} // 점의 배경색
      />
    );
  };

  const CustomizedLabel = ({ x, y, stroke, value }) => {
    return (
      <text
        x={x}
        y={y - 14}
        dy={0}
        fill={stroke}
        textAnchor="middle"
        style={{ fontWeight: 'normal', fontSize: '22px' }}
      >
        {value}
      </text>
    );
  };

  const CustomizedXAxisTick = ({ x, y, stroke, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#424242"
          style={{ fontWeight: 'normal', fontSize: '16px' }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomizedYAxisTick = ({ x, y, stroke, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0 - 10}
          y={0 - 10}
          dy={16}
          textAnchor="middle"
          fill="#a0a0a0"
          style={{ fontWeight: 'normal', fontSize: '16px' }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ padding: '10px' }}>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ marginBottom: '5px' }}>
            <span
              style={{
                backgroundColor: entry.payload.stroke,
                width: '12px',
                height: '12px',
                display: 'inline-block',
                marginRight: '5px',
                borderRadius: '50%',
              }}
            />
            <span
              style={{
                fontSize: '20px',
                color: '#424242',
                fontWeight: 'normal',
              }}
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className={s.health_score_analysis}>
      <div>건강점수</div>
      <div style={{ height: '20rem', width: '100%', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={formattedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false} // 수직선 숨기기
            />
            <XAxis
              dataKey="date"
              height={60}
              tick={<CustomizedXAxisTick />}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={<CustomizedYAxisTick />}
              domain={[0, 'auto']}
            />
            {/* <Tooltip /> */}
            <Legend content={<CustomizedLegend />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#A1A1A1"
              label={<CustomizedLabel stroke={'#0BD674'} />}
              dot={<CustomizedDot stroke={'#0BD674'} />}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>전체 반려견 중</div>

      <div>다른 견종 중엔?</div>
    </section>
  );
}
