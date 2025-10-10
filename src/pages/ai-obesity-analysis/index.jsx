import styles from './AiObesityAnalysis.module.scss';
import MetaTitle from "@src/components/atoms/MetaTitle";
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import Survey from '/src/components/aiObesityAnalysis/survey/Survey';
import useDeviceState from '/util/hook/useDeviceState';

export default function AiObesityAnalysisPage() {
  const { isMobile } = useDeviceState();

  return (
    <>
      <MetaTitle title="비만 AI 진단" />
      <Layout showFooter={false} showDeadlineTimer={false}>
        <Wrapper className={`${styles.aiObesityAnalysisContainer} ${isMobile ? styles.isMobile : ''}`}>
          <section className={styles.aiObesityAnalysis}>
            <Survey />
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}