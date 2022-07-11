import React, {useEffect, useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import { PopupCloseButton_typeX } from '/src/components/popup/PopupCloseButton';
import s from './searchUser.module.scss';
import Checkbox from '/src/components/atoms/Checkbox';
import UserList from './UserList';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import enterKey from '/util/func/enterKey';
import { transformDateWithHyphen, transformToday } from '/util/func/transformDate';
import {valid_isTheSameArray} from "/util/func/validation/validationPackage";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import Spinner from "/src/components/atoms/Spinner";
import {useMemberList} from "/store/data/test/user"; //  ! TESTTESTTESTTESTTESTTESTTEST



let initialSearchValues = {
  email: '',
  name: '',
  from: transformDateWithHyphen(2000, 1, 1),
  to: transformToday(),
};

export default function SearchUserPopup() {
  
  const TEST_MEMBERS = useMemberList();
  
  const getListApiUrl = '/api/admin/members';
  // const getListApiUrl = '/api/admin/members/publication';
  const searchPageSize = 10;
  const apiDataQueryString = 'queryMembersDtoList';
  // const apiDataQueryString = 'memberPublishResponseDtoList';

  const [isLoading, setIsLoading] = useState({});
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemList, setItemList] = useState(TEST_MEMBERS);
  const [selectedMemberIdList, setSelectedMemberIdList] = useState([]);
  
  
  
  // ! TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
  useEffect( () => {
    // setItemList(TEST_MEMBERS.concat(TEST_MEMBERS))
    setItemList(TEST_MEMBERS)
  }, [TEST_MEMBERS] );
  // ! TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
  
  

  const onSearchHandler = () => {
    const queryArr = [];
    for (const key in searchValues) {
      const val = searchValues[key];
      const thisQuery = `${key}=${val}`;
      queryArr.push(thisQuery);
    }

    const query = `${queryArr.join('&')}`;
    setSearchQuery(query);
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  
  
  const onCloseWindowHandler = () => {
    console.log(window.opener)
    if(selectedMemberIdList.length === 0 ){
      alert('선택된 회원이 없습니다.')
    }else if(selectedMemberIdList.length && confirm(`선택된 ${selectedMemberIdList.length}명의 회원을 추가 하시겠습니까?`) ){
        window.opener.onSuccess(selectedMemberIdList);
        window.close();
    }

  };
  
  const onAllSelectItemsList = (checked)=>{
    if(checked){
      setSelectedMemberIdList(itemList.map(item=> item.id)); // 모두 선택
    }else {
      setSelectedMemberIdList([]); //초기화
    }
  }

  const valid_allCheckboxesChecked = ()=>{
    if(!Array.isArray(itemList) || !Array.isArray(selectedMemberIdList)) return;
    const allSelectedList = itemList.map(item=>item.id);
    return valid_isTheSameArray(allSelectedList, selectedMemberIdList);
  };

  
  
  return (
    <>
      <MetaTitle title="회원 검색" />
      <div id={s.popup}>
        <PopupWrapper style={{ width: 820 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s['popup-title']}>회원검색</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <div className={s['search-wrap']}>
                <SearchTextWithCategory
                  className={s.searchBar}
                  searchValue={searchValues}
                  setSearchValue={setSearchValues}
                  onSearch={onSearchInputKeydown}
                  title="회원검색"
                  name="keyword"
                  id="keyword"
                  options={[
                    { label: '이메일', value: 'email' },
                    { label: '이름', value: 'name' },
                  ]}
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
              </div>
              <div className={`${s.cont_viewer} ${s.fixedHeight}`}>
                <div className={s.table}>
                  <ul className={`${s.table_header}`}>
                    <li className={s.table_th}>
                      <Checkbox onClick={onAllSelectItemsList} checked={valid_allCheckboxesChecked()}/>
                    </li>
                    <li className={s.table_th}>상세보기</li>
                    <li className={s.table_th}>등급</li>
                    <li className={s.table_th}>이름</li>
                    <li className={s.table_th}>아이디</li>
                    <li className={s.table_th}>휴대폰 번호</li>
                    <li className={s.table_th}>대표견명</li>
                    <li className={s.table_th}>누적구매금액</li>
                    <li className={s.table_th}>구독여부</li>
                    <li className={s.table_th}>장기미접속</li>
                  </ul>
                  {(() => {
                    if (isLoading.fetching) {
                      return <Spinner floating={true} />;
                    } else if (!itemList.length) {
                      return <AmdinErrorMessage text="검색결과가 존재하지 않습니다." />;
                    } else {
                      return <UserList items={itemList} setSelectedItems={setSelectedMemberIdList} selectedItems={selectedMemberIdList}/>;
                    }
                  })()}
                </div>
                <div className={s['pagination-section']}>
                  <PaginationWithAPI
                    apiURL={getListApiUrl}
                    urlQuery={searchQuery}
                    queryItemList={apiDataQueryString}
                    size={searchPageSize}
                    setItemList={setItemList}
                    setIsLoading={setIsLoading}
                  />
                </div>
              </div>
            </div>
          </main>
          <section className={s['btn-section']}>
            <button
              type={'button'}
              onClick={onCloseWindowHandler}
              className={'admin_btn solid confirm_l'}
            >
              고객추가
            </button>
          </section>
        </PopupWrapper>
      </div>
    </>
  );
}
