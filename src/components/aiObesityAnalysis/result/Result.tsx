import styles from './Result.module.scss';
import { useState, useEffect } from 'react';
import LifetLogo from '/public/img/aiObesityAnalysis/lifet.svg';
import Divider from '@src/components/commonV2/divider/Divider';
import SvgIcon from '@src/components/commonV2/svgIcon/SvgIcon';
import Text from '@src/components/commonV2/text/Text';
import DefaultInfo from './defaultInfo/DefaultInfo';
import BcsInfo from './bcsInfo/BcsInfo';
import Tips from './tips/Tips';
import ItemList from './itemList/ItemList';
import SurveyInfo from './surveyInfo/SurveyInfo';
import { getObesityDetail } from 'service/aiObesityAnalysis';
import { ObesityDetailResponse } from 'type/aiObesityAnalysis/aiObesityAnalysis';

export default function Result({ surveyId }: { surveyId: string }) {
  const [data, setData] = useState<ObesityDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!surveyId) return;
      
      try {
        setLoading(true);
        const result = await getObesityDetail(Number(surveyId));
        setData(result);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surveyId]);

  if (loading) {
    return (
      <div className={styles.resultContainer}>
        <Text type='title2' align='center'>결과 로딩 중...</Text>
        <Text type='body3' align='center'>잠시만 기다려주세요.</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.resultContainer}>
        <Text type='title2' align='center'>오류 발생</Text>
        <Text type='body3' align='center'>{error}</Text>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.resultContainer}>
        <Text type='title2' align='center'>데이터 없음</Text>
        <Text type='body3' align='center'>결과 데이터를 찾을 수 없습니다.</Text>
      </div>
    );
  }

  return (
    <section className={styles.resultContainer}>
      <DefaultInfo data={data} />
      <Divider thickness={8} color='gray-100' />
      <BcsInfo bcs={data.bcs} />
      <Divider thickness={8} color='gray-100' />
      <Tips bcs={data.bcs} />
      <Divider thickness={8} color='gray-100' />
      <ItemList />
      <Divider thickness={8} color='gray-100' />
      <SurveyInfo />
      <article className={styles.lifetLogoBox}>
        <SvgIcon src={LifetLogo} width={100} height={14} className={styles.lifetLogo} />
      </article>
    </section>
  );
}