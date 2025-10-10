import styles from '../Survey.module.scss';
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Text from "@src/components/commonV2/text/Text";
import Ex1Image from '/public/img/aiObesityAnalysis/ex1.png';
import Ex2Image from '/public/img/aiObesityAnalysis/ex2.png';
import Ex3Image from '/public/img/aiObesityAnalysis/ex3.png';
import Info1Image from '/public/img/aiObesityAnalysis/info1.png';
import Info2Image from '/public/img/aiObesityAnalysis/info2.png';
import Info3Image from '/public/img/aiObesityAnalysis/info3.png';
import Info4Image from '/public/img/aiObesityAnalysis/info4.png';
import SurveyButton from '../surveyButton/SurveyButton';

interface Step2Props {
	isMobile: boolean;
	setSteps: Dispatch<SetStateAction<1 | 2 | 3 | 4 | 5>>;
}

export default function Step2({
	setSteps,
	isMobile,
}: Step2Props) {
	// 헬퍼 함수들
	const getImageWidth = (info: any) => {
		if (!isMobile) return info.width;
		return info.key === 'info' ? '100%' : '50%';
	};

	const getImageHeight = (info: any) => {
		return !isMobile ? info.height : 'auto';
	};

	const getImageClassName = (info: any) => {
		const baseClass = styles.surveyInfoImageBox;
		const gridClass = info.key === 'info' && isMobile ? styles.infoGrid : '';
		return `${baseClass} ${gridClass}`.trim();
	};

	// 이미지 설정
	const imageConfigs = {
		example: {
			images: [Ex1Image, Ex2Image, Ex3Image],
			width: 181,
			height: 315,
			excludeLastOnMobile: true,
		},
		info: {
			images: [Info1Image, Info2Image, Info3Image, Info4Image],
			width: 134,
			height: 146,
			excludeLastOnMobile: false,
		}
	};

	const infoList = [
		{
			key: 'example',
			title: '이렇게 촬영해주세요!',
			...imageConfigs.example,
			images: isMobile && imageConfigs.example.excludeLastOnMobile 
				? imageConfigs.example.images.slice(0, -1) 
				: imageConfigs.example.images,
			descriptions: [
				'•  일어서있는 아이를 수직으로 보는 시점에서',
				'•  몸 전체가 잘리는 부분 없이 화면에 꽉 차도록',
				'•  기본 카메라를 사용해 수평을 맞춰 세로로 촬영',
			]
		},
		{
			key: 'info',
			title: '이런 촬영은 주의해 주세요!',
			...imageConfigs.info,
			descriptions: []
		},
	]
	return (
		<div className={styles.surveyInfoContainer}>
			<Text type='title2' align='left' className={styles.surveyTitle}>
				촬영 가이드를 확인해 주세요
			</Text>
			<div className={styles.surveyInfo}>
				{infoList.map((info) => (
					<div key={info.title} className={styles.surveyInfoItem}>
						<Text type='label1'>{info.title}</Text>
						<div className={getImageClassName(info)}>
							{info.images.map((image, index) => (
								<Image
									key={index} 
									src={image} 
									alt={`${info.title}-${index}`} 
									style={{ 
										aspectRatio: `${info.width} / ${info.height}`,
										width: getImageWidth(info),
										height: getImageHeight(info),
									}}
									className={styles.surveyInfoImage} 
								/>
							))}
						</div>
						{info.descriptions.length > 0 && 
							<div>
								{info.descriptions.map((description, index) => (
								<Text key={index} type='label2' block color='gray700'>
									{description}
								</Text>
							))}
							</div>
						}
					</div>
				))}
			</div>
			<SurveyButton
				nextButtonLabel='확인했어요'
				handleNextStep={() => setSteps(3)}
				handlePrevStep={() => setSteps(1)}
				isMobile={isMobile}
			/>
		</div>
	);
}