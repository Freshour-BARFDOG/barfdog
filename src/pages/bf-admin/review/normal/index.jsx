import s from "./review.module.scss";
import React, { useState } from "react";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import ReviewList from "./ReviewList";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import Checkbox from "/src/components/atoms/Checkbox";
import SearchBar from "/src/components/admin/form/searchBar";
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchRadio from "/src/components/admin/form/searchBar/SearchRadio";
import PaginationWithAPI from "/src/components/atoms/PaginationWithAPI";
import Spinner from "/src/components/atoms/Spinner";
import {global_reviewStateType} from "/store/TYPE/reviewStateType";
import {valid_isTheSameArray} from "/util/func/validation/validationPackage";
import ToolTip from "/src/components/atoms/Tooltip";





// REST API DOC:  관리자 리뷰 리스트 조회(페이징)
// ''http://localhost:8080/api/admin/reviews?size=5&page=1&status=ALL&order=desc'


const initialSearchValue = {
  status: 'ALL',
};


const initialApiUrlQuery = {
  query: 'status=ALL&order=desc',
  url: '/api/admin/reviews'
};



function ReviewPage() {
  
  const apiDataQueryString = 'queryAdminReviewsDtoList';
  const searchPageSize = 10;
  
  const [modalMessage, setModalMessage] = useState( '' );
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);
  
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [apiUrlWithQuery, setApiUrlWithQuery] = useState(initialApiUrlQuery);
  // console.log(itemList);
  // console.log(searchValue);
  // console.log(apiUrlWithQuery);
  console.log(selectedItemList);
  
  const onResetSearchValues = () => {
    setSearchValue(initialSearchValue);
  };
  
  const onSearchHandler = () => {
    const defaultQuery = 'order=desc'
    const queryArr = [defaultQuery];
    let url = initialApiUrlQuery.url;
    for (const key in searchValue) {
      const val = searchValue[key];
      switch (key) {
        case 'status':
          queryArr.push(`${key}=${val}`);
          break;
      }
    }
    
    const query = `${queryArr.join('&')}`;
    setApiUrlWithQuery((prevState) => ({
      ...prevState,
      query,
      url,
    }));
  };
  
  
  
  const onAllSelectItemsList = (checked) => {
    if (checked) {
      setSelectedItemList(itemList.map((item) => item.id)); // 모두 선택
    } else {
      setSelectedItemList([]); //초기화
    }
  };
  
  const onDeleteItemList = ()=>{
    if(!selectedItemList.length) return alert('선택된 항목이 없습니다.');
    if(confirm(`선택된 ${selectedItemList.length}개의 항목을 삭제하시겠습니까?`)){
      setItemList(prevState => {
        return prevState.filter((item)=> selectedItemList.indexOf(item.id) < 0);
      })
      setSelectedItemList([]);
    }
  };
  // 선택된 항목에 대하여 delete Item 실행한다.
  const valid_allCheckboxesChecked = () => {
    if (!Array.isArray(itemList) || !Array.isArray(selectedItemList) || itemList.length === 0) return;
    const allSelectedList = itemList.map((item) => item.id);
    return valid_isTheSameArray(allSelectedList, selectedItemList);
  };
  
  return (
    <>
      <MetaTitle title="리뷰 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">리뷰 관리</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTerm
                title={"조회기간"}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="처리상태"
                name="status"
                idList={global_reviewStateType.map(state=>state.ENG)}
                labelList={global_reviewStateType.map(state=>state.KOR)}
                value={searchValue.status}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                목록
                <ToolTip messagePosition={'left'} message={'체크박스는 리뷰 승인 및 베스트리뷰 선정에 사용됩니다.'} />
              </p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m">리뷰 승인</button>
                <button className="admin_btn line basic_m">
                  베스트 리뷰 선정
                </button>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>
                    <Checkbox onClick={onAllSelectItemsList} checked={valid_allCheckboxesChecked() || ''} />
                  </li>
                  <li className={s.table_th}>고유번호</li>
                  <li className={s.table_th}>처리상태</li>
                  <li className={s.table_th}>상품명</li>
                  <li className={`${s.table_th}`}>리뷰내용</li>
                  <li className={s.table_th}>평점</li>
                  <li className={s.table_th}>사용자 이름</li>
                  <li className={s.table_th}>사용자 ID</li>
                  <li className={s.table_th}>작성일</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {(() => {
                  if (isLoading.fetching) {
                    return <Spinner floating={true} />;
                  } else if (!itemList.length) {
                    return <AmdinErrorMessage text="조회된 데이터가 없습니다." />;
                  } else {
                    return (
                      <ReviewList
                        items={itemList}
                        setSelectedItems={setSelectedItemList}
                        selectedItems={selectedItemList}
                      />
                    );
                  }
                })()}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={apiUrlWithQuery.url}
                size={searchPageSize}
                setItemList={setItemList}
                queryItemList={apiDataQueryString}
                urlQuery={apiUrlWithQuery.query}
                setIsLoading={setIsLoading}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ReviewPage;
