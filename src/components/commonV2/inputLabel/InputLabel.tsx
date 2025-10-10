import styles from "./InputLabel.module.scss";
import Text from "../text/Text";

interface InputLabelProps {
  label: string;
  labelColor: "gray600" | "gray700" | "gray800";
  labelType?: "label4" | "headline4";
  isRequired?: boolean;
}

const InputLabel = ({
  labelType = "label4",
  label,
  labelColor,
  isRequired = false,
}: InputLabelProps) => {
  return (
    <Text
      type={labelType}
      color={labelColor}
      className={styles.labelStyle}
    >
      {label} {isRequired && <span className={styles.pointColor}>*</span>}
    </Text>
  );
};

export default InputLabel;
