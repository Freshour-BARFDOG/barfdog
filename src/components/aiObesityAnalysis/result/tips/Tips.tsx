import styles from "../Result.module.scss";
import Image from "next/image";
import TipsImage from "public/img/aiObesityAnalysis/tips.jpg";
import TimerIcon from "public/img/aiObesityAnalysis/timer.svg";
import SquaredotIcon from "public/img/aiObesityAnalysis/squaredot.svg";
import Text from "@src/components/commonV2/text/Text";
import Chips from "@src/components/commonV2/chips/Chips";
import Card from "@src/components/commonV2/card/Card";
import SvgIcon from "@src/components/commonV2/svgIcon/SvgIcon";
import { getObesityGroupInfo } from "@util/func/aiObesityAnalysis/getObesityStepInfo";

interface TipsProps {
  bcs: number;
}

export default function Tips({ bcs }: TipsProps) {
  const { tips, tags, title, description } = getObesityGroupInfo(bcs);

  return (
    <article className={styles.tipsContainer}>
      <Text type='title3' align='center'>
				체형에 따라 달라지는 건강 관리 꿀팁
			</Text>
      <Image
        src={TipsImage} 
        alt='tipsImage' 
        width={335}
        height={200}
        className={styles.tipsImage}
      />
      <div className={styles.tipsChips}>
        {tags.map((tag, index) => (
          <Chips key={index} color="blue50" variant='outlined'># {tag}</Chips>
        ))}
      </div>
      <Card 
        backgroundColor='gray100'
        shadow='none'
        padding={16}
        gap={12}
        className={styles.tipsCard}
      >
        <div className={styles.tipsCardTitle}>
          <SvgIcon src={TimerIcon} width={16} height={20} />
          <Text type='label2' color='gray800' applyLineHeight={false}>
            {title}
          </Text>
        </div>
        <Text type='body3' color='gray700'>
          {description}
        </Text>
        <ul className={styles.tipsList}>
          {tips.map((tip, index) => (
            <li key={index} className={styles.tipItem}>
              <SvgIcon src={SquaredotIcon} size={24} color='gray800' backgroundColor='gray100' />
              <Text type='body3' color='gray700'>{tip}</Text>
            </li>
          ))}
        </ul>
      </Card>
    </article>
  );
}