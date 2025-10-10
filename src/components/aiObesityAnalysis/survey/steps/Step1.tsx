import styles from '../Survey.module.scss';
import { Dispatch, SetStateAction } from "react";
import WeightImage from '/public/img/aiObesityAnalysis/weight.svg';
import SvgIcon from '@src/components/commonV2/svgIcon/SvgIcon';
import InputField from '@src/components/commonV2/inputField/InputField';
import Text from '@src/components/commonV2/text/Text';
import SurveyButton from '../surveyButton/SurveyButton';

interface Step1Props {
	weight: number | null;
	setWeight: (value: number) => void;
	setSteps: Dispatch<SetStateAction<1 | 2 | 3 | 4 | 5>>;	
	isMobile: boolean;
}

export default function Step1({
	weight,
	setWeight,
	setSteps,
	isMobile,
}: Step1Props) {
	const isValid = !!(weight && Number(weight) > 0);
	const handleGoNextStep = () => {
		if (isValid) {
			setSteps(2);
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
						type="number"
						step="0.1"
						value={weight ?? ''}
						onChange={(e) => {
							const value = e.target.value;
							if (value === '' || /^\d*\.?\d{0,1}$/.test(value)) {
								setWeight(Number(value));
							}
						}}
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