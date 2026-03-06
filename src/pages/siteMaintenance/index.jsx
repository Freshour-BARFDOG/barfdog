import MetaTitle from '../../components/atoms/MetaTitle';
import Image from 'next/image';
import s from './siteMaintenance.module.scss';

export default function SiteMaintenance() {
  return (
    <>
      <MetaTitle title="시스템 임시 점검 안내" />
      <main className={s.main}>
        <div className={s.icon}>
          <Image
            src="/img/maintenance.png"
            alt="점검 중"
            width={120}
            height={91}
          />
        </div>
        <h1 className={s.title}>시스템 임시 점검 안내</h1>
        <div className={s.desc}>
          <p>더욱 원활한 서비스 제공을 위해</p>
          <p>시스템 점검 및 업데이트를 진행중 입니다.</p>
        </div>
        <div className={s.sub}>
          <p>서비스 이용에 불편을 드려 죄송합니다.</p>
          <p>보다 안정적인 서비스 제공을 위해 노력하겠습니다.</p>
        </div>
        <p className={s.thanks}>감사합니다.</p>
      </main>
    </>
  );
}
