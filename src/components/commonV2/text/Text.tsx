import React from "react";
import styles from "./Text.module.scss";

interface DefaultTextProps {
  type: 'display1' | 'display2' | 'title1' | 'title2' | 'title3' | 'title4' | 'headline1' | 'headline2' | 'headline3' | 'headline4' | 'label1' | 'label2' | 'label3' | 'label4' | 'body1' | 'body2' | 'body3' | 'caption' | 'caption2';
  color?: 'white' | 'red' | 'pastelRed' | 'gray900' | 'gray800' | 'gray700' | 'gray600' | 'gray500' | 'gray400' | 'gray300' | 'gray200' | 'gray100' | 'gray0' | 'blue500' | 'green500' | 'yellow500' | 'blue400' | 'green400' | 'yellow400' | 'blue600';
  align?: "left" | "center" | "right";
  children: React.ReactNode;
  block?: boolean;
  underLine?: boolean;
  className?: string;
  style?: React.CSSProperties;
  preLine?: boolean;
  applyLineHeight?: boolean;
}

const tagMap: Record<string, keyof JSX.IntrinsicElements> = {
  display1: "h1",
  display2: "h2",
  title1: "h3",
  title2: "h3",
  title3: "h3",
  title4: "span",
  headline1: "span",
  headline2: "span",
  headline3: "span",
  headline4: "span",
  label1: "span",
  label2: "span",
  label3: "span",
  label4: "span",
  body1: "span",
  body2: "span",
  body3: "span",
  caption: "span",
  caption2: "span",
};

export default function DefaultText({
  type,
  color = "gray900",
  align = "left",
  children,
  block = false,
  underLine = false,
  className,
  style,
  preLine,
  applyLineHeight = true,
}: DefaultTextProps) {
  const textStyle = styles[type];
  const colorStyle = styles[color || 'gray900'];
  const alignStyle = styles[align || 'left'];
  const underlineStyle = underLine ? styles.underline : "";
  const Tag = tagMap[type] || "span";
  const blockStyle = block ? styles.block : "";
  const preLineStyle = preLine ? styles.preLine : "";

  const overrideLineHeight = applyLineHeight === false ? { lineHeight: "normal" } : {};

  // 기존 style과 merge (inline style의 우선순위가 더 높음)
  const finalStyle = { ...style, ...overrideLineHeight };
  return (
    <Tag
      className={`${textStyle} ${colorStyle} ${alignStyle} ${underlineStyle} ${blockStyle} ${preLineStyle} ${
        className || ""
      }`}
      style={finalStyle}
    >
      {children}
    </Tag>
  );
}
