import { ReactNode } from "react";
import styles from "./Card.module.scss";

interface CardProps {
  direction?: "row" | "col";
  justify?: "start" | "center" | "end" | "between";
  align?: "start" | "center" | "end" | "between";
  width?: "full" | "auto";
  height?: "full";
  shadow?: "none" | "light" | "normal" | "strong";
  padding?: 0 | 12 | 16 | 20 | "20/16";
  textAlign?: "left" | "center";
  children: ReactNode;
  className?: string;
  backgroundColor?: "gray0" | "gray50" | "gray100" | "white";
  borderRadius?: "default" | "none" | 12 | 16;
  gap?: 0 | 4 | 8 | 12 | 16 | 20;
}

const Card = ({
  direction = "col",
  justify,
  align,
  width,
  height,
  textAlign,
  shadow = "light",
  padding,
  children,
  backgroundColor = "gray0",
  borderRadius = "default",
  gap,
  className,
}: CardProps) => {
  // 클래스명 생성 헬퍼 함수들
  const getDirectionClass = () => {
    return direction === "row" ? "flex-row" : "flex-col";
  };

  const getJustifyClass = () => {
    if (!justify) return "";
    return `justify-${justify}`;
  };

  const getAlignClass = () => {
    if (!align) return "";
    return `align-${align}`;
  };

  const getWidthClass = () => {
    if (!width) return "";
    return width === "full" ? "w-full" : "w-auto";
  };

  const getHeightClass = () => {
    if (!height) return "";
    return height === "full" ? "h-full" : "";
  };

  const getPaddingClass = () => {
    if (!padding) return "";
    if (padding === "20/16") return styles.padding20_16;
    return styles[`padding${padding}`];
  };

  const getGapClass = () => {
    if (!gap) return "";
    return styles[`gap${gap}`];
  };

  const getBackgroundClass = () => {
    return styles[backgroundColor];
  };

  const getBorderRadiusClass = () => {
    return styles[`borderRadius${borderRadius.toString().charAt(0).toUpperCase() + borderRadius.toString().slice(1)}`];
  };

  const getShadowClass = () => {
    return styles[shadow];
  };

  const getTextAlignClass = () => {
    if (!textAlign) return "";
    return styles[textAlign];
  };

  // 인라인 스타일로 처리할 속성들
  const inlineStyles: React.CSSProperties = {};

  return (
    <div
      className={`
        ${styles.cardBase}
        ${getDirectionClass()}
        ${getJustifyClass()}
        ${getAlignClass()}
        ${getWidthClass()}
        ${getHeightClass()}
        ${getPaddingClass()}
        ${getGapClass()}
        ${getBackgroundClass()}
        ${getBorderRadiusClass()}
        ${getShadowClass()}
        ${getTextAlignClass()}
        ${className || ""}
      `}
      style={inlineStyles}
    >
      {children}
    </div>
  );
};

export default Card;
