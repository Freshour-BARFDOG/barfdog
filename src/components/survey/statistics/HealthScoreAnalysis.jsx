import React, { useEffect, useState } from 'react';
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
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import AllDogsGraph from './AllDogsGraph';

export default function HealthScoreAnalysis({ surveyInfo }) {
  const [historyData, setHistoryData] = useState([]);

  function transformDate(dateString) {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  }

  useEffect(() => {
    try {
      (async () => {
        const url = `/api/dogs/${surveyInfo.dogId}/score/history`;
        const res = await getData(url);
        // console.log(res);
        if (res.status === 200) {
          const data = res.data._embedded.queryDogScoreHistoryDtoList;

          const getColorByScore = (score) => {
            if (score <= 33) {
              return '#BE1A21';
            } else if (score <= 66) {
              return '#FFCF26';
            } else {
              return '#0BD65C';
            }
          };

          const formattedData = [
            { createdDate: '', score: null, color: 'transparent' }, // 시작 빈 데이터
            ...data.map((item) => ({
              ...item,
              createdDate: transformDate(item.createdDate),
              color: getColorByScore(item.score),
            })),
            { createdDate: '', score: null, color: 'transparent' }, // 끝 빈 데이터
          ];

          setHistoryData(formattedData);
        }
      })();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const CustomizedDot = (props) => {
    const { cx, cy, stroke, index, value } = props;
    // 첫 번째와 마지막 데이터 포인트에 원을 표시하지 않음
    if (index === 0 || index === historyData.length - 1) {
      return null;
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={8} // 점의 크기
        stroke={'#fff'}
        strokeWidth={2}
        fill={historyData[index]?.color} // 점의 배경색
      />
    );
  };

  const CustomizedLabel = ({ x, y, stroke, value, index }) => {
    return (
      <text
        x={x}
        y={y - 14}
        dy={0}
        fill={historyData[index]?.color}
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

  // const CustomizedLegend = (props) => {
  //   const { payload } = props;
  //   return (
  //     <div style={{ padding: '10px' }}>
  //       {payload.map((entry, index) => (
  //         <div key={`item-${index}`} style={{ marginBottom: '5px' }}>
  //           <span
  //             style={{
  //               backgroundColor: entry.payload.stroke,
  //               width: '12px',
  //               height: '12px',
  //               display: 'inline-block',
  //               marginRight: '5px',
  //               borderRadius: '50%',
  //             }}
  //           />
  //           <span
  //             style={{
  //               fontSize: '20px',
  //               color: '#424242',
  //               fontWeight: 'normal',
  //             }}
  //           >
  //             {entry.value}
  //           </span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <section className={s.health_score_analysis}>
      <div className={s.health_score_graph}>
        <div className={s.graph_title}>
          <h2>건강 점수 변화</h2>
          <div className={s.graph_circle_list}>
            <div className={s.graph_circle_wrapper}>
              <div className={`${s.graph_circle} ${s.red}`}></div>위험
            </div>
            <div className={s.graph_circle_wrapper}>
              <div className={`${s.graph_circle} ${s.yellow}`}></div>경고
            </div>
            <div className={s.graph_circle_wrapper}>
              <div className={`${s.graph_circle} ${s.green}`}></div>양호
            </div>
          </div>
        </div>
        <div style={{ height: '20rem', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={historyData}
              margin={{
                top: 50,
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
                dataKey="createdDate"
                height={60}
                tick={<CustomizedXAxisTick />}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={<CustomizedYAxisTick />}
                domain={[0, 100]}
              />
              {/* <Tooltip /> */}
              {/* <Legend content={<CustomizedLegend />} /> */}
              <Line
                type="monotone"
                dataKey="score"
                stroke="#A1A1A1"
                label={<CustomizedLabel />}
                dot={<CustomizedDot />}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={s.all_dogs_wrapper}>
        <div className={s.all_dogs_title}>
          <div>전체 반려견 중</div>
          <p>상위 {surveyInfo.scoreRankPercentAmongAllDogs}%</p>
        </div>
        <div className={s.all_count}>
          {transformLocalCurrency(surveyInfo.totalDogCount)} 마리 중
        </div>
        <AllDogsGraph
          surveyInfo={surveyInfo}
          avg={surveyInfo.avgScoreAmongAllDogs}
        />
      </div>

      <div className={s.all_dogs_wrapper}>
        <div className={s.all_dogs_title}>
          <div> 다른 견종 중엔?</div>
          <p> 상위 {surveyInfo.scoreRankPercentAmongSameSizeDog}%</p>
        </div>
        <div className={s.all_count}>
          {' '}
          대형견 {transformLocalCurrency(surveyInfo.dogCountByDogSize)} 마리 중
        </div>
        <AllDogsGraph
          surveyInfo={surveyInfo}
          avg={surveyInfo.avgScoreAmongSameSizeDog}
        />
      </div>
    </section>
  );
}
