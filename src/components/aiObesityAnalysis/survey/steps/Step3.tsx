import styles from '../Survey.module.scss';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef } from "react";
import LightImage from '/public/img/aiObesityAnalysis/light.svg';
import PhotoImage from '/public/img/aiObesityAnalysis/photo.svg';
import Text from "@src/components/commonV2/text/Text";
import SvgIcon from "@src/components/commonV2/svgIcon/SvgIcon";
import Button from "@src/components/commonV2/button/Button";

interface Step3Props {
	files: File[];
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	steps: number;
	setSteps: Dispatch<SetStateAction<1 | 2 | 3 | 4 | 5>>;
	inputRef: React.RefObject<HTMLInputElement>;
}

export default function Step3({
	files,
	handleChange,
	steps,
	setSteps,
	inputRef,
}: Step3Props) {

	useEffect(() => {
		if (files.length > 0 && steps !== 4) {
			setSteps(4);
		}
	}, [files, steps]);

	return (
		<>
			<Text type='title2' align='center' className={styles.surveyTitle}>
				우리 아이 사진을<br/>업로드해 주세요
			</Text>
			<div className={styles.surveyUploadContainer}>
				<div className={styles.surveyLightIcon}>
					<SvgIcon src={LightImage} size={24} />
					<Text type='label4' color='blue500'>TIP! 간식이나 장난감을 들고 아이가 앞에서 멈췄을 때 촬영해 보세요!</Text>
				</div>
				<input
					type="file"
					multiple
					accept="image/*"
					// capture="environment"
					onChange={handleChange}
					ref={inputRef}
					style={{ display: 'none' }}
				/>
				<div onClick={() => inputRef?.current?.click()} className={styles.surveyUploadBox}>
					<SvgIcon src={PhotoImage} size={60} />
					<Button variant='solid' buttonColor='gray900'>업로드하기</Button>
				</div>
			</div>
		</>
	);
}