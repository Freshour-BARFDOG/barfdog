import React, { useCallback, useEffect, useMemo, useState } from 'react';
import s from '../coupon.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchPlainInput from '/src/components/admin/form/searchBar/SearchPlainInput';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import CouponUsageSearchTerm from '/src/components/admin/form/searchBar/CouponUsageSearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import CouponList from './CouponList';
import enterKey from '/util/func/enterKey';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import ToolTip from '/src/components/atoms/Tooltip';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { MirrorTextOnHoverEvent } from '/util/func/MirrorTextOnHoverEvent';
import { useModalContext } from '/store/modal-context';
import { putObjData } from '/src/pages/api/reqData';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { Tooltip } from 'antd';
import { global_searchDateType } from '/store/TYPE/searchDateType';

const initialSearchValue = {
  // expiredDateFrom: global_searchDateType.oldestDate,
  createdDateFrom: '',
  createdDateTo: '',
  memberName: '',
  memberEmail: '',
  role: 'ALL',
};

// const initialApiUrlWithQuery = {
//   couponType: global_couponType.AUTO_PUBLISHED,
//   query: `keyword=&couponType=${global_couponType.AUTO_PUBLISHED}`,
// };

export default function CouponUsageListPage() {
  const searchApiUrl = '/api/admin/coupons/memberCoupon';
  const searchPageSize = 10;

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [searchBody, setSearchBody] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    MirrorTextOnHoverEvent(window);
  }, [itemList]);

  const onResetSearchValues = () => {
    setSearchValue(initialSearchValue);
  };

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    return getDefaultPagenationInfo(res?.data, 'queryMemberCouponDtoList', {
      pageSize: searchPageSize,
      setInitialize: setSearchQueryInitialize,
    });
  }, []);

  const onSearchHandler = () => {
    const body = {
      createdDateFrom: searchValue.createdDateFrom,
      createdDateTo: searchValue.createdDateTo,
      memberName: searchValue.memberName,
      memberEmail: searchValue.memberEmail,
      role: searchValue.role,
    };
    setSearchBody(body);
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  // console.log('searchValue', searchValue);
  // console.log('itemList', itemList);

  const onEditItem = async (apiUrl, targetId, tempValues) => {
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        edit: {
          [targetId]: true,
        },
      }));
      const body = {
        expiredDate: tempValues.expiredDate,
        memberCouponStatus: tempValues.memberCouponStatus,
        remaining: Number(tempValues.remaining),
      };
      console.log('body>>>', body);
      console.log('apiUrl>>>', apiUrl);
      const res = await putObjData(apiUrl, body);
      console.log(res);

      if (res.isDone) {
        mct.alertShow('쿠폰이 성공적으로 수정되었습니다.', onSubmitCallback);
        setIsSubmitted(true);
      } else if (res.status === 422) {
        const message = res.data.data;
        mct.alertShow(
          `수정할 수 없는 쿠폰입니다.\n(${message})`,
          onSubmitCallback,
        );
      } else {
        const serverErrorMessage = res.error;
        mct.alertShow(
          serverErrorMessage || '수정에 실패하였습니다.',
          onSubmitCallback,
        );
      }
    } catch (err) {
      mct.alertShow('수정 요청 중 에러가 발생하였습니다.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        edit: {
          [targetId]: false,
        },
      }));
    }
  };

  const onSubmitCallback = () => {
    //   window.location.reload();
    mct.alertHide();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="쿠폰 사용 현황" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">쿠폰 사용 현황</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <CouponUsageSearchTerm
                title={'발급기간'}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
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
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="회원검색"
                name="keyword"
                id="keyword"
                events={{ onKeydown: onSearchInputKeydown }}
                options={[
                  { label: '아이디', value: 'memberEmail' },
                  { label: '이름', value: 'memberName' },
                ]}
              />

              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="회원 유형"
                name="role"
                idList={['ALL', 'USER', 'SUBSCRIBER']}
                labelList={['전체', '일반', '구독']}
                value={searchValue.role}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <div className="cont_title cont-left">
                멤버 쿠폰 목록
                <Tooltip
                  message={`1. 자동발행쿠폰은 생성 및 삭제할 수 없습니다.\n2. 자동발행쿠폰 중 등급별 쿠폰은 매달 1일, 생일 쿠폰은 해당 월 1일에 자동발급됩니다.\n3. 직접발행 쿠폰은 유효기간이 존재하는 항목만 목록에 나타납니다.\n4. 직접발행 쿠폰의 만료일자는 동일한 쿠폰을 2회 이상 발급했을 시,\n    가장 늦은 만료일자를 기준으로 표기됩니다.`}
                  messagePosition={'left'}
                  wordBreaking={true}
                  width={'480px'}
                />
              </div>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={`${s.table}`}>
                <ul className={`${s.table_header}`}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>이름</li>
                  <li className={s.table_th}>아이디</li>
                  <li className={s.table_th}>쿠폰 이름</li>
                  <li className={s.table_th}>쿠폰 상태</li>
                  <li className={s.table_th}>쿠폰 코드</li>
                  <li className={s.table_th}>남은 개수</li>
                  <li className={s.table_th}>발급날짜</li>
                  <li className={s.table_th}>만료기한</li>
                  <li className={s.table_th}>수정</li>
                </ul>
                {itemList.length ? (
                  <CouponList
                    items={itemList}
                    onEditItem={onEditItem}
                    isLoading={isLoading}
                    currentPage={currentPage}
                  />
                ) : isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                urlQuery={searchQuery}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterceptor}
                option={{
                  apiMethod: 'POST',
                  body: searchBody,
                  initialize: searchQueryInitialize,
                }}
                setCurrentPage={setCurrentPage}
                isSubmitted={isSubmitted}
                setIsSubmitted={setIsSubmitted}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
}
