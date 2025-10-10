import React, {
  forwardRef,
  useRef,
  ReactNode,
  ChangeEvent,
  useState,
  KeyboardEvent,
  MouseEvent,
} from "react";
import Text from "../text/Text";
import styles from "./InputField.module.scss";
import CheckIcon from "/public/img/commonV2/check_small.svg";
import SearchIcon from "/public/img/commonV2/search.svg";
import InputClearIcon from "/public/img/commonV2/input_clear.svg";
import VisibilityIcon from "/public/img/commonV2/visibility.svg";
import VisibilityOffIcon from "/public/img/commonV2/visibility_off.svg";
import ErrorIcon from "/public/img/commonV2/close_small.svg";
import SvgIcon from "../svgIcon/SvgIcon";
import Button from "../button/Button";
import InputLabel from "../inputLabel/InputLabel";
import { mergeRefs } from "@util/func/aiObesityAnalysis/mergeRefs";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  error?: string;
  icon?: ReactNode;
  variants?: 'box' | 'line';
  width?: number;
  masking?: boolean;
  maskingButton?: boolean;
  confirmButton?: boolean;
  confirmButtonText?: string;
  confirmButtonVariant?: "solid" | "outline";
  confirmButtonDisabled?: boolean;
  clearButton?: boolean;
  searchButton?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent) => void;
  onReset?: () => void;
  onSubmit?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  labelColor?: "gray600" | "gray700" | "gray800";
  labelPosition?: "top" | "left";
  isRequired?: boolean;
  unit?: string;
  success?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      disabled = false,
      error,
      onChange,
      onBlur,
      variants = "box",
      width,
      masking = false,
      maskingButton = false,
      confirmButton = false,
      confirmButtonText = "입력",
      confirmButtonVariant = "outline",
      confirmButtonDisabled = false,
      clearButton = false,
      searchButton = false,
      onReset,
      onSubmit,
      onKeyDown,
      // icon = null,
      className,
      label,
      isRequired,
      labelColor = "gray700",
      unit,
      success,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement | null>(null);
    const [isMasked, setIsMasked] = useState<boolean>(masking);

    const handlePressInput = () => {
      innerRef.current?.focus();
    };

    const handleToggleMasking = () => {
      setIsMasked((prev) => !prev);
      // 커서 위치 복원
      if (innerRef?.current) {
        const selectionStart = innerRef.current?.selectionStart;
        const selectionEnd = innerRef.current?.selectionEnd;
        setTimeout(() => {
          innerRef.current?.setSelectionRange(selectionStart, selectionEnd);
        }, 0);
      }
    };

    const handleInternalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        onKeyDown(e);
      }
      if (e.key === "Enter" && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
    };
    const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (onReset) {
        onReset();
      }
    };

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit();
      }
    };
    return (
      <div
        onClick={handlePressInput}
        className={className || ""}
        style={{ width: width || "100%" }}
      >
        {/* label 유무에 따라 상단 노출 */}
        {label && (
          <InputLabel
            label={label}
            labelColor={labelColor}
            isRequired={isRequired}
          />
        )}
        <div className={styles.inputBox} style={{ width: width || "100%" }}>
          <div
            className={`${styles.inputWrap} ${styles.inputBase} ${
              variants === 'box' ? styles.inputBoxVariant : styles.inputLineVariant
            } ${error ? (variants === 'box' ? styles.inputErrorBox : styles.inputErrorLine) : ""} ${
              disabled ? "disabled" : ""
            }`}
            style={{ flex: confirmButton ? "1 0 0" : "unset" }}
          >
            {/* 검색 기능 추가 필요 */}
            {searchButton && (
              <button className={styles.searchButton}>
                <SvgIcon src={SearchIcon} size={24} />
              </button>
            )}
            <input
              {...props}
              ref={ref ? mergeRefs(innerRef, ref) : innerRef}
              disabled={disabled}
              className={styles.input}
              type={isMasked ? "password" : props.type}
              value={props.value}
              onChange={(e) => {
                onChange?.(e);
              }}
              onBlur={(e) => {
                if (onBlur) {
                  onBlur?.(e);
                }
              }}
              onKeyDown={handleInternalKeyDown}
            />
            {unit && (
              <Text
                type="headline3"
                color="gray900"
                className={styles.unit}
              >
                {unit}
              </Text>
            )}
            <div className={styles.rightButtons}>
              {/* 비밀번호 숨김 토글 기능 */}
              {masking && maskingButton && (
                <button
                  onClick={handleToggleMasking}
                  className={styles.baseButton}
                >
                  <SvgIcon
                    src={isMasked ? VisibilityOffIcon : VisibilityIcon}
                    size={24}
                  />
                </button>
              )}
              {/* value 리셋 기능 */}
              {clearButton && (
                <button onClick={handleReset} className={styles.baseButton}>
                  <SvgIcon src={InputClearIcon} size={24} />
                </button>
              )}
            </div>
          </div>
          {/* 버튼 사이드 confirm 버튼 (인증하기 / 확인 등)*/}
          {confirmButton && (
            <Button
              variant={confirmButtonVariant}
              onClick={handleSubmit}
              size="lg"
              className={styles.confirmButton}
              disabled={confirmButtonDisabled}
            >
              {confirmButtonText}
            </Button>
          )}
        </div>
        {error && (
          <div className={styles.inputStateText}>
            <SvgIcon src={ErrorIcon} color="red" size={18} />
            <Text type="caption" color="red" align="left">
              {error}
            </Text>
          </div>
        )}
        {success && (
          <div className={styles.inputStateText}>
            <SvgIcon src={CheckIcon} color="blue500" size={18} />
            <Text type="caption" color="blue500" align="left">
              {success}
            </Text>
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
