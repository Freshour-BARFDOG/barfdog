import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import s from "/src/components/admin/alliance/common/allianceCommon.module.scss";
import { Button } from "antd";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import CouponUsageSearchTerm from "/src/components/admin/form/searchBar/CouponUsageSearchTerm";
import ToolTip from "/src/components/atoms/Tooltip";
import SearchTextWithCategory from "/src/components/admin/form/searchBar/SearchTextWithCategory";
import SearchRadio from "/src/components/admin/form/searchBar/SearchRadio";
import SearchBar from "/src/components/admin/form/searchBar";
import PureCheckbox from "/src/components/atoms/PureCheckbox";
import AllianceDeleteModal from "/src/components/admin/alliance/setting/modal/AllianceDeleteModal";
import AllianceTable from "/src/components/admin/alliance/common/AllianceTable";
import Spinner from "/src/components/atoms/Spinner";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import Pagination from "/src/components/atoms/Pagination";
import TabNav from "/src/components/admin/alliance/coupon/list/TabNav";
import enterKey from "/util/func/enterKey";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import { useItemSelection } from "/util/hook/useItemSelection";
import { valid_isTheSameArray } from "/util/func/validation/validationPackage";
import { productType } from "/store/TYPE/itemType";
import { transformToday } from "/util/func/transformDate";
import { global_searchDateType } from "/store/TYPE/searchDateType";
import { useQueryParams } from "/util/hook/useQueryParams";
import {
  deleteAllianceCoupon,
  downloadExcelIssuedAllianceCoupon,
  getAllianceCouponList
} from "/service/admin";
import { downloadBlobFile } from "/util/func/downloadBlobFile";
import { useSearchParams } from "/util/hook/useSearchParams";

const initialSearchValue = {
  page: 0,
  couponTarget: 'ALL',
  searchType: 'ALLIANCE',
  search: '',
  from: global_searchDateType.oldestDate,
  to: transformToday(),
};

const Index = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const tab = router.query.tab || 'ACTIVE';

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const allianceCouponList = data.allianceCouponList || [];

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const {
    allIds,
    selectedIds,
    selectAll,
    toggleSelect,
    clearSelect,
  } = useItemSelection(allianceCouponList, (item) => item.bundle);

  const [searchValues, setSearchValues] = useState(initialSearchValue)

  const { getParam, setParams, keepOnlyParams } = useQueryParams();
  const params = {
    page: Number(getParam('page') || 0),
    size: 10,
    couponTarget: getParam('couponTarget') || 'ALL',
    from: getParam('from') || global_searchDateType.oldestDate,
    to: getParam('to') || transformToday(),
    searchType: getParam('searchType'),
    search: getParam('search') || '',
  }

  const { handleSearch, handlePageChange, handleResetSearchValue } = useSearchParams({
    initialSearchValue,
    searchValues,
    setSearchValues
  });

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getAllianceCouponList(params, tab);
    setData(response);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [tab, params.page, params.from, params.to, params.couponTarget, params.searchType, params.search])

  const handleTabChange = (tab) => {
    // 활성, 삭제 쿠폰 tab 변동시 searchValues 값 초기화 및 page 0 처리
    keepOnlyParams(['tab', 'page'], { tab: tab, page: 0 });
    setSearchValues(initialSearchValue);
    clearSelect();
  }

  const handleDeleteAllianceCoupon = async () => {
    // 쿠폰 다운로드
    setOpenDeleteModal(false);
    try {
      const response = await deleteAllianceCoupon(selectedIds);
      setIsLoading(true);
      if (response) {
        await fetchData();
        await handleResetSearchValue();
        alert('쿠폰 삭제가 완료됐습니다.');
      }
    } catch (err) {
      if (err) {
        alert('쿠폰 삭제에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownloadExcelEachCoupon = async (item) => {
    const body = {
      allianceCouponBundle: item.bundle,
      couponStatus: tab,
    };
    try {
      const blob = await downloadExcelIssuedAllianceCoupon(body);

      if (blob) {
        const formatDateForFilename = (dateStr) => format(new Date(dateStr), 'yyyyMMdd');
        const formatStartDate = formatDateForFilename(item.useStartDate);
        const formatEndDate = formatDateForFilename(item.useExpiredDate);

        const filename = `바프독_${formatStartDate}_${formatEndDate}_${transformLocalCurrency(item.couponCount)}건.xlsx`;
        downloadBlobFile(blob, filename);
      }

    } catch (err) {
      console.error('다운로드 중 에러 발생', err);
    }
  }
  return (
    <div>
      <MetaTitle title="쿠폰 내역" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">쿠폰 내역</h1>
          <section className="cont">
            <SearchBar
              onReset={() => handleSearch(true)}
              onSearch={() => handleSearch()}
            >
              <CouponUsageSearchTerm
                title={'조회기간'}
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                fromInputName='from'
                toInputName='to'
                tooltip={
                  <ToolTip
                    message={
                      '좌측 조회기간은 우측 조회기간보다 과거시점이어야 합니다.'
                    }
                    messagePosition={'left'}
                  />
                }
              />
              <SearchTextWithCategory
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="조건검색"
                name="searchType"
                id="searchType"
                events={{ onKeydown: (e) => enterKey(e, () => handleSearch()) }}
                searchInputName='search'
                options={[
                  { label: '제휴사', value: 'ALLIANCE' },
                  { label: '행사', value: 'EVENT' },
                  { label: '쿠폰이름', value: 'ALLIANCE_COUPON_NAME' },
                ]}
              />

              <SearchRadio
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="사용처"
                name="couponTarget"
                idList={[
                  productType.ALL,
                  productType.GENERAL,
                  productType.SUBSCRIBE,
                ]}
                labelList={[
                  productType.KOR.ALL,
                  productType.KOR.GENERAL,
                  productType.KOR.SUBSCRIBE,
                ]}
                value={searchValues.couponTarget}
              />
            </SearchBar>
          </section>
          <TabNav handleTabChange={handleTabChange} />
          <section className="cont" style={{ border: 0 }}>
            <AllianceTable
              itemList={allianceCouponList}
              className={s.couponListTable}
              tableTitle='목록'
              buttons={tab === 'ACTIVE' && <Button onClick={() => setOpenDeleteModal(true)}>쿠폰 삭제</Button>}
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
                  {['상세', '제휴사', '행사', '쿠폰 이름', '할인', '생성 개수', '쿠폰 사용 기한', '발급', '사용', '재다운'].map((th, index) => (
                    <li key={index} className={s.table_th}>{th}</li>
                  ))}
                </>
              }
              tableBody={
                <>
                  {isLoading
                    ? <AmdinErrorMessage loading={<Spinner />} />
                    : allianceCouponList?.map((item, index) => (
                    <li className={s.item} key={item.bundle}>
                      <span>
                        <PureCheckbox
                          eventHandler={() => toggleSelect(item.bundle)}
                          value={selectedIds.includes(item.bundle)}
                        />
                      </span>
                      <span>
                        {data.page.totalElements - (data.page.number * data.page.size + index)}
                      </span>
                      <span>
                         <button
                           className='admin_btn autoWidth solid basic_s'
                           onClick={() => router.push(`${pathname}/${item.bundle}`)}
                         >
                            상세보기
                          </button>
                      </span>
                      <span>{item.allianceName}</span>
                      <span>{item.eventName}</span>
                      <span>{item.couponName}</span>
                      <span>{item.discountDegree}</span>
                      <span>{transformLocalCurrency(item.couponCount)}개</span>
                      <span>
                        {format(new Date(item.useStartDate), 'yy.MM.dd HH:mm:ss')} -<br/>
                        {format(new Date(item.useExpiredDate), 'yy.MM.dd HH:mm:ss')}
                      </span>
                      <span>{transformLocalCurrency(item.registrationCount)}</span>
                      <span>{transformLocalCurrency(item.usedCount)}</span>
                      <span>
                           <button
                             className='admin_btn autoWidth line basic_s'
                             onClick={() => handleDownloadExcelEachCoupon(item)}
                           >
                            Excel 파일 다운로드
                          </button>
                      </span>
                    </li>
                  ))}
                </>
              }
            />
            {allianceCouponList.length > 0 &&
              <div className={s['pagination-section']}>
                <Pagination
                  totalElements={data?.page?.totalElements || 0}
                  size={10}
                  onChange={handlePageChange}
                  initialPage={searchValues.page}
                />
              </div>
            }
          </section>
        </AdminContentWrapper>
        {openDeleteModal &&
          <AllianceDeleteModal
            title={<>쿠폰을 삭제하면 생성된 난수쿠폰이<br/>모두 삭제되어 쿠폰사용이 불가능해요</>}
            subTitle={<>생성된 쿠폰이 모두 삭제되어 쿠폰 등록 및<br/>사용이 불가능해요. 삭제하시겠어요?</>}
            isOpen={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={handleDeleteAllianceCoupon}
          />
        }
      </AdminLayout>
    </div>
  );
};

export default Index;