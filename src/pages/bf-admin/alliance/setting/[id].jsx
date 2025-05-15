import React, {Fragment, useState} from 'react';
import { useRouter } from "next/router";
import { format } from "date-fns";
import tableStyle from "/src/components/popup/admin_ProductInfo/popup_sell.module.scss";
import styles from '/src/components/admin/alliance/setting/allianceSetting.module.scss';
import s from "/src/components/admin/alliance/common/allianceCommon.module.scss";
import { Button } from "antd";
import MetaTitle from "/src/components/atoms/MetaTitle";
import PureCheckbox from "/src/components/atoms/PureCheckbox";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import AllianceDetailInfo from "/src/components/admin/alliance/setting/AllianceDetailInfo";
import AllianceTable from "/src/components/admin/alliance/common/AllianceTable";
import AllianceEventAddModal from "/src/components/admin/alliance/setting/modal/AllianceEventAddModal";
import AllianceDeleteModal from "/src/components/admin/alliance/setting/modal/AllianceDeleteModal";
import Spinner from "/src/components/atoms/Spinner";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import { valid_isTheSameArray } from "/util/func/validation/validationPackage";
import { useItemSelection } from "/util/hook/useItemSelection";
import { createAllianceEvent, deleteAllianceEventIds, getAllianceDetail } from "/service/admin";

const Index = ({ data, allianceId }) => {
  const router = useRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [allianceDetail, setAllianceDetail] = useState(data);

  const {
    allIds,
    selectedIds,
    selectAll,
    toggleSelect,
  } = useItemSelection(allianceDetail?.allianceEventInfos || [], (event) => event.allianceEventId);

  const [eventNameList, setEventNameList] = useState([]);
  const [eventError, setEventError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const data = await getAllianceDetail(undefined, allianceId);
    setAllianceDetail(data);
  }

  const handleDeleteEvent = async () => {
    // 행사 삭제
    try {
      const response = await deleteAllianceEventIds(selectedIds);
      setIsLoading(true);
      if (response) {
        await fetchData();
        setOpenDeleteModal(false);
        alert('행사 삭제가 완료됐습니다.');
      }
    } catch (err) {
      if (err) {
        console.log(err);
        alert('행사 삭제에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddEvent = async () => {
    // 행사 추가
    // 행사 중복 검증
    const hasOverlap = allianceDetail.allianceEventInfos.some(event => eventNameList.includes(event.eventName));
    if (hasOverlap) {
      setEventError('이미 등록된 행사입니다. 다시 입력해 주세요.');
      return;
    }

    // API array 형태가 아닌 단일 등록 형태임에 따라 Promise allSettled 적용함으로써 성공, 실패 여부 제어
    const results = await Promise.allSettled(
      eventNameList.map(name =>
        createAllianceEvent({
          allianceEventName: name,
          allianceId: Number(allianceId)
        })
      )
    );

    const successes = results.filter(r => r.status === 'fulfilled').map(r => (r).value);
    const failures = results.filter(r => r.status === 'rejected').map(r => ({ reason: (r).reason }));

    if (failures.length === 0) {
      await fetchData();
      handleCloseAddEventModal();
      alert('행사 추가가 완료됐습니다.');
    } else if (successes.length > 0) {
      alert(`${successes.length}개 행사는 성공적으로 추가됐습니다.`)
    } else {
      console.warn('일부 이벤트 생성 실패:', failures);
      alert('행사 추가가 실패했습니다.');
    }
  }

  const handleCloseAddEventModal = () => {
    // 행사 추가 modal close 값 초기화 처리
    setOpenAddModal(false);
    setEventNameList([]);
    setEventError('');
  }

  const allianceCouponInfo = [
    {
      label: '제휴사 정보',
      items: [
        { label: '제휴사', value: allianceDetail?.allianceInfo?.allianceName },
        { label: 'Prefix', value: allianceDetail?.allianceInfo?.allianceCode },
        {
          label: '행사',
          value: (
            <div>
              {allianceDetail?.allianceInfo?.eventNameList?.map(event => (
                <Fragment key={event}><em>- {event}</em><br/></Fragment>
              ))}
            </div>
          )
        },
        { label: '쿠폰 생성 개수', value: allianceDetail?.allianceInfo?.createdCouponCount.toLocaleString() },
      ],
    },
    {
      label: '전체 쿠폰 사용 현황',
      items: [
        { label: '쿠폰 등록 개수', value: allianceDetail?.allianceCouponUsedInfo?.registeredCouponCount.toLocaleString() },
        { label: '쿠폰 사용 개수', value: allianceDetail?.allianceCouponUsedInfo?.usedCouponCount.toLocaleString() },
        { label: '일반 상품', value: allianceDetail?.allianceCouponUsedInfo?.generalItemCount.toLocaleString() },
        { label: '구독 상품', value: allianceDetail?.allianceCouponUsedInfo?.subscriptionItemCount.toLocaleString() },
      ],
    },
  ]

  return (
    <div>
      <MetaTitle title="제휴사 상세보기" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">
            제휴사 상세보기
          </h1>
          <section className={`cont ${styles.detailContainer}`}>
            {isLoading
              ? <AmdinErrorMessage loading={<Spinner />} />
              : (
                <>
                  <h1 className={styles.detailTitle}>{allianceDetail?.allianceInfo?.allianceName}</h1>
                  <article className={tableStyle.table}>
                    <AllianceDetailInfo infoList={allianceCouponInfo} />
                  </article>
                  <article>
                    <AllianceTable
                      className={s.settingDetailTable}
                      itemList={allianceDetail?.allianceEventInfos}
                      tableTitle='행사 관리'
                      buttons={
                        <>
                          <Button onClick={() => setOpenAddModal(true)}>행사 등록</Button>
                          <Button onClick={() => setOpenDeleteModal(true)} disabled={selectedIds.length < 1}>행사 삭제</Button>
                        </>
                      }
                      tableHeader={
                        <>
                          <li className={s.table_th}>
                            <PureCheckbox
                              key='eventAllList'
                              eventHandler={selectAll}
                              value={valid_isTheSameArray(
                                allIds,
                                selectedIds,
                              )}
                            />
                          </li>
                          <li className={s.table_th}>순번</li>
                          {['행사 등록일', '행사', '생성', '등록', '사용', '일반상품', '구독상품'].map((th, index) => (
                            <li key={index} className={s.table_th}>{th}</li>
                          ))}
                        </>
                      }
                      tableBody={
                        <>
                          {allianceDetail?.allianceEventInfos?.sort((a, b) =>
                            new Date(b.createdEventDate).getTime() - new Date(a.createdEventDate).getTime()
                          ).map((event, index) => {
                            const deletedEvent = event?.eventStatus === 'INACTIVE' || false;
                            const seq = allianceDetail?.allianceEventInfos.length - index;
                            return (
                              <li className={`${s.item} ${deletedEvent ? s.inactive : ''}`} key={event.eventName}>
                              <span>
                                <PureCheckbox
                                  eventHandler={() => toggleSelect(event.allianceEventId)}
                                  value={selectedIds.includes(event.allianceEventId)}
                                  disabled={deletedEvent}
                                />
                              </span>
                                <span>{seq}</span>
                                <span>{format(new Date(event.createdEventDate), 'yy.MM.dd')}</span>
                                <span>{event.eventName}</span>
                                <span>{transformLocalCurrency(event.eventCouponCreatedCount)}</span>
                                <span>{transformLocalCurrency(event.eventCouponRegisteredCount)}</span>
                                <span>{transformLocalCurrency(event.eventUsedCount)}</span>
                                <span>{transformLocalCurrency(event.eventGeneralItemCount)}</span>
                                <span>{transformLocalCurrency(event.eventSubscriptionItemCount)}</span>
                              </li>
                            )
                          })}
                        </>
                      }
                    />
                  </article>
                </>
              )
            }
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
      {openDeleteModal &&
        <AllianceDeleteModal
          title={<>행사를 삭제하면<br/>쿠폰이 함께 삭제돼요!</>}
          subTitle={<>생성된 쿠폰이 모두 삭제되어 쿠폰 등록 및<br/>사용이 불가능해요. 삭제하시겠어요?</>}
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDeleteEvent}
        />
      }
      {openAddModal &&
        <AllianceEventAddModal
          eventNameList={eventNameList}
          setEventNameList={setEventNameList}
          onClose={handleCloseAddEventModal}
          onConfirm={handleAddEvent}
          eventError={eventError}
          setEventError={setEventError}
          isConfirmDisabled={eventNameList.length === 0}
        />
      }
    </div>
  );
};

export async function getServerSideProps({ req, query }) {
  const allianceDetail = await getAllianceDetail(req, query.id);
  return {
    props: {
      data: allianceDetail,
      allianceId: query.id
    }
  };

}
export default Index;