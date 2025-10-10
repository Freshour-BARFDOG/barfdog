import styles from "../Result.module.scss";
import Text from "@src/components/commonV2/text/Text";
import Card from "@src/components/commonV2/card/Card";
import SvgIcon from "@src/components/commonV2/svgIcon/SvgIcon";
import Chips from "@src/components/commonV2/chips/Chips";
import { getObesityStepInfo, getObesityStepRange } from "@util/func/aiObesityAnalysis/getObesityStepInfo";
import { OBESITY_BCS, OBESITY_DEFAULT_COLOR } from "constants/aiObesityAnalysis";

interface BcsInfoProps {
  bcs: number;
}

export default function BcsInfo({ bcs }: BcsInfoProps) {
  const bcsSteps = [bcs, ...getObesityStepRange(bcs)].sort();

  return (
    <article className={styles.bcsInfoContainer}>
      <Text type='title3' align='center'>
        우리 아이가 속한 BCS<br/>
        7단계 체형의 대표적 특징이에요
      </Text>
      <div className={styles.bcsInfoCardList}>
        {bcsSteps.map((step) => {
          const isActive = step === bcs;
          const { label, category, chipsColor, imageColor } = getObesityStepInfo(step);
          return (
            <Card
              key={step}
              shadow='light'
              direction='row'
              gap={12}
              padding={12}
              className={`${styles.bcsInfoCard} ${isActive ? styles[category] : ''}`}
            >
              <SvgIcon 
                src={OBESITY_BCS[step].image} 
                size={120} 
                color={isActive ? imageColor : OBESITY_DEFAULT_COLOR.imageColor}
                backgroundColor={isActive ? '#FFF' : OBESITY_DEFAULT_COLOR.backgroundColor}
              />
              <div className={styles.bcsInfoCardContent}>
                <Text type='label4' color='gray600'>BCS {step}단계</Text>
                <div className={styles.bcsInfoCardTitle}>
                  <Text type='headline1'>{OBESITY_BCS[step].title}</Text>
                  {isActive && 
                    <Chips color={chipsColor} borderRadius='lg'>
                      {label}
                    </Chips>
                  }
                </div>
                <Text type='body3'>{OBESITY_BCS[step].description}</Text>
              </div>
            </Card>
          )
        })}
      </div>
    </article>
  );
}