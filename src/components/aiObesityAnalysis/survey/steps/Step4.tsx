import styles from '../Survey.module.scss';
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Text from "@src/components/commonV2/text/Text";
import InfoBox from "@src/components/commonV2/infoBox/InfoBox";
import SurveyButton from '../surveyButton/SurveyButton';
import Button from '@src/components/commonV2/button/Button';

interface Step4Props {
	previews: string[];
	setSteps: Dispatch<SetStateAction<1 | 2 | 3 | 4 | 5>>;
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	resetFiles: () => void;
	handleSubmit: () => Promise<void>;
	loading: boolean;
	isMobile: boolean;
	inputRef: React.RefObject<HTMLInputElement>;
}

export default function Step4({
	previews,
	setSteps,
	handleChange,
	resetFiles,
	handleSubmit,
	isMobile,
	inputRef,
}: Step4Props) {

	const handleGoBack = () => {
		resetFiles();
		setSteps(3);
	}
	return (
		<div className={styles.surveyPreviewContainer}>
			<Text type='title2' align='center' className={styles.surveyTitle}>
				아래의 사진으로 <br/>비만 분석을 진행할까요?
			</Text>
			<div className={styles.surveyPreviewBox}>
				<div className={styles.surveyGoBackButtonBox}>
					<Button 
						variant='outline' 
						type='assistive' 
						size='sm'
						onClick={() => inputRef?.current?.click()}
						className={styles.surveyGoBackButton}
					>
						<input
							type="file"
							multiple
							accept="image/*"
							onChange={handleChange}
							ref={inputRef}
							style={{ display: 'none' }}
						/>
						재촬영/업로드
					</Button>
				</div>
				<InfoBox text='촬영 가이드에 맞지 않는 사진은 AI가 인식하기 어려워요. 가이드를 꼭 지켜주세요' />
				<div className={styles.surveyPreviewImageBox}>
					<Image
						src={previews[0]}
						alt='uploaded image'
						layout='fill'
						className={`${styles.surveyImage} ${styles.surveyPreviewImage} ${isMobile ? styles.isMobile : ''}`}
					/>
				</div>
			</div>
			<SurveyButton
				nextButtonLabel='제출하기'
				handleNextStep={handleSubmit}
				handlePrevStep={handleGoBack}
				isMobile={isMobile}
			/>
		</div>
	);
}