import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "antd";
import s from '/src/components/admin/alliance/common/allianceCommon.module.scss';
import MetaTitle from "/src/components/atoms/MetaTitle";
import SearchPlainInput from "/src/components/admin/form/searchBar/SearchPlainInput";
import SearchBar from "/src/components/admin/form/searchBar";
import PureCheckbox from "/src/components/atoms/PureCheckbox";
import ToolTip from "/src/components/atoms/Tooltip";
import AdminLayout from "/src/components/admin/AdminLayout";
import AllianceDeleteModal from "/src/components/admin/alliance/setting/modal/AllianceDeleteModal";
import AllianceTable from "/src/components/admin/alliance/common/AllianceTable";
import Spinner from "/src/components/atoms/Spinner";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import Pagination from "/src/components/atoms/Pagination";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import { valid_isTheSameArray } from "/util/func/validation/validationPackage";
import enterKey from "/util/func/enterKey";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import { useItemSelection } from "/util/hook/useItemSelection";
import { useQueryParams } from "/util/hook/useQueryParams";
import { deleteAlliance, getAllianceManagementList } from "/service/admin";

const Index = () => {
  const router = useRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const allianceManagementList = data.allianceManagementList || [];

  const [searchValues, setSearchValues] = useState({
    page: 0,
    allianceName: '',
  });

  const {
    allIds,
    selectedIds,
    selectAll,
    toggleSelect,
  } = useItemSelection(allianceManagementList, (alliance) => alliance.allianceId);

  const { getParam, setParams, deleteParams } = useQueryParams();
  const params = {
    page: Number(getParam('page') || 0),
    size: 10,
    allianceName: getParam('allianceName') || ''
  }

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getAllianceManagementList(params);
    setData(response);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [params.page, params.allianceName])

  const handleGoToDetail = (allianceId) => {
    router.push(`/bf-admin/alliance/setting/${allianceId}`);
  }

  const handleSearch = () => {
    if (searchValues.allianceName) {
      setParams({ page: 0, allianceName: searchValues.allianceName });
    } else {
      deleteParams(['page', 'allianceName']);
    }
  }

  const handleChangePage = (page) => {
    // 페이지네이션 변동시 searchValues 값에 바뀐 page 적용 및 params 적용을 위한 handleSearch 호출
    setSearchValues({...searchValues, page: page});
    handleSearch();
  }

  const handleDeleteAlliance = async () => {
    setOpenDeleteModal(false);
    try {
      const response = await deleteAlliance(selectedIds);
      setIsLoading(true);
      if (response) {
        await fetchData();
        alert('제휴사 삭제가 완료됐습니다.');
      }
    } catch (err) {
      if (err) {
        alert('제휴사 삭제에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <MetaTitle title="제휴사 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">제휴사 관리</h1>
          <section className="cont">
            <SearchBar
              onReset={() => {
                setSearchValues({allianceName: ''})
                deleteParams(['page', 'allianceName']);
              }}
              onSearch={handleSearch}
            >
              <SearchPlainInput
                title="제휴사 이름"
                name='allianceName'
                onChange={setSearchValues}
                searchValue={searchValues || ''}
                onKeydown={(e) => enterKey(e, handleSearch)}
              />
            </SearchBar>
          </section>
          <section className={`cont ${s.settingCon}`}>
            <AllianceTable
              className={s.settingTable}
              itemList={allianceManagementList}
              tableTitle='목록'
              buttons={
                <>
                  <Button onClick={() => router.push(`/bf-admin/alliance/setting/create`)}>제휴사 등록</Button>
                  <Button onClick={() => setOpenDeleteModal(true)} disabled={selectedIds.length < 1}>제휴사 삭제</Button>
                </>
              }
              tableHeader={
                <>
                  <li className={s.table_th}>
                    <PureCheckbox
                      key='allianceAllList'
                      eventHandler={selectAll}
                      value={valid_isTheSameArray(
                        allIds,
                        selectedIds,
                      )}
                    />
                  </li>
                  <li className={s.table_th}>순번</li>
                  {['제휴사', '행사', 'Prefix', '생성', '등록', '사용', '상세'].map((th, index) => (
                    <li key={index} className={s.table_th}>{th}</li>
                  ))}
                </>
              }
              tableBody={
                <>
                  {isLoading
                    ? <AmdinErrorMessage loading={<Spinner />} />
                    : allianceManagementList.map((item, index) => (
                    <li className={s.item} key={item.allianceId}>
                      <span>
                        <PureCheckbox
                          eventHandler={() => toggleSelect(item.allianceId)}
                          value={selectedIds.includes(item.allianceId)}
                        />
                      </span>
                      <span>{index + 1}</span>
                      <span>{item.allianceName}</span>
                      <span className={s.eventNameBox}>
                          <div className={s.eventName}>
                            <span>{item.eventInfos.length}건</span>
                            {item.eventInfos.length > 0 &&
                            <ToolTip
                              message={
                                <div>
                                  [등록된 행사]<br/>
                                  {item.eventInfos.map((event, i) => (
                                    <span key={event.allianceEventId}>{i + 1}. {event.eventName}<br/></span>
                                  ))}
                                </div>
                              }
                              messagePosition='center'
                              style={{ padding: '8px', textAlign: 'left' }}
                            />
                            }
                          </div>
                        </span>
                      <span>{item.allianceCode}</span>
                      <span>{transformLocalCurrency(item.createdCouponCount)}</span>
                      <span>{transformLocalCurrency(item.registeredCount)}</span>
                      <span>{transformLocalCurrency(item.usedCount)}</span>
                      <span>
                        <button
                          className='admin_btn autoWidth solid basic_s'
                          onClick={() => handleGoToDetail(item.allianceId)}
                        >
                          상세보기
                        </button>
                      </span>
                    </li>
                  ))}
                </>
              }
            />
            {allianceManagementList.length > 0 &&
            <div className={s['pagination-section']}>
              <Pagination
                totalElements={data?.page?.totalElements || 0}
                size={10}
                onChange={handleChangePage}
                initialPage={searchValues.page}
              />
            </div>
            }
          </section>
        </AdminContentWrapper>
      </AdminLayout>
      {openDeleteModal &&
         <AllianceDeleteModal
           title={<>제휴사를 삭제하면<br/>행사와 쿠폰이 함께 삭제돼요!</>}
           subTitle={<>등록하신 행사와 생성된 쿠폰이 모두 삭제되어 쿠폰등록 및 사용이 불가능해요. 삭제하시겠어요?</>}
           isOpen={openDeleteModal}
           onClose={() => setOpenDeleteModal(false)}
           onConfirm={handleDeleteAlliance}
         />
      }
    </div>
  );
};

export default Index;