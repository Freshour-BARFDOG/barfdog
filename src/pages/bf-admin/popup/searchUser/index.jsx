import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import { PopupCloseButton_typeX } from '/src/components/popup/PopupCloseButton';
import s from './searchUser.module.scss';
import Checkbox from '/src/components/atoms/Checkbox';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import UserList from './UserList';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import Spinner from '../../../../components/atoms/Spinner';
import { FullScreenLoading } from '../../../../components/admin/fullScreenLoading';
import PaginationWithAPI from '../../../../components/atoms/PaginationWithAPI';
import { getData } from '../../../../../api/reqData';
import enterKey from "../../../../../util/func/enterKey";





let initialSearchValues = {
  email: '',
  name: '',
  from: '',
  to: '',
};




export default function SearchUserPopup() {
  const getListApiUrl = '/api/admin/members';
  const searchPageSize = 10;
  const apiDataQueryString = 'queryMembersDtoList';

  const [isLoading, setIsLoading] = useState({});
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemList, setItemList] = useState([1,2,3,49]);

  console.log(searchValues);
  console.log(searchQuery);

  const onCloseWindowHandler = () => {
    // 성공하고나서, window 닫는다.
    if (confirm('선택된 고객을 추가하시겠습니까')) {
      window.opener.onSuccess('전송할 데이터');
      window.close();
    }
  };
  
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
    console.log('실행')
    enterKey(e, onSearchHandler);
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
              <div className={s.cont_viewer}>
                <div className={s.table}>
                  <ul className={s.table_header}>
                    <li className={s.table_th}>
                      <Checkbox />
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
                      return <UserList items={itemList} />;
                    }
                  })()}
                  {}
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
