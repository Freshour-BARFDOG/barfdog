import { useRouter } from "next/router";
import styles from "/src/components/admin/alliance/setting/allianceSetting.module.scss";
import tableStyle from "/src/components/popup/admin_ProductInfo/popup_sell.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import AllianceDetailInfo from "/src/components/admin/alliance/setting/AllianceDetailInfo";
import { couponUseType } from "/store/TYPE/couponType";
import { filterDateTimeSeperator } from "/util/func/filter_dateAndTime";
import { getAllianceCouponDetail } from "/service/admin";

const CouponDetail = ({ allianceDetail }) => {
  const router = useRouter();
  const { couponInfo, couponUsedHistory } = allianceDetail;
  const allianceCouponDetailInfo = [
    {
      label: '쿠폰 정보',
      items: [
        { label: '쿠폰 생성일', value: filterDateTimeSeperator(couponInfo?.createdCouponDate, 'T', ' '), fullWidth: true },
        { label: '제휴사', value: couponInfo?.allianceName },
        { label: '행사', value: couponInfo?.eventName },
        { label: '쿠폰 이름', value: couponInfo?.couponName },
        { label: '쿠폰 설명', value: couponInfo?.couponDescription },
        { label: '사용처', value: couponUseType.KOR[couponInfo?.couponTarget] },
        { label: '할인', value: couponInfo?.discountDegree },
        { label: '최대 할인금액', value: `${couponInfo?.availableMaxDiscount.toLocaleString()}원` },
        { label: '최소 사용금액', value: `${couponInfo?.availableMinPrice.toLocaleString()}원` },
        { label: '쿠폰 개수', value: `${couponInfo?.couponCount.toLocaleString()}개` },
        { label: '쿠폰 코드 자릿수', value: `${couponInfo?.couponCodeLength}자리` },
        { label: '쿠폰 사용 시작일', value: filterDateTimeSeperator(couponInfo?.useStartDate, "T",  ' ') },
        { label: '쿠폰 사용 종료일', value: filterDateTimeSeperator(couponInfo?.useExpiredDate, "T",  ' ') },
      ],
    },
    {
      label: '쿠폰 사용 현황',
      items: [
        { label: '쿠폰 등록 개수', value: couponUsedHistory?.couponCreatedCount.toLocaleString() },
        { label: '쿠폰 사용 개수', value: couponUsedHistory?.usedCouponCount.toLocaleString() },
        { label: '일반 상품', value: couponUsedHistory?.generalItemCount.toLocaleString() },
        { label: '구독 상품', value: couponUsedHistory?.subscriptionItemCount.toLocaleString() },
      ],
    },
  ]
  return (
    <div>
      <MetaTitle title="쿠폰 생성 내역 상세보기" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">
            쿠폰 생성 내역 상세보기
          </h1>
          <section className={`cont ${styles.detailContainer}`}>
            <h1 className={styles.detailTitle}>{couponInfo.allianceName}</h1>
            <article className={tableStyle.table}>
              <AllianceDetailInfo infoList={allianceCouponDetailInfo} />
            </article>
          </section>
          <div className="btn_section outer">
            <button
              type="button"
              className='admin_btn confirm_l line'
              onClick={() => router.back()}
            >
              목록
            </button>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </div>
  );
};

export async function getServerSideProps({ req, query }) {
  const allianceDetail = await getAllianceCouponDetail(req, query.id);
  return {
    props: {
      allianceDetail,
    }
  };

}

export default CouponDetail;