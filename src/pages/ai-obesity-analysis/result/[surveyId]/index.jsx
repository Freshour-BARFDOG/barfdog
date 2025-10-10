import { useRouter } from 'next/router';
import styles from '../../AiObesityAnalysis.module.scss';
import MetaTitle from "@src/components/atoms/MetaTitle";
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import useDeviceState from '/util/hook/useDeviceState';
import Result from '/src/components/aiObesityAnalysis/result/Result';

export default function AiObesityAnalysisResultPage() {
  const { isMobile } = useDeviceState();
  const { surveyId } = useRouter().query;

  return (
    <>
      <MetaTitle title="비만 AI 진단" />
      <Layout showFooter={false} showDeadlineTimer={false}>
        <Wrapper className={`${styles.aiObesityAnalysisContainer} ${isMobile ? styles.isMobile : ''}`}>
          <div className={styles.aiObesityAnalysis}>
            <Result surveyId={surveyId} />
          </div>
        </Wrapper>
      </Layout>
    </>
  );
}