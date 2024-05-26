import React, { useEffect, useState } from 'react';

import Spinner from '/src/components/atoms/Spinner';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import useDeviceState from '/util/hook/useDeviceState';

import dynamic from 'next/dynamic';
const ResponsivePie = dynamic(
  () => import('@nivo/pie').then((m) => m.ResponsivePie),
  { ssr: false },
);

export default function SubscriberByPlanPieChart({ chartData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  // const { isMobile, deviceWidth } = useDeviceState();

  useEffect(() => {
    const data = chartData?.map((item, idx) => ({
      id: item.plan,
      label: item.plan,
      value: item.count,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    }));
    setData(data);
  }, []);

  // console.log('chartData>>>', chartData);
  // console.log('GRAPH DATA>>>', data);

  return (
    <>
      <div data-title={'chart-container'}>
        {isLoading ? (
          <AmdinErrorMessage loading={<Spinner />} />
        ) : (
          <div style={{ height: '40rem' }}>
            <ResponsivePie
              data={data}
              margin={{ top: -200, right: 50, bottom: 0, left: 50 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0]],
              }}
              enableArcLinkLabels={false}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]],
              }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'column',
                  justify: false,
                  translateX: 10,
                  translateY: -100,
                  itemsSpacing: 10,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000',
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
}
