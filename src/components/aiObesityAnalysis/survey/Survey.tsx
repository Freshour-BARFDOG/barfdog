import styles from './Survey.module.scss';
import { useRef, useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import LoadingImage from '/public/img/aiObesityAnalysis/scan.gif';
import LifetLogo from '/public/img/aiObesityAnalysis/lifet.svg';
import SvgIcon from "@src/components/commonV2/svgIcon/SvgIcon";
import Text from "@src/components/commonV2/text/Text";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import useDeviceState from "@util/hook/useDeviceState";
import { useImageUpload } from "@util/hook/useImageUpload";
import { getObesityDetail, uploadObesityImage } from "service/aiObesityAnalysis";
import { useModalContext } from '@store/modal-context';
import Modal_global_alert from '@src/components/modal/Modal_global_alert';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function Survey() {
	const mct = useModalContext();
  const router = useRouter();
  const { isMobile } = useDeviceState();

  const [weight, setWeight] = useState<string | null>(null);
	const [steps, setSteps] = useState<1 | 2 | 3 | 4 | 5>(1);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');


  const inputRef = useRef<HTMLInputElement>(null);

  const {
		files,
		previews,
		handleChange: originalHandleChange,
		resetFiles,
	} = useImageUpload({ multiple: false });

	// 이미지 업로드 시 에러 처리
	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
		try {
			await originalHandleChange(e);
		} catch (error) {
			console.error("파일 업로드 에러:", error);
			if (error instanceof Error) {
				setErrorMessage(error.message);
				mct.alertShow();
			}
		}
	};

	const handleSubmit = async () => {
		if (files.length < 1 || !weight) return;
		
    await sleep(1000);
    setLoading(true);
		
		try {
			// 1. 이미지 업로드
			const uploadResult = await uploadObesityImage(files[0], Number(weight));
			const surveyId = uploadResult?.surveyId;

			if (!surveyId) {
        setLoading(false);
				throw new Error('서버 응답에 문제가 있습니다. 다시 시도해주세요.');
			}

			// 2. 결과 데이터 미리 로드 (백그라운드에서 실행)
			getObesityDetail(surveyId)
				.then()
				.catch((prefetchError) => {
					console.warn('결과 데이터 미리 로드 실패:', prefetchError);
					// 미리 로드 실패해도 페이지 이동은 진행
				});

			// 3. 결과 페이지로 이동
			router.push(`/ai-obesity-analysis/result/${surveyId}`);
			
		} catch (error) {
			console.error("업로드 실패:", error);
			
			let errorMessage = '예기치 못한 문제가 발생하여 요청을 완료할 수 없습니다. 잠시 후 다시 시도해주세요.';
			
			if (error instanceof Error) {
				if (error.message.includes('Network Error')) {
					errorMessage = '네트워크 연결을 확인해주세요.';
				} else if (error.message.includes('timeout')) {
					errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
				} else if (error.message.includes('Request Entity Too Large')) {
					errorMessage = '업로드 용량이 초과되었습니다.\n이미지 업로드는 5MB 이하까지 가능합니다.';
				}

				setErrorMessage(errorMessage);
			}
			
			mct.alertShow();
		} finally {
			setLoading(false);
		}
	};


  if (loading) {
		return (
			<section className={styles.surveyContainer}>
        <Text type='title2' align='center' className={styles.surveyTitle}>
          우리 아이의 결과를<br />분석하고 있어요
        </Text>
        <Image src={LoadingImage} alt='loadingImage' width={265} height={425} className={styles.surveyLoadingImage} />
        <SvgIcon src={LifetLogo} width={100} height={14} className={styles.lifetLogo} />
			</section>
		);
	}

  return (
		<>
		
			<div className={`${styles.surveyContainer} ${isMobile ? styles.isMobile : ''}`}>
				{ steps === 1 && 
					<Step1 
						weight={weight} 
						setWeight={setWeight} 
						setSteps={setSteps} 
						isMobile={isMobile} 
					/>
				}
				{ steps === 2 && <Step2 setSteps={setSteps} isMobile={isMobile} /> }
				{ steps === 3 &&
					<Step3
						files={files}
						handleChange={handleChange}
						steps={steps}
						setSteps={setSteps}
						inputRef={inputRef}
					/>
				}
				{steps === 4 &&
					<Step4
						previews={previews}
						setSteps={setSteps}
						resetFiles={resetFiles}
						handleSubmit={handleSubmit}
						loading={loading}
						isMobile={isMobile}
						handleChange={handleChange}
						inputRef={inputRef}
					/>
				}
			</div>
			{errorMessage && 
				<Modal_global_alert 
					message={errorMessage} 
					onClick={() => {
						setErrorMessage('');
						mct.alertHide();
					}} 
				/>
			}
		</>
  );
}