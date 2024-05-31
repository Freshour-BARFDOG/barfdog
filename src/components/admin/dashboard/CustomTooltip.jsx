// import { useEffect, useRef } from 'react';
import s from './customTooltip.module.scss';

const CustomTooltip = ({ active, payload, label, unit, colorList }) => {
  const titleFormatter = (title) => {
    switch (title) {
      case 'count':
        return '신규회원';
      case 'generalOrderCount':
        return '일반 결제';
      case 'newSubscribeCount':
        return '신규 구독결제';
      case 'totalSubscribeCount':
        return '총 구독결제';
      case 'totalSalesCount':
        return '전체';
      case 'generalOrderSalesCount':
        return '일반';
      case 'subscribeSalesCount':
        return '구독';

      default:
        return title;
    }
  };

  const formatValue = (value) => {
    if (unit === '원') {
      return value.toLocaleString();
    } else return value;
  };

  if (active && payload && payload.length) {
    return (
      <div className={s.custom_tooltip}>
        <p className={s.label}>{label}</p>

        {payload.map((item, index) => (
          <p
            className="intro"
            key={index}
            style={colorList && { color: colorList[index] }}
          >
            {`${titleFormatter(item.name)} : `}
            <strong>{formatValue(item.value)}</strong>
            {` ${unit}`}
          </p>
        ))}
        {/* <p className="desc">Anything you want can be displayed here.</p> */}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
