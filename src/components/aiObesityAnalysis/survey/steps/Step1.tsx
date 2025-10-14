import styles from '../Survey.module.scss';
import { Dispatch, SetStateAction } from "react";
import WeightImage from '/public/img/aiObesityAnalysis/weight.svg';
import SvgIcon from '@src/components/commonV2/svgIcon/SvgIcon';
import InputField from '@src/components/commonV2/inputField/InputField';
import Text from '@src/components/commonV2/text/Text';
import SurveyButton from '../surveyButton/SurveyButton';

interface Step1Props {
	weight: string | null;
	setWeight: (value: string | null) => void;
	setSteps: Dispatch<SetStateAction<1 | 2 | 3 | 4 | 5>>;	
	isMobile: boolean;
}

export default function Step1({
	weight,
	setWeight,
	setSteps,
	isMobile,
}: Step1Props) {
	const isValid = !!(weight && weight !== '' && Number(weight) > 0);
	
	const handleGoNextStep = () => {
		if (isValid) {
			setSteps(2);
		}
	}

	// 숫자와 소수점 1자리까지만 허용하는 정규식
	const isValidWeightInput = (value: string) => /^\d*\.?\d{0,1}$/.test(value);
	
	// 소수점 1자리 초과 입력 방지
	const isDecimalLimitExceeded = (value: string) => {
		if (!value.includes('.')) return false;
		const decimalPart = value.split('.')[1];
		return decimalPart && decimalPart.length > 1;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		
		// 빈 문자열이거나 유효한 입력인 경우에만 상태 업데이트
		if (value === '' || isValidWeightInput(value)) {
			setWeight(value === '' ? null : value);
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// 숫자와 소수점만 허용
		if (!/[0-9.]/.test(e.key)) {
			e.preventDefault();
			return;
		}
		
		const currentValue = (e.target as HTMLInputElement).value;
		const newValue = currentValue + e.key;
		
		// 소수점 중복 또는 소수점 1자리 초과 방지
		if (e.key === '.' && currentValue.includes('.')) {
			e.preventDefault();
			return;
		}
		
		if (isDecimalLimitExceeded(newValue)) {
			e.preventDefault();
			return;
		}
	}

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const paste = e.clipboardData.getData('text');
		if (!isValidWeightInput(paste)) {
			e.preventDefault();
		}
	}

	return (
		<>
			<Text type='title2' align='center' className={styles.surveyTitle}>
				우리 아이의<br/>체중을 알려주세요
			</Text>
			<div className={styles.surveyInputContainer}>
				<SvgIcon src={WeightImage} size={100} />
				<div className={styles.surveyInput}>
					<InputField
						type="text"
						inputMode="decimal"
						value={weight ?? ''}
						onChange={handleChange}
						onKeyPress={handleKeyPress}
						onPaste={handlePaste}
						onSubmit={handleGoNextStep}
						placeholder='몸무게 입력'
						unit='kg'
					/>
					<Text type='body3' color='gray600'>소수점 1자리까지만 입력 가능해요</Text>
				</div>
			</div>
			{isValid &&
				<SurveyButton
					handleNextStep={handleGoNextStep}
					handlePrevStep={() => {}}
					isMobile={isMobile}
					showPrevButton={false}
				/>
			}
		</>
	);
}