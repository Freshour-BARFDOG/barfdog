import React, { useEffect, useState } from 'react';
import Spinner from '/src/components/atoms/Spinner';

import dynamic from 'next/dynamic';
const ResponsiveCirclePacking = dynamic(
  () => import('@nivo/circle-packing').then((m) => m.ResponsiveCirclePacking),
  { ssr: false },
);

export default function TagChart({ chartData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const childrenData = Object.entries(chartData)
      .filter(([key, value]) => {
        // 배열이나 문자열인 경우 값이 비어있지 않은 경우를 체크
        if (Array.isArray(value) || typeof value === 'string') {
          return value.length > 0;
        }
        // 기타 값이 false가 아닌 경우를 체크
        return value;
      })
      .flatMap(([key, value]) => {
        // 배열인 경우, 각 요소를 개별적으로 처리
        if (Array.isArray(value)) {
          return value.map((val) => ({
            name: val,
            loc: 1,
            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          }));
        }
        // 배열이 아닌 경우, 하나의 객체로 처리
        return {
          name: value,
          loc: 1,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
        };
      });

    const data = {
      name: '',
      color: '#FFF9F9',
      children: childrenData,
    };

    // 7개가 최대

    setData(data);
  }, []);

  const theme = {
    labels: {
      text: {
        fontSize: 26, // 글자 크기를 20px로 설정
      },
    },
  };
  return (
    <>
      <div data-title={'chart-container'}>
        {isLoading ? (
          <Spinner />
        ) : (
          <div style={{ height: '22rem', width: '100%' }}>
            <ResponsiveCirclePacking
              data={data}
              id="name"
              value="loc"
              colors="#FFF9F9"
              padding={-46}
              enableLabels={true}
              //   labelSkipWidth={100}
              //   labelSkipHeight={100}
              //   labelsSkipRadius={0}
              labelTextColor={(node) => node.data.color}
              theme={theme}
              enableTooltip={false}
              tooltip={() => <></>}
              //   defs={[
              //     {
              //       id: 'lines',
              //       type: 'patternLines',
              //       background: 'none',
              //       color: 'inherit',
              //       rotation: -45,
              //       lineWidth: 5,
              //       spacing: 8,
              //     },
              //   ]}
              //   motionConfig={{
              //     mass: 1,
              //     tension: 14,
              //     friction: 216,
              //     clamp: false,
              //     precision: 0.01,
              //     velocity: 0,
              //   }}
            />
          </div>
        )}
      </div>
    </>
  );
}
