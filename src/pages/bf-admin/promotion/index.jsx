import React, {useCallback, useState} from "react";
import s from "./promotion.module.scss";
import MetaTitle from "../../../components/atoms/MetaTitle";
import {AdminContentWrapper} from "../../../components/admin/AdminWrapper";
import AdminLayout from "../../../components/admin/AdminLayout";
import SearchBar from "../../../components/admin/form/searchBar";
import SearchTextWithCategory from "../../../components/admin/form/searchBar/SearchTextWithCategory";
import AmdinErrorMessage from "../../../components/atoms/AmdinErrorMessage";
import Spinner from "../../../components/atoms/Spinner";
import PaginationWithAPI from "../../../components/atoms/PaginationWithAPI";
import {getDefaultPagenationInfo} from "/util/func/getDefaultPagenationInfo";
import {promotionType} from "/store/TYPE/promotionType";
import enterKey from "/util/func/enterKey";
import {promotionStatusType, searchPromotionStatusType} from "/store/TYPE/promotionStatusType";
import SearchRadio from "../../../components/admin/form/searchBar/SearchRadio";
import {filterObjectKeys, filterObjectValues} from "/util/func/filter/filterTypeFromObejct";
import PromotionCouponList from "./PromotionCouponList";
import {putObjData} from "../../api/reqData";
import {useModalContext} from "/store/modal-context";
import Modal_global_alert from "../../../components/modal/Modal_global_alert";




// TODO : 프로모션 상태 클릭 시, 바로 조회 API 적용되도록.
// TODO : 프로모션 상태 클릭 시, 바로 조회 API 적용되도록.






const initialSearchValues = {
  type: promotionType.COUPON,
  status: searchPromotionStatusType.ALL,
  name: "",
}


export default function PromotionSearchPage() {

  const getListApiUrl = '/api/admin/promotions';
  const searchPageSize = 10;
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);

  const pageInterceptor = useCallback((res, option = {itemQuery: null}) => {
    res = DUMMY_RES; // ! TEST
    console.log(res);
    return getDefaultPagenationInfo(res?.data, 'queryAdminPromotionDtoList', {
      pageSize: searchPageSize,
      setInitialize: setSearchQueryInitialize
    });
  }, []);


  const onResetSearchValues = () => {
    setSearchValues(initialSearchValues);
  };


  const onSearchHandler = () => {
    const queryArr = [];
    for (const key in searchValues) {
      const val = searchValues[key];
      queryArr.push(`${key}=${val}`);
    }

    const query = `${queryArr.join('&')}`;
    setSearchQuery(query);
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  const onDeleteItem = async (apiUrl, targetId) => {
    try {
      setIsLoading(prevState => ({
        ...prevState,
        delete:{
          [targetId]: true
        }
      }));
      const body = {
        id:targetId
      }
      console.log(apiUrl, body);
      const res = await putObjData(apiUrl, body);
      console.log(res);
      if(res.isDone){
        mct.alertShow( "프로모션이 삭제되었습니다.", onAlertModalCallback );
      } else {
        const serverErrorMessage = res.error;
        mct.alertShow(serverErrorMessage || '삭제에 실패하였습니다.');
      }
    } catch (err) {
      mct.alertShow('삭제 요청 중 에러가 발생하였습니다.', onAlertModalCallback);
      console.error(err);
    } finally {
      setIsLoading(prevState => ({
        ...prevState,
        delete:{
          [targetId]: false
        }
      }));
    }
  };

  const onAlertModalCallback = () => {
    window.location.reload();
  };



  return <>
    <MetaTitle title="프로모션 조회" admin={true}/>
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
              name="type"
              idList={filterObjectKeys(promotionType)}
              labelList={filterObjectValues(promotionType.KOR)}
              value={searchValues.type}
            />
            <SearchRadio
              searchValue={searchValues}
              setSearchValue={setSearchValues}
              title="프로모션 상태"
              name="status"
              idList={filterObjectKeys(searchPromotionStatusType)}
              labelList={filterObjectValues(searchPromotionStatusType.KOR)}
              value={searchValues.status}
            />
            <SearchTextWithCategory
              searchValue={searchValues}
              setSearchValue={setSearchValues}
              title="조건검색"
              name="keyword"
              id="keyword"
              events={{onKeydown: onSearchInputKeydown}}
              options={[
                {label: '이름', value: 'name'},
              ]}
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
                <li className={s.table_th}></li>
                <li className={s.table_th}>상태</li>
                <li className={s.table_th}>이름</li>
                <li className={s.table_th}>기간</li>
                <li className={s.table_th}>사용 / 발행 / 수량</li>
                <li className={s.table_th}>쿠폰정보 (코드 / 이름 / 사용처 / 혜택 / 한도)</li>
              </ul>
              {itemList.length
                ? <PromotionCouponList items={itemList} onDelete={onDeleteItem} isLoading={isLoading}/>
                : isLoading.fetching
                  ? <AmdinErrorMessage loading={<Spinner/>}/>
                  : <AmdinErrorMessage text="조회된 데이터가 없습니다."/>
              }
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
              option={{apiMethod: 'GET', initialize: searchQueryInitialize}}
            />
          </div>
        </section>
      </AdminContentWrapper>
    </AdminLayout>
    {hasAlert && <Modal_global_alert background/>}
  </>;
}


const DUMMY_RES = {
  data: {
    _embedded: {
      queryAdminPromotionDtoList: [
        {
          id:2,
          type: promotionType.COUPON,
          status: promotionStatusType.ACTIVE,
          name: "2023 Summer Promotion",
          startDate: "2023-05-04T07:00:00",
          expiredDate: "2023-05-31T23:59:59",
          coupon: {
            id: 1,
            quantity: 500,
            remaining: 200,
            used: 10,
            code:"promo-2023",
            name: "프로모션 10% 쿠폰",
            couponTarget: "전체",
            discount: "10%",
            availableMinPrice: 1000,
            availableMaxDiscount: 20000,
            amount: 2
          }
        },
        {
          id:3,
          type: promotionType.COUPON,
          status: promotionStatusType.PAUSED,
          name: "2024 Summer Promotion",
          startDate: "2024-05-04T07:00:00",
          expiredDate: "2024-05-31T23:59:59",
          coupon: {
            id: 1,
            quantity: 100,
            remaining: 40,
            used: 10,
            code:"promo-2024",
            name: "프로모션 10000원 쿠폰",
            couponTarget: "정기",
            discount: "10000원",
            availableMinPrice: 10000,
            availableMaxDiscount: 20000,
            amount: 1
          }
        },
        {
          id:1,
          type: promotionType.COUPON,
          status: promotionStatusType.INACTIVE,
          name: "2022 Summer Promotion",
          startDate: "2022-05-04T07:00:00",
          expiredDate: "2022-05-31T23:59:59",
          coupon: {
            id: 1,
            quantity: 10,
            remaining: 10,
            used: 10,
            code:"promo-2022",
            name: "프로모션 30% 쿠폰",
            couponTarget: "일반",
            discount: "30%",
            availableMinPrice: 1000,
            availableMaxDiscount: 20000,
            amount: 1
          }
        }
      ]
    },
    page: {
      totalPages: 3,
      size: 10,
      totalItems: 30,
      currentPageIndex: 0,
      newPageNumber: 1,
      newItemList: [],
    }
  },
  status: 200
}
