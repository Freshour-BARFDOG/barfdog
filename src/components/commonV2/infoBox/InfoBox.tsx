import HelpIcon from "/public/img/commonV2/help.svg";
import InfoIcon from "/public/img/commonV2/info.svg";
import ArrowRightIcon from "/public/img/commonV2/chevron-right-blue.svg";
import Text from "@src/components/commonV2/text/Text";
import styles from "./InfoBox.module.scss";
import SvgIcon from "@src/components/commonV2/svgIcon/SvgIcon";

interface InfoBoxProps {
  type?: "help" | "info";
  color?: "red" | "blue" | "gray";
  showRightArrowButton?: boolean;
  text: string;
  fullWidth?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const InfoBox = ({
  type = "info",
  color = "gray",
  showRightArrowButton = false,
  text,
  fullWidth = false,
  onClick,
  style,
  className,
}: InfoBoxProps) => {
  const iconColor =
    color === "gray"
      ? "gray700"
      : color === "red"
      ? "pastelRed"
      : color === "blue"
      ? "blue500"
      : "gray700";

  return (
    <div
      className={`${styles.infoBoxBase} ${styles[color]} ${
        onClick ? styles.clickable : styles.default
      } ${fullWidth ? styles.fullWidth : ""} ${className || ""}`}
      onClick={onClick || undefined}
      style={style}
    >
      <div className={styles.infoBoxStyle}>
        <SvgIcon
          src={type === "help" ? HelpIcon : InfoIcon}
          color={iconColor}
        />
        <Text type="label4" color={iconColor} className={styles.infoTextStyle}>
          {text}
        </Text>
      </div>
      {showRightArrowButton && (
        <button>
          <SvgIcon src={ArrowRightIcon} color={iconColor} />
        </button>
      )}
    </div>
  );
};

export default InfoBox;
