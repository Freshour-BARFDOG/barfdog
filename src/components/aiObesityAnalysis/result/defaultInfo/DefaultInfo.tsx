import styles from "../Result.module.scss";
import { useState } from "react";
import Image from "next/image";
import WeightIcon from '/public/img/aiObesityAnalysis/weight-sm.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import Text from "@src/components/commonV2/text/Text";
import SvgIcon from "@src/components/commonV2/svgIcon/SvgIcon";
import Card from "@src/components/commonV2/card/Card";
import Divider from "@src/components/commonV2/divider/Divider";
import { ObesityDetailResponse } from "type/aiObesityAnalysis/aiObesityAnalysis";

interface DefaultInfoProps {
	data: ObesityDetailResponse;
}

export default function DefaultInfo({
	data,
}: DefaultInfoProps) {
	const obesityLabelMatch = data.status?.match(/\(([^)]+)\)/);
	const obesityLabel = obesityLabelMatch ? obesityLabelMatch[1] : '';

	const imageList = [data?.fileUrl, data?.oriFileUrl].map((file, index) =>
		({
			url: file,
			filename: index === 0 ? 'fileUrl' : 'oriFileUrl'
		})
	);
	
	const [ratios, setRatios] = useState<{ [key: string]: number }>({});

  const handleImageLoad = (filename: string) => (img: HTMLImageElement) => {
    const { naturalWidth, naturalHeight } = img;
    if (naturalWidth && naturalHeight) {
      setRatios((prev) => ({
        ...prev,
        [filename]: naturalHeight / naturalWidth,
      }));
    }
  };

	return (
		<article className={styles.resultInfoContainer}>
			<Text type='title3' align='center'>
				AI 비만도 분석 결과 리포트
			</Text>
			<Card 
				shadow='strong' 
				direction='col'
				gap={12} 
				borderRadius={16} 
				className={styles.resultCard}
			>
				<Text type='headline3' align='center' className={styles.resultTitle}>
					<SvgIcon src={WeightIcon} size={32} />
					<span>
						{data.score}점으로 <span className={styles.pointColor}>{data?.status}</span> 결과를 받았어요
					</span>
				</Text>
				<Card shadow='none' backgroundColor='gray100' borderRadius={12} padding={16}>
					<div className={styles.resultDetail}>
						<div className={styles.resultBcs}>
							<Text type='headline2' color='red' align='center'>
								BCS {data.bcs}단계
							</Text>
							<Text type='title2' color='red' align='center'>
								{obesityLabel}
							</Text>
						</div>
						<Divider direction='vertical' thickness={1} color='gray-300' style={{ height: '100%' }} />
						<Text type='body3'>
							{data.description}
						</Text>
					</div>
				</Card>
				<Swiper
					slidesPerView='auto'
					pagination
					modules={[Pagination]}
					className={styles.resultImageSwiper}
				>
					{imageList?.map(image => {
						const ratio = ratios[image.filename];
						return  (
							<SwiperSlide key={image.filename} className={styles.resultImageSwiperSlide}>
								<div 
									className={styles.imageContainer}
									style={{
										position: 'relative',
										width: '100%',
										height: ratio ? `${ratio * 100}%` : '200px',
									}}
								>
									<Image 
										src={image.url}
										alt={image.filename}
										layout="fill"
										className={styles.resultImage}
										onLoadingComplete={handleImageLoad(image.filename)}
									/>
								</div>
							</SwiperSlide>
						)
					})}
				</Swiper>
			</Card>
		</article>
	);
}