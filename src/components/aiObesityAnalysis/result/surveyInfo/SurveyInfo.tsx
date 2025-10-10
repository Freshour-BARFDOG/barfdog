import styles from '../Result.module.scss';
import { useRouter } from "next/router";
import Image from "next/image";
import SurveyInfoImage from '/public/img/aiObesityAnalysis/surveyInfo.jpg';
import Text from "@src/components/commonV2/text/Text";
import Button from "@src/components/commonV2/button/Button";

export default function SurveyInfo() {
  const router = useRouter();
  return (
    <article className={styles.surveyInfoContainer}>
      <div className={styles.surveyInfoTitle}>
        <Text type='title3' align='center'> 
          체중 관리가 고민이라면<br />맞춤형 식단으로 관리해 보세요
        </Text>
        <Text type='body3' align='center' color='gray600'>
          AI를 통해 활동량과 나이, 몸무게, 알러지, 건강 고민에 따른<br/>맞춤 식단을 추천해 드려요
        </Text>
      </div>
      <Image 
        src={SurveyInfoImage} 
        alt='surveyInfoImage'
        width={560} 
        height={240} 
        className={styles.surveyInfoImage}
      />
      <Button onClick={() => router.push('/surveyGuide')}>
        식단 추천 받으러 가기
      </Button>
    </article>
  );
}