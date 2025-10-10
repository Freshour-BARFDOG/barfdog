import React from "react";
import styles from "./SvgIcon.module.scss";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  src: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size?: number;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
  className?: string;
}

const SvgIcon: React.FC<IconProps> = ({
  src: IconComponent,
  size = 24,
  color = "#000",
  backgroundColor = "transparent",
  width,
  height,
  className,
  ...rest
}) => {
  return (
    <IconComponent
      width={width ?? size}
      height={height ?? size}
      style={{ color: color, backgroundColor: backgroundColor }}
      className={`${styles.svgIcon} ${className || ""}`}
      {...rest}
    />
  );
};

export default SvgIcon;
