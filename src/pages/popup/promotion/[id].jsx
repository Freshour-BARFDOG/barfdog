import React, {useCallback, useState} from 'react';
import s from './promotionInPopup.module.scss';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import {PopupCloseButton, PopupCloseButton_typeX} from '/src/components/popup/PopupCloseButton';
import {getDataSSR} from '/src/pages/api/reqData';
import PaginationWithAPI from "../../../components/atoms/PaginationWithAPI";
import enterKey from "/util/func/enterKey";
import {getDefaultPagenationInfo} from "/util/func/getDefaultPagenationInfo";
import {promotionType} from "../../../../store/TYPE/promotionType";
import transformLocalCurrency from "../../../../util/func/transformLocalCurrency";
import SearchTextWithCategory from "../../../components/admin/form/searchBar/SearchTextWithCategory";
import AdminErrorMessage from "../../../components/atoms/AdminErrorMessage";
import Spinner from "../../../components/atoms/Spinner";
import {PromotionStatus} from "../../../components/admin/promotion/PromotionStatus";
import PromotionMemberList from "./PromotionMemberList";
import {filterDateTimeSeperator} from "/util/func/filter_dateAndTime";
import {discountUnitType} from "../../../../store/TYPE/discountUnitType";
import {generateSearchQuerybySearchValues} from "../../../../util/func/search/generateSearchQuerybySearchValues";



const initialSearchValues = {
  email: '',
  name: '',
};


export default function Popup_PromotionDetailPage({id, DATA}) {

  const searchApiUrl = `/api/admin/promotions/${id}/members`;
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberList, setMemberList] = useState([]);

// console.log(searchQuery);

  const pageInterceptor = useCallback((res, option = {itemQuery: null}) => {
    // res = DUMMY_MEMBER_RES; // ! TEST
    // console.log(res);
    return getDefaultPagenationInfo(res?.data, 'queryAdminPromotionMembersDtoList', {pageSize: searchPageSize});
  }, []);

  const onSearchHandler = useCallback(() => {
    const query = generateSearchQuerybySearchValues(searchValues);
    setSearchQuery(query);
  }, [searchValues]);

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };


  return (
    <>
      <div>
        <PopupWrapper style={{width: 1000}}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s['popup-title']}>프로모션 상세보기 / 참여회원 정보</h1>
                <PopupCloseButton_typeX/>
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <section className={s.table}>
                <ul>
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>프로모션 정보</h4>
                    </div>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>이름</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{DATA.name}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>상태</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <PromotionStatus status={DATA.status}/>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>기간</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont} ${s.vertical}`}>
                            <span>{DATA.startDate}</span>
                            <span>~ {DATA.expiredDate}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>타입</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{promotionType.KOR[DATA.promotionType]}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>쿠폰 정보</h4>
                    </div>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>이름</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{DATA.coupon.couponName}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>설명</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{DATA.coupon.description}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>코드</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{DATA.coupon.code}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>사용가능횟수</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{DATA.coupon.amount}회</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>할인</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{transformLocalCurrency(DATA.coupon.discountDegree)}{discountUnitType.KOR[DATA.coupon.discountType]}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>사용처</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{DATA.coupon.couponTarget}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>최소사용금액</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{transformLocalCurrency(DATA.coupon.availableMinPrice)}원</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>최대할인금액</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{transformLocalCurrency(DATA.coupon.availableMaxDiscount)}원</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
              <section className={s["usage-indicator-section"]}>
                <h3 className={s.title}>참여회원 정보</h3>
                <ul>
                  <li>
                    <p className={s.label}>사용됨</p>
                    <span className={s.value}>{transformLocalCurrency(DATA.promotionCoupon.usedCount)}</span>
                  </li>
                  <li>
                    <p className={s.label}>발행됨</p>
                    <span className={s.value}>{transformLocalCurrency(DATA.promotionCoupon.quantity - DATA.promotionCoupon.remaining)}</span>
                  </li>
                  <li>
                    <p className={s.label}>수량</p>
                    <span className={s.value}>{transformLocalCurrency(DATA.promotionCoupon.quantity)}</span>
                  </li>
                </ul>
              </section>
              <section className={s["search-member-section"]}>
                <SearchTextWithCategory
                  className={s.searchBar}
                  searchValue={searchValues}
                  setSearchValue={setSearchValues}
                  events={{onKeydown: onSearchInputKeydown}}
                  name="keyword"
                  id="keyword"
                  options={[
                    { label: '이메일', value: 'email' },
                    { label: '이름', value: 'name' },
                  ]}
                  placeholder={"검색어를 입력하세요."}
                  searchButton={
                    <button
                      className={'admin_btn solid basic_l'}
                      type={'button'}
                      onClick={onSearchHandler}
                    >
                      검색
                    </button>
                  }
                />
                <div className={`${s.cont_viewer} ${s.fullWidth}`}>
                  <div className={s.table}>
                    <ul className={`${s.table_header}`}>
                      <li className={s.table_th}>사용여부</li>
                      <li className={s.table_th}>아이디</li>
                      <li className={s.table_th}>이름</li>
                      <li className={s.table_th}>등록일시</li>
                      <li className={s.table_th}>만료일시</li>
                      <li className={s.table_th}>쿠폰수량</li>
                    </ul>
                    {memberList.length
                      ? <PromotionMemberList items={memberList}/>
                      : isLoading.fetching
                        ? <AdminErrorMessage loading={<Spinner/>} />
                        : <AdminErrorMessage text="검색결과가 존재하지 않습니다." />
                    }
                  </div>
                  <div className={s['pagination-section']}>
                    <PaginationWithAPI
                      apiURL={searchApiUrl}
                      size={searchPageSize}
                      pageInterceptor={pageInterceptor}
                      setItemList={setMemberList}
                      setIsLoading={setIsLoading}
                      urlQuery={searchQuery}
                      routerDisabled={true}
                    />
                  </div>
                </div>
              </section>
              <section className={s['btn-section']}>
                <PopupCloseButton/>
              </section>
            </div>
          </main>
        </PopupWrapper>
      </div>
    </>
  );
}


export async function getServerSideProps({req, query}) {

  const { id } = query;

  let DATA = null;

  const apiUrl = `/api/admin/promotions/${id}`;
  const res = await getDataSSR(req, apiUrl); // PROD
  // console.log(res.data);
  if (res && res.status === 200 && res.data) {
    const data = res.data;
    DATA = {
      promotionId: data.promotionId,
      promotionType: data.promotionType,
      name: data.name,
      startDate: filterDateTimeSeperator(data.startDate, "T",  " "),
      expiredDate: filterDateTimeSeperator(data.expiredDate, "T",  " "),
      status: data.status,
      deleted: data.deleted,
      coupon: {
        couponId: data.couponId,
        couponType: data.couponType,
        couponName: data.couponName,
        description: data.description,
        code: data.code,
        amount: data.amount,
        discountDegree: data.discountDegree,
        discountType: data.discountType,
        couponTarget: data.couponTarget,
        availableMinPrice: data.availableMinPrice,
        availableMaxDiscount: data.availableMaxDiscount,
      },
      promotionCoupon:{
        usedCount: data.usedCount,
        quantity: data.quantity,
        remaining: data.remaining,
      }
    }


  }

  if (DATA?.deleted || res.status === 500) {
    return {
      redirect: {
        permenant: false,
        destination: "/404"
      }
    }
  }

  return {
    props: {id, DATA}
  };
}
