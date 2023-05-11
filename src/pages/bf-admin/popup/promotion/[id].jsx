import React, {useCallback, useState} from 'react';
import s from './promotionInPopup.module.scss';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import {PopupCloseButton, PopupCloseButton_typeX} from '/src/components/popup/PopupCloseButton';
import {getDataSSR} from '/src/pages/api/reqData';
import PaginationWithAPI from "../../../../components/atoms/PaginationWithAPI";
import enterKey from "/util/func/enterKey";
import {getDefaultPagenationInfo} from "/util/func/getDefaultPagenationInfo";
import {promotionType} from "../../../../../store/TYPE/promotionType";
import {promotionStatusType} from "../../../../../store/TYPE/promotionStatusType";
import transformLocalCurrency from "../../../../../util/func/transformLocalCurrency";
import SearchTextWithCategory from "../../../../components/admin/form/searchBar/SearchTextWithCategory";
import AmdinErrorMessage from "../../../../components/atoms/AmdinErrorMessage";
import Spinner from "../../../../components/atoms/Spinner";
import {PromotionStatus} from "../../promotion/PromotionStatus";
import PromotionMemberList from "./PromotionMemberList";


const initialSearchValues = {
  email: '',
  name: '',
};


export default function Popup_PromotionDetailPage({id, data}) {

  const promotionStatus = promotionStatusType.ACTIVE;

  const searchApiUrl = `/api/admin/promotions/${id}/members`;
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemList, setItemList] = useState([]);

  const onSearchHandler = useCallback(() => {
    const queryArr = [];
    for (const key in searchValues) {
      const val = searchValues[key];
      const thisQuery = `${key}=${val}`;
      queryArr.push(thisQuery);
    }
    const query = `${queryArr.join('&')}`;
    setSearchQuery(query);
  }, []);

  const pageInterceptor = useCallback((res, option = {itemQuery: null}) => {
    res = DUMMY_RES; // ! TEST
    console.log(res);
    return getDefaultPagenationInfo(res?.data, 'queryAdminPromotionMemberDtoList', {pageSize: searchPageSize});
  }, []);


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
                <h1 className={s['popup-title']}>프로모션 상세보기 / 참여 회원 조회</h1>
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
                            <span>{"홍길동"}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>상태</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <PromotionStatus status={promotionStatus}/>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>기간</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont} ${s.vertical}`}>
                            <span>{"2023-05-04 07:00:00"}</span>
                            <span>~ {"2023-05-31 23:59:59"}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>타입</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{promotionType.KOR.COUPON}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
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
                            <span>{"프로모션 10% 쿠폰"}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>설명</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{"쿠폰설명"}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>코드</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{"promo - 2023"}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>사용가능횟수</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{1}회</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>할인</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{"10% 할인 "}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>사용처</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{"전체"}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>최소사용금액</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{transformLocalCurrency(10000)}원</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>최대할인금액</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{transformLocalCurrency(20000)}원</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
              <section className={s["usage-indicator-section"]}>
                <h3 className={s.title}>사용현황</h3>
                <ul>
                  <li>
                    <p className={s.label}>사용</p>
                    <span className={s.value}>{7}</span>
                  </li>
                  <li>
                    <p className={s.label}>발행</p>
                    <span className={s.value}>{7}</span>
                  </li>
                  <li>
                    <p className={s.label}>전체수량</p>
                    <span className={s.value}>{500}</span>
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
                      <li className={s.table_th}>등록일</li>
                      <li className={s.table_th}>만료일</li>
                      <li className={s.table_th}>사용한도</li>
                    </ul>
                    {itemList.length
                      ? <PromotionMemberList items={itemList}/>
                      : isLoading.fetching
                        ? <AmdinErrorMessage loading={<Spinner/>} />
                        : <AmdinErrorMessage text="검색결과가 존재하지 않습니다." />
                    }
                  </div>
                  <div className={s['pagination-section']}>
                    <PaginationWithAPI
                      apiURL={searchApiUrl}
                      size={searchPageSize}
                      pageInterceptor={pageInterceptor}
                      setItemList={setItemList}
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
  // 프로모션 데이터는 미리 가져옴
  const {id} = query;

  let DATA = null

  const apiURL = `/api/promotions/${id}`;
  const res = await getDataSSR(req, apiURL);
  if (res?.status === 200 && res?.data) {
    DATA = {}

  }

  return {props: {id: id, data: DATA}};
}


const DUMMY_RES = {
  data:{
    _embedded:{
      queryAdminPromotionMemberDtoList:[
        {
          id: 1,
          email: "hong@gmail.com",
          name: "홍길동",
          createdDate: "2022-05-04T07:00:00",
          expiredDate: "2022-05-31T07:00:00",
          amount: 1,
          isUsed: true,
        },
        {
          id: 1,
          email: "hong2@gmail.com",
          name: "홍길동2",
          createdDate: "2022-05-04T07:00:00",
          expiredDate: "2022-05-31T07:00:00",
          amount: 1,
          isUsed: false,
        },
        {
          id: 1,
          email: "hong3@gmail.com",
          name: "홍길동3",
          createdDate: "2022-05-04T07:00:00",
          expiredDate: "2022-05-31T07:00:00",
          amount: 1,
          isUsed: false,
        },
        {
          id: 1,
          email: "hong4@gmail.com",
          name: "홍길동4",
          createdDate: "2022-05-04T07:00:00",
          expiredDate: "2022-05-31T07:00:00",
          amount: 1,
          isUsed: true,
        },
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
