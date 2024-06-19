import React, { useCallback, useState } from 'react';
import s from '../../../components/admin/promotion/promotion.module.scss';
import MetaTitle from '../../../components/atoms/MetaTitle';
import { AdminContentWrapper } from '../../../components/admin/AdminWrapper';
import AdminLayout from '../../../components/admin/AdminLayout';
import SearchBar from '../../../components/admin/form/searchBar';
import SearchTextWithCategory from '../../../components/admin/form/searchBar/SearchTextWithCategory';
import AmdinErrorMessage from '../../../components/atoms/AmdinErrorMessage';
import Spinner from '../../../components/atoms/Spinner';
import PaginationWithAPI from '../../../components/atoms/PaginationWithAPI';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { promotionType } from '/store/TYPE/promotionType';
import enterKey from '/util/func/enterKey';
import {
  promotionStatusType,
  searchPromotionStatusType,
} from '/store/TYPE/promotionStatusType';
import SearchRadio from '../../../components/admin/form/searchBar/SearchRadio';
import {
  filterObjectKeys,
  filterObjectValues,
} from '/util/func/filter/filterTypeFromObejct';
import PromotionCouponList from '../../../components/admin/promotion/PromotionCouponList';
import { putObjData } from '../../api/reqData';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from '../../../components/modal/Modal_global_alert';
import { generateSearchQuerybySearchValues } from '/util/func/search/generateSearchQuerybySearchValues';

const initialSearchValues = {
  promotionType: promotionType.COUPON,
  statusList: searchPromotionStatusType.ALL,
  name: '',
};

export default function PromotionSearchPage() {
  const getListApiUrl = '/api/admin/promotions';
  const searchPageSize = 10;
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState(
    generateSearchQuerybySearchValues(searchValues, promotionStatusType),
  );
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [onSearch, setOnSearch] = useState(false);

  const pageInterceptor = useCallback((res) => {
    // console.log(res);
    return getDefaultPagenationInfo(res?.data, 'queryAdminPromotionsDtoList', {
      pageSize: searchPageSize,
      setInitialize: setSearchQueryInitialize,
    });
  }, []);

  const onResetSearchValues = () => {
    setSearchValues(initialSearchValues);
  };

  const onSearchHandler = () => {
    const query = generateSearchQuerybySearchValues(
      searchValues,
      promotionStatusType,
    );
    setSearchQuery(query);
    setOnSearch(!onSearch);
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  const onDeleteItem = async (apiUrl, targetId) => {
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: {
          [targetId]: true,
        },
      }));
      const body = {
        id: targetId,
      };
      // console.log(apiUrl, body);
      const res = await putObjData(apiUrl, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow('프로모션이 삭제되었습니다.', onAlertModalCallback);
      } else {
        const serverErrorMessage = res.error;
        mct.alertShow(
          serverErrorMessage || '삭제에 실패하였습니다.',
          onAlertModalCallback,
        );
      }
    } catch (err) {
      mct.alertShow(
        '삭제 요청 중 에러가 발생하였습니다.',
        onAlertModalCallback,
      );
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: {
          [targetId]: false,
        },
      }));
    }
  };

  const onAlertModalCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="프로모션 조회" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>프로모션 조회</h1>
          </div>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchRadio
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="프로모션 타입"
                name="promotionType"
                idList={filterObjectKeys(promotionType)}
                labelList={filterObjectValues(promotionType.KOR)}
                value={searchValues.promotionType}
              />
              <SearchRadio
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="프로모션 상태"
                name="statusList"
                idList={filterObjectKeys(searchPromotionStatusType)}
                labelList={filterObjectValues(searchPromotionStatusType.KOR)}
                value={searchValues.statusList}
              />
              <SearchTextWithCategory
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="조건검색"
                name="keyword"
                id="keyword"
                events={{ onKeydown: onSearchInputKeydown }}
                options={[{ label: '이름', value: 'name' }]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">프로모션 목록</p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}></li>
                  <li className={s.table_th}>상태</li>
                  <li className={s.table_th}>이름</li>
                  <li className={s.table_th}>사용/발행/수량</li>
                  <li className={s.table_th}>기간</li>
                  <li className={s.table_th}>
                    쿠폰 정보&nbsp;
                    <em className={s.subtitle}>(코드/이름/사용처/혜택/한도)</em>
                  </li>
                </ul>
                {itemList.length ? (
                  <PromotionCouponList
                    items={itemList}
                    onDelete={onDeleteItem}
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
                apiURL={getListApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                urlQuery={searchQuery}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterceptor}
                option={{ apiMethod: 'GET', initialize: searchQueryInitialize }}
                setCurrentPage={setCurrentPage}
                onSearch={onSearch}
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

//
// const DUUMY_RES = {
//   "_embedded": {
//     "queryAdminPromotionsDtoList": [
//       {
//         "promotionDto": {
//           "promotionId": 1,
//           "type": "COUPON",
//           "status": "ACTIVE",
//           "name": "test프로모션",
//           "startDate": "2023-05-12T15:38:00",
//           "expiredDate": "2023-05-12T17:38:59"
//         },
//         "promotionCouponDto": {
//           "promotionCouponId": 1,
//           "quantity": 100,
//           "remaining": 100,
//           "usedCount": 0,
//           "couponId": 29,
//           "code": "promo",
//           "name": "promotion-coupon",
//           "couponTarget": "ALL",
//           "discountDegree": 100000,
//           "discountType": "FLAT_RATE",
//           "availableMinPrice": 10000,
//           "availableMaxDiscount": 1000000,
//           "amount": 99999
//         }
//       },
//       {
//         "promotionDto": {
//           "promotionId": 2,
//           "type": "COUPON",
//           "status": "INACTIVE",
//           "name": "promotion2",
//           "startDate": "2023-05-11T20:10:00",
//           "expiredDate": "2023-05-12T15:09:59"
//         },
//         "promotionCouponDto": {
//           "promotionCouponId": 2,
//           "quantity": 10,
//           "remaining": 10,
//           "usedCount": 0,
//           "couponId": 30,
//           "code": "p-2",
//           "name": "프로모션쿠폰2",
//           "couponTarget": "ALL",
//           "discountDegree": 10,
//           "discountType": "FIXED_RATE",
//           "availableMinPrice": 10000,
//           "availableMaxDiscount": 100000,
//           "amount": 1
//         }
//       }
//     ]
//   },
//   "_links": {
//     "self": {
//       "href": "http://192.168.0.90:8080/api/admin/promotions?promotionType=COUPON&statusList=PAUSED,ACTIVE,INACTIVE&name=&page=0&size=10"
//     },
//     "profile": {
//       "href": "/docs/index.html#resources-admin-queryPromotions"
//     }
//   },
//   "page": {
//     "size": 10,
//     "totalElements": 2,
//     "totalPages": 1,
//     "number": 0
//   },
//   status: 200
// }
