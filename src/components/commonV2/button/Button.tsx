import { MouseEvent } from "react";
import styles from "./Button.module.scss";
import SvgIcon from "../svgIcon/SvgIcon";

export type ColorKey = 
  | 'white' | 'red' | 'pastelRed' | 'pinkWhite'
  | 'gray900' | 'gray800' | 'gray700' | 'gray600' | 'gray500' | 'gray400' | 'gray300' | 'gray200' | 'gray100' | 'gray50' | 'gray0'
  | 'blue500' | 'blue400' | 'blue300' | 'blue200'
  | 'green500' | 'green400'
  | 'yellow500' | 'yellow400'
  | 'kakao' | 'naver';


// 색상 키를 CSS 변수로 매핑
const COLOR_MAP: Record<ColorKey, string> = {
  'white': 'var(--color-gray-0)',
  'red': 'var(--color-red)',
  'pastelRed': 'var(--color-red-pastel)',
  'pinkWhite': 'var(--color-red-pinkWhite)',
  'gray900': 'var(--color-gray-900)',
  'gray800': 'var(--color-gray-800)',
  'gray700': 'var(--color-gray-700)',
  'gray600': 'var(--color-gray-600)',
  'gray500': 'var(--color-gray-500)',
  'gray400': 'var(--color-gray-400)',
  'gray300': 'var(--color-gray-300)',
  'gray200': 'var(--color-gray-200)',
  'gray100': 'var(--color-gray-100)',
  'gray50': 'var(--color-gray-50)',
  'gray0': 'var(--color-gray-0)',
  'blue500': 'var(--color-blue-500)',
  'blue400': 'var(--color-blue-400)',
  'blue300': 'var(--color-blue-300)',
  'blue200': 'var(--color-blue-200)',
  'green500': 'var(--color-green-500)',
  'green400': 'var(--color-green-400)',
  'yellow500': 'var(--color-yellow-500)',
  'yellow400': 'var(--color-yellow-400)',
  'kakao': 'var(--color-kakao)',
  'naver': 'var(--color-naver)',
} as const;

export const getColorKeys = (): ColorKey[] => {
  return Object.keys(COLOR_MAP) as ColorKey[];
};

export const getColorValue = (colorKey?: string): string | undefined => {
  if (!colorKey) return undefined;
  
  // CSS 변수 형태인지 확인
  if (colorKey.startsWith('var(')) {
    return colorKey;
  }
  
  // 색상 키를 CSS 변수로 변환
  return COLOR_MAP[colorKey as ColorKey] || colorKey;
};

interface ButtonProps {
  variant?: "solid" | "outline" | "text";
  type?: "primary" | "secondary" | "assistive";
  size?: "sm" | "md" | "lg" | "inputButton";
  disabled?: boolean;
  iconSrc?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPosition?: "left" | "right";
  iconColor?: ColorKey | string;
  onClick?: (() => void) | ((e: MouseEvent<HTMLButtonElement>) => void);
  children: React.ReactNode;
  fullWidth?: boolean;
  buttonColor?: ColorKey | string;
  textColor?: ColorKey | string;
  borderColor?: ColorKey | string;
  buttonType?: "submit" | "button" | "reset";
  style?: React.CSSProperties;
  className?: string;
  showBoxShadow?: boolean;
}

export default function Button({
  variant = "solid",
  type = "primary",
  size = "md",
  disabled = false,
  iconSrc,
  iconPosition = "left",
  iconColor = 'gray900',
  onClick,
  children,
  fullWidth = false,
  buttonColor,
  textColor,
  borderColor,
  buttonType = "button",
  style,
  className,
  showBoxShadow = false,
}: ButtonProps) {
  // 스타일 클래스명 생성
  const getVariantStyle = () => {
    if (disabled) {
      return styles[`disabled${variant.charAt(0).toUpperCase() + variant.slice(1)}${type.charAt(0).toUpperCase() + type.slice(1)}`];
    }
    return styles[`${variant}${type.charAt(0).toUpperCase() + type.slice(1)}`];
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = variant !== "text" ? styles[size] : "";
  const shadowStyle = showBoxShadow ? styles.boxShadow : "";

  const isIconLeft = iconPosition === "left";

  const iconSize = size === "sm" ? 20 : 24;

  // buttonColor와 textColor가 있을 경우 오버라이드 스타일 적용
  const overrideStyles: React.CSSProperties = {
    ...(buttonColor && {
      backgroundColor: getColorValue(buttonColor),
    }),
    ...(textColor && {
      color: getColorValue(textColor),
      ...(variant === "outline" && borderColor && {
        border: `1px solid ${getColorValue(borderColor)}`,
      }),
    }),
  };

  const computedStyle: React.CSSProperties = {
    ...(fullWidth ? { width: "100%" } : {}),
    ...style,
    ...overrideStyles,
  };

  return (
    <button
      type={buttonType}
      className={`${styles.base} ${variantStyle} ${sizeStyle} ${shadowStyle} ${
        className || ""
      }`}
      onClick={onClick}
      style={computedStyle}
      disabled={disabled}
    >
      {iconSrc ? (
        <div className={styles.iconContainer}>
          {isIconLeft && iconSrc && <SvgIcon src={iconSrc} size={iconSize} color={iconColor || 'gray900'} />}
          <span className={styles.text}>{children}</span>
          {!isIconLeft && iconSrc && <SvgIcon src={iconSrc} size={iconSize} color={iconColor || 'gray900'} />}
        </div>
      ) : (
        <span
          className={styles.text}
          style={textColor ? { color: getColorValue(textColor) } : undefined}
        >
          {children}
        </span>
      )}
    </button>
  );
}
