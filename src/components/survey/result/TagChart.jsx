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
    // const data = chartData?.map((item, idx) => ({
    //   name: item.reason,
    //   loc: item.count,
    //   color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    // }));

    const data = {
      name: '',
      color: '#FFF9F9',
      children: [
        {
          name: '#nivo',
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          loc: 1,
        },
        {
          name: '#nivo',
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          loc: 1,
        },
        {
          name: '#nivo',
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          loc: 1,
        },
        {
          name: '#nivo',
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          loc: 1,
        },
        {
          name: '#nivo',
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          loc: 1,
        },
        {
          name: '#nivo',
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          loc: 1,
        },
        {
          name: '#nivo',
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          loc: 1,
        },
        {
          name: '#nivo',
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          loc: 1,
        },
      ],
    };

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
          <div style={{ height: '14rem', width: '32rem' }}>
            <ResponsiveCirclePacking
              data={data}
              id="name"
              value="loc"
              colors="#FFF9F9"
              padding={-30}
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
