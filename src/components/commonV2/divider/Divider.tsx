import React from 'react';
import styles from './Divider.module.scss';

interface DividerProps {
  thickness?: 1 | 2 | 4 | 8 | 12;
  color?: 'gray-50' | 'gray-100' | 'gray-300';
  direction?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

export default function Divider({
  thickness = 8,
  color,
  direction = 'horizontal',
  style,
}: DividerProps) {
  // 클래스명 생성 헬퍼 함수
  const getThicknessClass = () => {
    return `${direction}${thickness}`;
  };

  // 색상 오버라이드 스타일
  const overrideColorStyle = color
    ? { backgroundColor: `var(--color-${color})` }
    : {};

  const dividerStyle = { ...style, ...overrideColorStyle };

  return (
    <div
      className={`
        ${styles[direction]} 
        ${styles[getThicknessClass()]}
      `}
      style={dividerStyle}
    />
  );
}