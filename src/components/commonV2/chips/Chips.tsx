import React, { ComponentType, ReactNode, SVGProps } from "react";
import styles from "./Chips.module.scss";
import SvgIcon from "../svgIcon/SvgIcon";
import CheckIcon from "/public/img/commonV2/check_small.svg";

interface ChipsProps {
  variant?: "solid" | "outlined";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  borderRadius?: "sm" | "md" | "lg";
  switchOff?: boolean;
  color?: string;
  tailVisible?: boolean;
  tailPosition?: "top" | "bottom";
  style?: React.CSSProperties;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  showCheckIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Chips({
  variant = "solid",
  children,
  size = "sm",
  borderRadius = "sm",
  switchOff = false,
  color = "gray700",
  tailVisible = false,
  tailPosition = "top",
  style,
  icon,
  showCheckIcon = false,
  className,
  onClick,
}: ChipsProps) {
  // 색상 스타일 클래스 생성
  const getColorStyle = () => {
    if (switchOff) {
      return variant === "solid" ? styles.solidSwitchOff : styles.outlinedSwitchOff;
    }
    
    const colorKey = `${variant}${String(color).charAt(0).toUpperCase() + String(color).slice(1)}`;
    return styles[colorKey as keyof typeof styles] || "";
  };

  // 크기 스타일 클래스 생성
  const getSizeStyle = () => {
    if (showCheckIcon && !switchOff) {
      return styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}WithCheckIcon` as keyof typeof styles];
    }
    return styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles];
  };

  // Tail 스타일 클래스 생성
  const getTailStyle = () => {
    const tailPositionClass = styles[`tailPosition${tailPosition.charAt(0).toUpperCase() + tailPosition.slice(1)}` as keyof typeof styles];
    const tailSizeClass = styles[`tailSize${tailPosition.charAt(0).toUpperCase() + tailPosition.slice(1)}${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles];
    const tailColorClass = styles[`tailColor${String(color).charAt(0).toUpperCase() + String(color).slice(1)}` as keyof typeof styles];
    
    return `${tailPositionClass} ${tailSizeClass} ${tailColorClass}`;
  };

  return (
    <span
      className={`
        ${styles.base}
        ${styles[variant]}
        ${styles[`borderRadius${borderRadius.charAt(0).toUpperCase() + borderRadius.slice(1)}` as keyof typeof styles]}
        ${getSizeStyle()}
        ${getColorStyle()}
        ${className || ""}
        ${tailVisible ? styles.tailFixedFont : ""}
      `}
      style={style}
      onClick={onClick}
    >
      {tailVisible && (
        <span
          className={`${styles.tailStyle} ${getTailStyle()}`}
        />
      )}
      {icon && <SvgIcon src={icon} color="white" />}
      {showCheckIcon && !switchOff && <SvgIcon src={CheckIcon} color="white" />}
      {children}
    </span>
  );
}
