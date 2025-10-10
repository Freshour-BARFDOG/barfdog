import { ReactNode } from "react";
import Button from "../button/Button";
import styles from "./ButtonDocked.module.scss";

interface ButtonDockedProps {
	type: 'text-button' | 'full-button' | 'dual-button';
	text?: ReactNode;
	primaryButtonLabel: string | ReactNode;
	secondaryButtonLabel?: string;
	onPrimaryClick: () => void;
	onSecondaryClick?: () => void;
	primaryButtonSize?: 'sm' | 'md' | 'lg';
	secondaryButtonType?: 'primary' | 'assistive';
	primaryButtonVariant?: 'solid' | 'outline';
	primaryButtonType?: 'primary' | 'assistive';
	isPrimaryDisabled?: boolean;
	primaryCount?: number;
	position?: 'sticky' | 'fixed';
}

export default function ButtonDocked({
	type,
	text,
	primaryButtonLabel,
	secondaryButtonLabel,
	onPrimaryClick,
	onSecondaryClick,
	primaryButtonSize = 'md',
	isPrimaryDisabled = false,
	secondaryButtonType = 'primary',
	primaryButtonVariant = 'solid',
	primaryButtonType = 'primary',
	primaryCount,
	position = 'fixed',
}: ButtonDockedProps) {
	// 스타일 클래스명 생성
	const getButtonStyle = (size: string) => {
		return styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`];
	};

	const getContainerStyle = (type: string) => {
		const styleMap: Record<string, string> = {
			'full-button': styles.fullButton,
			'dual-button': styles.dualButton,
			'text-button': styles.textButton,
		};
		return styleMap[type];
	};

	const getPositionStyle = (position: string) => {
		return styles[position];
	};

	const primaryButtonStyle = type !== 'full-button' ? getButtonStyle(primaryButtonSize) : '';
	const secondaryButtonStyle = type === 'dual-button' && primaryButtonSize === 'lg' 
		? getButtonStyle('sm') 
		: getButtonStyle(primaryButtonSize);
	const textStyle = type === 'text-button' && primaryButtonSize === 'sm' 
		? getButtonStyle('lg') 
		: getButtonStyle(primaryButtonSize);

	const positionStyle = getPositionStyle(position);
	const containerStyle = getContainerStyle(type);

	return (
		<div className={`${containerStyle} ${styles.containerBase} ${positionStyle}`}>
			{type === 'text-button' &&
				<div className={textStyle}>
					{text}
				</div>
			}
			{type === 'dual-button' && secondaryButtonLabel &&
				<Button onClick={onSecondaryClick} type={secondaryButtonType} variant='outline' className={secondaryButtonStyle}>
					{secondaryButtonLabel}
				</Button>
			}
			<Button onClick={onPrimaryClick} fullWidth={type === 'full-button'} type={primaryButtonType} variant={primaryButtonVariant} disabled={isPrimaryDisabled} className={primaryButtonStyle || ''}>
				{primaryButtonLabel}
				{primaryCount != null && (
          <span className={styles.primaryCountBox}>{primaryCount}</span>
        )}
			</Button>
		</div>
	);
}